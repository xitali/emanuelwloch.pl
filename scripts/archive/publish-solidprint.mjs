import { createClient } from "@libsql/client";
import { access } from "node:fs/promises";

if (!process.argv.includes("--apply")) throw new Error("Uruchom z --apply, aby opublikować Solid Print.");
await access(new URL("../public/projects/solid-print/strona-glowna.webp", import.meta.url));
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
try {
  const result = await db.execute({
    sql: `UPDATE projects SET images = ?, image_alts = ?, project_url = ?, is_published = 1, featured = 1, updated_at = ? WHERE slug = ? AND project_status = 'in-development' RETURNING id`,
    args: [JSON.stringify(["/projects/solid-print/strona-glowna.webp"]), JSON.stringify(["Strona Solid Print z ofertą projektowania i druku 3D oraz wizualizacją druku warstwowego"]), "https://solidprint.emanuelwloch.pl/", new Date().toISOString(), "solid-print"],
  });
  if (result.rows.length !== 1) throw new Error("Nie znaleziono jednoznacznego projektu Solid Print w wersji testowej.");
  console.log("Solid Print published as a test version.");
} finally { db.close(); }
