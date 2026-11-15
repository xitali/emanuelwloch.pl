"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import OfferStage from "./OfferStage";
import { IconArrowUpRight as ArrowUpRight } from "./icons";
import type { Service } from "@/types";
import { openContactForm } from "@/lib/contact-prefill";
import ProfessionalServicesSection from "@/components/ProfessionalServicesSection";

import { formatPriceFrom, servicePaths } from "@/lib/service-paths";

const WIDE = "(min-width: 1180px)";
const subscribeWide = (onChange: () => void) => { const query = matchMedia(WIDE); query.addEventListener("change", onChange); return () => query.removeEventListener("change", onChange); };
const useWide = () => useSyncExternalStore(subscribeWide, () => matchMedia(WIDE).matches, () => false);

export default function ServicePaths({ services }: { services: Service[] }) {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const wide = useWide();
  // The row crossing the middle of the viewport is the one the stage shows.
  useEffect(() => {
    if (!wide || !list.current) return;
    const rows = [...list.current.children] as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(rows.indexOf(entry.target as HTMLElement));
    }, { rootMargin: "-48% 0px -48% 0px" });
    rows.forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, [wide]);
  return <section ref={section} id="uslugi" className={`service-paths portfolio-container${wide ? " has-stage" : ""}`} aria-labelledby="paths-heading">
    <header className="portfolio-section-heading"><div><h2 id="paths-heading">Zacznij od problemu.<br />{" "}<span>Rozwiązanie dobiorę.</span></h2></div><p>Nie musisz wiedzieć, czy potrzebujesz strony, aplikacji czy programu.<br />{" "}Wybierz sytuację najbliższą Twojej.</p></header>
    <div className="service-paths-body">
    <ol ref={list} className="service-path-list" data-stagger>{servicePaths.map((path, index) => <li key={path.href} className="service-path-row" data-current={wide && active === index} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)}>
      <Link className="service-path-thumb" href={path.href} tabIndex={-1} aria-hidden="true"><Image src={path.image} alt="" fill sizes="(max-width: 767px) 92vw, 280px" /><span>{path.imageLabel}</span></Link>
      <div className="service-path-main"><h3><Link href={path.href}>{path.title}</Link></h3><p className="service-path-problem">{path.problem}</p></div>
      <div className="service-path-scope"><p>{path.scope}</p><p className="service-path-price">{formatPriceFrom(path.priceFrom)}</p></div>
      <div className="service-path-actions">
        <button type="button" className="portfolio-button portfolio-button--secondary" onClick={() => openContactForm({ subject: path.title, message: `Interesuje mnie: ${path.title.toLowerCase()}.\nCo chcę rozwiązać: \nPlanowany termin: `, badge: "Wybrany rodzaj projektu został wpisany do formularza." })}>Omów projekt <ArrowUpRight size={16} /></button>
        <Link className="portfolio-text-link" href={path.href}>Zakres i pytania <ArrowUpRight size={15} /></Link>
      </div>
    </li>)}</ol>
    {wide && <OfferStage active={active} track={section} />}
    </div>
    <p className="service-price-note">Wszystkie podane ceny i orientacyjne wyceny są cenami netto. Przed rozpoczęciem dostaniesz zakres prac i dokładną wycenę.</p>
    <details className="service-more"><summary>Pozostałe usługi i orientacyjna wycena <span aria-hidden="true">+</span></summary><ProfessionalServicesSection initialServices={services} sectionId="szczegoly-uslug" /></details>
  </section>;
}
