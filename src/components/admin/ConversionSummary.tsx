import { turso } from "@/lib/server/turso";

export default async function ConversionSummary() {
  const result = await turso.execute("SELECT event_name, SUM(event_count) AS count FROM daily_events WHERE event_date >= date('now','-30 days') GROUP BY event_name");
  const leads = await turso.execute("SELECT COUNT(*) AS count FROM contact_messages WHERE created_at >= datetime('now','-30 days')");
  const labels: Record<string, string> = { contact_cta: "Kliknięcia kontaktu", live_project: "Przejścia do wykonanych stron", project_view: "Otwarcia opisów realizacji" };
  return <aside className="p-5 bg-[var(--p-surface)] text-white border-b border-[var(--p-border)]"><h2 className="font-semibold">Ostatnie 30 dni — zdarzenia i zapytania</h2><p>Zapytania zapisane w formularzu: {String(leads.rows[0].count)}</p>{result.rows.map(row => <p key={String(row.event_name)}>{labels[String(row.event_name)]}: {String(row.count)}</p>)}<p className="text-sm text-[var(--p-muted)]">To liczniki zdarzeń, nie liczba osób. Bez identyfikatorów użytkowników i ciasteczek analitycznych.</p></aside>;
}
