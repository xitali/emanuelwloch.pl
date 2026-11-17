import { describe, expect, it } from "vitest";
import { createClient } from "@libsql/client";
import { readFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { upgradePublishing } from "../scripts/upgrade-project-publishing.mjs";
import { upgradePortfolio } from "../scripts/upgrade-portfolio.mjs";
import { getProjectPath } from "../src/lib/content/seo";

describe("publikacja i trwałe adresy", () => {
  it("zachowuje dane, rozwiązuje kolizje i jest idempotentna", async () => {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-publishing-"));
    const db = createClient({ url: `file:${join(directory, "test.db").replaceAll("\\", "/")}` });
    try {
      await db.executeMultiple(await readFile("migrations/000_baseline.sql", "utf8"));
      for (const id of ["a", "b"]) await db.execute({ sql: "INSERT INTO projects (id,title,short_description,category) VALUES (?, ?, ?, 'web')", args: [id, "Żółty projekt", "Opis klienta"] });
      await upgradePublishing(db);
      expect((await db.execute("SELECT slug FROM projects ORDER BY id")).rows.map(row => row.slug)).toEqual(["zolty-projekt", "zolty-projekt-2"]);
      await db.execute("UPDATE projects SET title = 'Nowy tytuł', is_published = 0 WHERE id = 'a'");
      await upgradePublishing(db);
      expect((await db.execute("SELECT slug FROM projects WHERE id = 'a'")).rows[0].slug).toBe("zolty-projekt");
      expect((await db.execute("SELECT * FROM projects WHERE is_published = 1")).rows).toHaveLength(1);
      expect((await db.execute("SELECT short_description FROM projects WHERE id = 'a'")).rows[0].short_description).toBe("Opis klienta");
      expect(getProjectPath({ id: "a", title: "Nowy tytuł", slug: "zolty-projekt" })).toBe("/projekty/zolty-projekt");
      await upgradePortfolio(db);
      await upgradePortfolio(db);
      expect((await db.execute("PRAGMA table_info(projects)")).rows.some(row => row.name === "preview_video")).toBe(true);
      expect((await db.execute("SELECT COUNT(*) AS count FROM email_outbox")).rows[0].count).toBe(0);
    } finally { db.close(); }
  });
});
