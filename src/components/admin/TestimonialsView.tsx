"use client";
import { Star, Trash2 } from "lucide-react";
import { createTestimonialAction, deleteTestimonialAction } from "@/app/actions/admin";
import type { Testimonial } from "@/types";
import { useAdmin } from "./AdminContext";

export default function TestimonialsView({ testimonials }: { testimonials: Testimonial[] }) {
  const { run, busy } = useAdmin();

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    if (await run(async () => { await createTestimonialAction(data); return { success: true }; }, "Opublikowano opinię.")) formElement.reset();
  }

  async function remove(item: Testimonial) {
    if (!confirm(`Usunąć opinię: ${item.client_name}?`)) return;
    await run(() => deleteTestimonialAction(item.id), "Usunięto opinię.");
  }

  return <section className="admin-view" aria-labelledby="testimonials-title">
    <header className="admin-view-head"><div><h2 id="testimonials-title">Opinie klientów</h2><p>Publikuj opinie dosłownie, tak jak napisał je klient.</p></div></header>
    <div className="admin-split">
      <form onSubmit={create} className="admin-panel admin-form admin-card">
        <h3>Dodaj opinię</h3>
        <label htmlFor="t-name">Imię i nazwisko lub nazwa klienta *</label><input id="t-name" name="client_name" required />
        <label htmlFor="t-company">Firma (opcjonalnie)</label><input id="t-company" name="company" />
        <label htmlFor="t-content">Treść opinii *</label><textarea id="t-content" name="content" required rows={4} />
        <label htmlFor="t-rating">Ocena (1–5) *</label><input id="t-rating" type="number" name="rating" min={1} max={5} defaultValue={5} required className="admin-narrow" />
        <button type="submit" disabled={busy} className="admin-primary">{busy ? "Publikowanie…" : "Opublikuj opinię"}</button>
      </form>
      <ul className="admin-quotes">{testimonials.length === 0 ? <li className="admin-empty">Brak opinii.</li> : testimonials.map(item => <li key={item.id} className="admin-panel admin-card">
        <header><div><strong>{item.client_name}</strong>{item.company && <small>{item.company}</small>}</div><button type="button" className="admin-icon admin-danger" aria-label={`Usuń opinię: ${item.client_name}`} onClick={() => remove(item)}><Trash2 className="w-4 h-4" /></button></header>
        <div className="admin-stars" aria-label={`Ocena ${item.rating} na 5`}>{Array.from({ length: item.rating }, (_, i) => <Star key={i} className="w-4 h-4" aria-hidden="true" />)}</div>
        <blockquote>{item.content}</blockquote>
      </li>)}</ul>
    </div>
  </section>;
}
