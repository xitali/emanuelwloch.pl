"use client";
import type { Testimonial } from "@/types";
import { IconQuote, IconStar } from "@/components/portfolio/icons";

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null;
  return <section id="opinie" className="portfolio-testimonials" aria-labelledby="testimonials-heading"><div className="portfolio-container">
    <header className="portfolio-section-heading"><div><h2 id="testimonials-heading">Dobra współpraca.<br />{" "}<span>Prawdziwe opinie.</span></h2></div><p>Doświadczenia osób,<br />{" "}z którymi tworzyłem.</p></header>
    <div className="testimonial-grid" data-stagger>{testimonials.map(item => <article className="testimonial-card" key={item.id} data-spotlight>
      <div className="testimonial-head"><div className="testimonial-rating" aria-label={`Ocena: ${item.rating} na 5`}>{Array.from({length: 5}, (_,i) => <IconStar key={i} size={15} filled={i < item.rating} />)}</div><IconQuote className="testimonial-quote-icon" size={26} /></div>
      <blockquote>{item.content}</blockquote><footer><strong>{item.client_name}</strong>{item.company && <p>{item.company}</p>}</footer>
    </article>)}</div>
  </div></section>;
}
