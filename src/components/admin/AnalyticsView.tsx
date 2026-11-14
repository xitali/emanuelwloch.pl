"use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsView({ analytics, total }: { analytics: { date: string; visits: number }[]; total: number }) {
  const last30 = analytics.reduce((sum, day) => sum + day.visits, 0);
  return <section className="admin-view" aria-labelledby="analytics-title">
    <header className="admin-view-head"><div><h2 id="analytics-title">Ruch na stronie</h2><p>Odsłony z ostatnich 30 dni, bez danych osobowych odwiedzających.</p></div></header>
    <dl className="admin-figures"><div><dt>Ostatnie 30 dni</dt><dd>{last30.toLocaleString("pl-PL")}</dd></div><div><dt>Od początku</dt><dd>{total.toLocaleString("pl-PL")}</dd></div></dl>
    <div className="admin-panel admin-chart">
      {analytics.length > 0 ? <ResponsiveContainer width="100%" height="100%">
        <LineChart data={analytics} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#232b31" vertical={false} />
          <XAxis dataKey="date" stroke="#a0a7ab" fontSize={12} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis stroke="#a0a7ab" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: "#13171a", borderColor: "#ffffff26", borderRadius: 8, color: "#efefea" }} itemStyle={{ color: "#acd1e8" }} />
          <Line type="monotone" dataKey="visits" name="Odsłony" stroke="#acd1e8" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#acd1e8" }} />
        </LineChart>
      </ResponsiveContainer> : <p className="admin-empty">Brak danych z ostatnich 30 dni.</p>}
    </div>
  </section>;
}
