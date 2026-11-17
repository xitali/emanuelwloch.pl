/** Page visit counter and the admin traffic chart. */
import "server-only";
import { turso } from "@/lib/server/turso";

export async function recordPageVisit(pagePath: string) {
  try {
    const viewDate = new Date().toISOString().slice(0, 10);
    await turso.execute({
      sql: `INSERT INTO daily_page_views (view_date, page_path, view_count)
            VALUES (?, ?, 1)
            ON CONFLICT(view_date, page_path)
            DO UPDATE SET view_count = view_count + 1`,
      args: [viewDate, pagePath],
    });
  } catch (err) {
    console.error("Error recording page visit:", err);
  }
}

export async function getPageVisitsCount(): Promise<number> {
  try {
    const result = await turso.execute(
      "SELECT COALESCE(SUM(view_count), 0) as count FROM daily_page_views",
    );
    return Number(result.rows[0]?.count || 0);
  } catch {
    return 0;
  }
}

export async function getPageVisitsStats() {
  try {
    const result = await turso.execute(`
      SELECT view_date as date, SUM(view_count) as count
      FROM daily_page_views
      GROUP BY view_date
      ORDER BY view_date DESC
      LIMIT 30
    `);
    
    // Formatujemy dla Recharts (od najstarszej daty do najnowszej)
    const stats = result.rows.map(row => ({
      date: String(row.date),
      visits: Number(row.count)
    })).reverse();
    
    return stats;
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return [];
  }
}
