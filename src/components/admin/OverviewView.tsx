"use client";
import { ArrowRight } from "lucide-react";
import { isOpenMessage, messageStatusLabel, normalizeMessageStatus } from "@/lib/contact/message-status";
import type { ContactMessage, Project, Testimonial } from "@/types";
import type { AdminTab } from "./AdminDashboard";

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (time: number) => { const date = new Date(time); date.setHours(0, 0, 0, 0); return date.getTime(); };
/** Calendar days, so a message from yesterday evening reads "wczoraj", not "dzisiaj". */
export const ago = (value?: string, now = Date.now()) => {
  if (!value) return "";
  const days = Math.round((startOfDay(now) - startOfDay(new Date(value).getTime())) / DAY);
  return days <= 0 ? "dzisiaj" : days === 1 ? "wczoraj" : `${days} dni temu`;
};

/** First screen: what needs attention today, then the state of the site. */
export default function OverviewView({ messages, projects, testimonials, analytics, onOpen, now }: { messages: ContactMessage[]; projects: Project[]; testimonials: Testimonial[]; analytics: { date: string; visits: number }[]; onOpen: (tab: AdminTab, messageId?: string) => void; now?: number }) {
  const open = messages.filter(m => isOpenMessage(m.status));
  const fresh = messages.filter(m => normalizeMessageStatus(m.status) === "unread");
  const visits7 = analytics.slice(-7).reduce((sum, d) => sum + d.visits, 0);
  const testing = projects.filter(p => p.project_status === "in-development").length;

  return <section className="admin-view" aria-labelledby="overview-title">
    <header className="admin-view-head"><div><h2 id="overview-title">{fresh.length ? `Masz ${fresh.length} ${fresh.length === 1 ? "nową wiadomość" : fresh.length < 5 ? "nowe wiadomości" : "nowych wiadomości"}` : "Wszystko na bieżąco"}</h2><p>{open.length ? `${open.length} ${open.length === 1 ? "zapytanie czeka" : "zapytań czeka"} na odpowiedź lub dalsze kroki.` : "Nie ma zapytań, które czekają na Twoją odpowiedź."}</p></div></header>

    <div className="admin-overview">
      <div className="admin-panel admin-card">
        <div className="admin-card-head"><h3>Czeka na Ciebie</h3><button type="button" className="admin-link" onClick={() => onOpen("messages")}>Wszystkie wiadomości <ArrowRight className="w-4 h-4" /></button></div>
        {open.length === 0 ? <p className="admin-empty">Brak otwartych zapytań.</p> : <ul className="admin-inbox">{open.slice(0, 5).map(m => <li key={m.id}>
          <button type="button" onClick={() => onOpen("messages", m.id)}>
            <span className={`admin-dot admin-dot--${normalizeMessageStatus(m.status)}`} aria-hidden="true" />
            <span className="admin-inbox-main"><strong>{m.subject}</strong><small>{m.name} · {ago(m.created_at, now)}</small></span>
            <span className="admin-badge">{messageStatusLabel(m.status)}</span>
          </button>
        </li>)}</ul>}
      </div>

      <dl className="admin-figures admin-figures--stack">
        <div><dt>Odsłony w 7 dni</dt><dd>{visits7.toLocaleString("pl-PL")}</dd><button type="button" className="admin-link" onClick={() => onOpen("analytics")}>Ruch <ArrowRight className="w-4 h-4" /></button></div>
        <div><dt>Realizacje</dt><dd>{projects.length}</dd><small>{testing ? `${testing} w wersji testowej` : "wszystkie gotowe"}</small><button type="button" className="admin-link" onClick={() => onOpen("projects")}>Realizacje <ArrowRight className="w-4 h-4" /></button></div>
        <div><dt>Opinie</dt><dd>{testimonials.length}</dd><button type="button" className="admin-link" onClick={() => onOpen("testimonials")}>Opinie <ArrowRight className="w-4 h-4" /></button></div>
      </dl>
    </div>
  </section>;
}
