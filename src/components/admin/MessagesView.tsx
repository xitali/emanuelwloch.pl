"use client";
import { useEffect, useState } from "react";
import { Mail, MessageSquareHeart, Trash2 } from "lucide-react";
import { deleteMessageAction, requestReviewAction, updateMessageStatusAction } from "@/app/actions/admin";
import { messageStatuses, normalizeMessageStatus, type MessageStatus } from "@/lib/message-status";
import type { ContactMessage } from "@/types";
import { useAdmin } from "./AdminContext";

/** Resend delivery states, as the webhook records them. */
const DELIVERY: Record<string, { label: string; tone: "ok" | "wait" | "bad" }> = {
  sent: { label: "wysłany", tone: "wait" }, delivery_delayed: { label: "opóźniony", tone: "wait" }, delivered: { label: "doręczony", tone: "ok" },
  bounced: { label: "odrzucony — sprawdź adres", tone: "bad" }, failed: { label: "niewysłany", tone: "bad" }, complained: { label: "oznaczony jako spam", tone: "bad" },
};

const formatDate = (value?: string) => value ? new Date(value).toLocaleString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

export default function MessagesView({ messages, focusId }: { messages: ContactMessage[]; focusId?: string }) {
  const { run, demo } = useAdmin();
  const [filter, setFilter] = useState<MessageStatus | "all">("all");
  // Demo keeps status changes on screen so the flow can be tried; nothing reaches the server.
  const [local, setLocal] = useState<Record<string, MessageStatus>>({});
  const statusOf = (message: ContactMessage) => local[message.id] ?? normalizeMessageStatus(message.status);
  const visible = messages.filter(message => filter === "all" || statusOf(message) === filter);

  useEffect(() => {
    if (!focusId) return;
    window.setTimeout(() => document.getElementById(`message-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  }, [focusId]);

  async function changeStatus(message: ContactMessage, status: MessageStatus) {
    setLocal(current => ({ ...current, [message.id]: status }));
    if (demo) return;
    const saved = await run(() => updateMessageStatusAction(message.id, status), "Zmieniono status wiadomości.");
    if (!saved) setLocal(current => { const next = { ...current }; delete next[message.id]; return next; });
  }

  async function askForReview(message: ContactMessage) {
    if (demo) return;
    if (!confirm(`Za 7 dni ${message.name} dostanie mail z prośbą o krótką opinię o współpracy. Zaplanować?`)) return;
    await run(() => requestReviewAction(message.id), "Zaplanowano prośbę o opinię za 7 dni.");
  }

  async function remove(message: ContactMessage) {
    if (!confirm(`Usunąć wiadomość od: ${message.name}?`)) return;
    await run(() => deleteMessageAction(message.id), "Usunięto wiadomość.");
  }

  return <section className="admin-view" aria-labelledby="messages-title">
    <header className="admin-view-head">
      <div><h2 id="messages-title">Wiadomości od klientów</h2><p>Zapytania z formularza kontaktowego. Oznacz, na czym stoisz z każdym z nich.</p></div>
    </header>
    <div className="admin-filters" role="group" aria-label="Filtruj według statusu">
      {[{ id: "all" as const, label: "Wszystkie" }, ...messageStatuses].map(item => {
        const count = item.id === "all" ? messages.length : messages.filter(m => statusOf(m) === item.id).length;
        return <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label} <span>{count}</span></button>;
      })}
    </div>
    {visible.length === 0 ? <p className="admin-empty">{messages.length ? "Brak wiadomości z tym statusem." : "Nie masz jeszcze wiadomości. Nowe zapytania pojawią się tutaj."}</p> :
      <ul className="admin-messages">{visible.map(message => {
        const status = statusOf(message);
        return <li id={`message-${message.id}`} key={message.id} className={`admin-message admin-message--${status}`}>
          <header>
            <div><strong>{message.name}</strong><a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>{message.email}</a></div>
            <time dateTime={message.created_at}>{formatDate(message.created_at)}</time>
          </header>
          <h3>{message.subject}</h3>
          <p>{message.message}</p>
          {message.delivery?.sender && <p className={`admin-delivery admin-delivery--${DELIVERY[message.delivery.sender]?.tone ?? "wait"}`}>Potwierdzenie do klienta: {DELIVERY[message.delivery.sender]?.label ?? message.delivery.sender}</p>}
          <footer>
            <label>Status
              <select value={status} onChange={event => changeStatus(message, event.target.value as MessageStatus)}>{messageStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
            </label>
            <a className="admin-secondary" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}><Mail className="w-4 h-4" /> Odpowiedz</a>
            {(status === "replied" || status === "closed") && (message.review_requested_at
              ? <span className="admin-review-note">Prośba o opinię zaplanowana {formatDate(message.review_requested_at)}</span>
              : <button type="button" className="admin-secondary" onClick={() => askForReview(message)}><MessageSquareHeart className="w-4 h-4" /> Poproś o opinię</button>)}
            <button type="button" className="admin-icon admin-danger" aria-label={`Usuń wiadomość od: ${message.name}`} onClick={() => remove(message)}><Trash2 className="w-4 h-4" /></button>
          </footer>
        </li>;
      })}</ul>}
  </section>;
}
