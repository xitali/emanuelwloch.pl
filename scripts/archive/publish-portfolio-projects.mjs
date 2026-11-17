import { createClient } from "@libsql/client";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Publication is deliberately separate from shipping the screenshot assets.
const apply = process.argv.includes("--apply");
const local = process.argv.includes("--local-preview");
const manifest = process.argv.find(arg => arg.startsWith("--manifest="))?.slice("--manifest=".length);
const records = JSON.parse(await readFile(manifest ? resolve(manifest) : new URL("../content/portfolio-projects.json", import.meta.url), "utf8"));
if (!local && (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN)) throw new Error("Brak konfiguracji bazy.");
if (!local && apply) {
  for (const record of records) for (const image of record.images) {
    const response = await fetch(`https://emanuelwloch.pl${image}`, { method: "HEAD" });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`Najpierw opublikuj obraz: ${image}`);
  }
}
const db = createClient(local ? { url: "file:D:/emanuelwloch.pl/.debug/design-preview.db" } : { url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
try {
  const before = [];
  const statements = [];
  for (const record of records) {
    const existing = await db.execute({ sql: "SELECT * FROM projects WHERE slug = ? OR id = ?", args: [record.slug, record.id] });
    if (existing.rows.length > 1) throw new Error(`Niejednoznaczny projekt: ${record.slug}`);
    if (record.slug === "solid-print" && !local && existing.rows[0]?.project_status !== "in-development") throw new Error("Solid Print musi pozostać wersją testową.");
    before.push(...existing.rows);
    const data = { ...record, id: existing.rows[0]?.id || record.id, is_published: 1, updated_at: new Date().toISOString() };
    const columns = Object.keys(data);
    statements.push({
      sql: `INSERT INTO projects (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")}) ON CONFLICT(id) DO UPDATE SET ${columns.filter(c => c !== "id").map(c => `${c}=excluded.${c}`).join(",")}`,
      args: columns.map(c => Array.isArray(data[c]) ? JSON.stringify(data[c]) : typeof data[c] === "boolean" ? Number(data[c]) : data[c]),
    });
  }
  if (!apply) { console.log(`Podgląd: ${records.length} projektów; brak zmian. Użyj --apply po wdrożeniu obrazów.`); }
  else {
    await mkdir(new URL("../.debug/", import.meta.url), { recursive: true });
    await writeFile(new URL(`../.debug/portfolio-before-${Date.now()}.json`, import.meta.url), JSON.stringify(before, null, 2));
    await db.batch(statements, "write");
    console.log(`Zaktualizowano ${records.length} opisów i galerii${local ? " w lokalnym podglądzie" : " w katalogu"}.`);
  }
} finally { db.close(); }
