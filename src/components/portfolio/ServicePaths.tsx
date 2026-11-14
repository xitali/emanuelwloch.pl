"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight as ArrowUpRight } from "./icons";
import type { Service } from "@/types";
import { openContactForm } from "@/lib/contact-prefill";
import ProfessionalServicesSection from "@/components/ProfessionalServicesSection";

import { formatPriceFrom, servicePaths } from "@/lib/service-paths";

export default function ServicePaths({ services }: { services: Service[] }) {
  return <section id="uslugi" className="service-paths portfolio-container" aria-labelledby="paths-heading">
    <header className="portfolio-section-heading"><div><h2 id="paths-heading">Zacznij od problemu.<br />{" "}<span>Rozwiązanie dobiorę.</span></h2></div><p>Nie musisz wiedzieć, czy potrzebujesz strony, aplikacji czy programu.<br />{" "}Wybierz sytuację najbliższą Twojej.</p></header>
    <ol className="service-path-list" data-stagger>{servicePaths.map(path => <li key={path.href} className="service-path-row">
      <Link className="service-path-thumb" href={path.href} tabIndex={-1} aria-hidden="true"><Image src={path.image} alt="" fill sizes="(max-width: 767px) 92vw, 280px" /><span>{path.imageLabel}</span></Link>
      <div className="service-path-main"><h3><Link href={path.href}>{path.title}</Link></h3><p className="service-path-problem">{path.problem}</p></div>
      <div className="service-path-scope"><p>{path.scope}</p><p className="service-path-price">{formatPriceFrom(path.priceFrom)}</p></div>
      <div className="service-path-actions">
        <button type="button" className="portfolio-button portfolio-button--secondary" onClick={() => openContactForm({ subject: path.title, message: `Interesuje mnie: ${path.title.toLowerCase()}.\nCo chcę rozwiązać: \nPlanowany termin: `, badge: "Wybrany rodzaj projektu został wpisany do formularza." })}>Omów projekt <ArrowUpRight size={16} /></button>
        <Link className="portfolio-text-link" href={path.href}>Zakres i pytania <ArrowUpRight size={15} /></Link>
      </div>
    </li>)}</ol>
    <p className="service-price-note">Wszystkie podane ceny i orientacyjne wyceny są cenami netto. Przed rozpoczęciem dostaniesz zakres prac i dokładną wycenę.</p>
    <details className="service-more"><summary>Pozostałe usługi i orientacyjna wycena <span aria-hidden="true">+</span></summary><ProfessionalServicesSection initialServices={services} sectionId="szczegoly-uslug" /></details>
  </section>;
}
