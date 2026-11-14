"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import StageVisuals from "./StageVisuals";
import { IconArrowDown, IconArrowUpRight, layerIcons } from "./icons";
import { createSceneState, productLayers } from "./three/layers";
import { createScrollTimeline } from "./three/ScrollTimeline";
import type { Testimonial } from "@/types";
import { useMotionPaused } from "@/lib/motion/preference";

export const productKinds = [
  { title: "Strona firmowa", description: "Klient od razu wie, co oferujesz, i pisze albo dzwoni.", detail: "Oferta, realizacje i kontakt na każdym ekranie" },
  { title: "Sklep internetowy", description: "Katalog, koszyk i zamówienia, które obsłużysz z panelu.", detail: "Sprzedaż online z panelem zamówień" },
  { title: "Aplikacja i baza danych", description: "Dane firmy w jednym panelu zamiast w arkuszach i mailach.", detail: "Panel, role i baza dopasowane do Twojej pracy" },
  { title: "Program na Windows", description: "Narzędzie na komputer do konkretnego zadania.", detail: "Aplikacja desktopowa z lokalną bazą danych" },
];
export default function ProductStory({ testimonial }: { testimonial?: Testimonial }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [state] = useState(createSceneState);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useMotionPaused();
  useEffect(() => {
    const mobile = matchMedia("(max-width: 1023px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup: (() => void) | undefined;
    let frame = 0;
    const setup = () => {
      cleanup?.(); cancelAnimationFrame(frame);
      const reduce = motion.matches || paused;
      setCompact(mobile.matches); setReduced(reduce);
      Object.assign(state, { progress: reduce ? 1 : 0, explosion: 0, turn: 0, zoom: 0, retreat: 0 });
      setPhase(reduce ? 3 : 0);
      frame = requestAnimationFrame(() => {
        if (section.current && !reduce && !mobile.matches) cleanup = createScrollTimeline(section.current, state, false, setPhase);
        state.invalidate();
      });
    };
    setup();
    mobile.addEventListener("change", setup); motion.addEventListener("change", setup);
    const observer = new IntersectionObserver(([entry]) => { setActive(entry.isIntersecting && !document.hidden); if (entry.isIntersecting) setReady(true); }, { rootMargin: "100px" });
    if (stage.current) observer.observe(stage.current);
    const visibility = () => {
      const bounds = stage.current?.getBoundingClientRect();
      setActive(!document.hidden && Boolean(bounds && bounds.bottom > 0 && bounds.top < innerHeight));
    };
    document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame); cleanup?.(); observer.disconnect(); mobile.removeEventListener("change", setup); motion.removeEventListener("change", setup); document.removeEventListener("visibilitychange", visibility); };
  }, [state, paused]);
  const selectPhase = (index: number) => {
    if (compact || reduced) {
      state.seek((index + 0.5) / 4);
      setPhase(index);
    } else if (section.current) {
      const bounds = section.current.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + bounds.top + Math.max(0, bounds.height - innerHeight) * (index + 0.5) / 4, behavior: "smooth" });
    }
  };
  return <section ref={section} className={`product-story offer-story${reduced ? " is-reduced" : ""}`} aria-label="Strony, sklepy, aplikacje i programy dla firm">
    <div ref={stage} className="product-stage">
      <div className="product-stage-grid" aria-hidden="true" />
      <div className="product-hero-copy">
        <h1>Strony, sklepy,<br />{" "}aplikacje i programy<br />{" "}<span>dla Twojej firmy.</span></h1>
        <p className="product-intro">Zaprojektuję i zaprogramuję to, czego potrzebuje Twoja firma: stronę z ofertą, sklep, panel z bazą danych albo program na Windows.<br />{" "}Od pierwszej rozmowy do wdrożenia pracujesz ze mną.</p>
        <div className="portfolio-actions"><a className="portfolio-button" href="#kontakt">Omów projekt <IconArrowUpRight size={18} /></a><a className="portfolio-text-link" href="#projekty">Zobacz realizacje <IconArrowUpRight size={16} /></a></div>
        <div className="hero-person">
          <Image src="/emanuel_wloch.jpg" alt="Emanuel Włoch" width={48} height={48} sizes="(max-width: 1023px) 40px, 48px" className="hero-person-photo" />
          <div><strong>Emanuel Włoch</strong><p>Porozmawiasz bezpośrednio ze mną o swoim projekcie.</p></div>
        </div>
        {testimonial && <figure className="hero-proof"><blockquote>„{testimonial.content.split(/(?<=[.!?])\s/)[0]}”</blockquote><figcaption>{testimonial.client_name}{testimonial.company ? ` · ${testimonial.company}` : ""}<a href="#opinie">Przeczytaj opinie <IconArrowUpRight size={13} /></a></figcaption></figure>}
      </div>
      <div className="product-visual">

        <StageVisuals phase={phase} state={state} active={active} compact={compact} reduced={reduced} ready={ready} />
        <div className="delivery-caption"><span>0{phase + 1} / 04 · PRAWDZIWE EKRANY Z REALIZACJI</span><strong>{productKinds[phase].title}</strong><small>{productKinds[phase].detail}</small></div>
        <div className="hero-scene-tabs" aria-label="Wybierz rodzaj projektu">{productKinds.map((kind,index) => <button key={kind.title} type="button" aria-pressed={phase===index} onClick={()=>selectPhase(index)}>{kind.title.split(" ")[0]}</button>)}</div>
      </div>
      <ol className="delivery-stages" aria-label="Co mogę dla Ciebie zbudować">{productKinds.map((kind, index) => <li key={kind.title} className={phase === index ? "is-current" : ""} aria-current={phase === index ? "true" : undefined}><button type="button" className="delivery-stage-trigger" aria-label={`Pokaż: ${kind.title}`} aria-pressed={phase===index} onClick={()=>selectPhase(index)}><span>0{index + 1}</span><div><strong>{kind.title}</strong><p>{kind.description}</p></div></button></li>)}</ol>
      <div className="product-stage-footer"><a href="#uslugi"><IconArrowDown size={15} /><span>WYBIERZ, CZEGO POTRZEBUJESZ</span></a><span className="product-footer-note">PROJEKT · KOD · BAZA DANYCH · WDROŻENIE</span><button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Włącz animacje" : "Ogranicz ruch"}</button></div>
    </div>
  </section>;
}
export function TechnologyDetails() {
  return <section id="technologie" className="portfolio-stack" aria-labelledby="stack-heading">
    <div><h2 id="stack-heading">Technologia wspiera<br />{" "}<span>Twój cel.</span></h2><p>Nie musisz wybierać technologii.<br />{" "}Dobiorę ją do tego, co ma robić Twoja strona lub aplikacja.</p></div>
    <div className="stack-details">{productLayers.map((layer, i) => { const LayerIcon = layerIcons[layer.id as keyof typeof layerIcons]; return <details key={layer.id} open={i === 0}><summary><span>0{i + 1}</span><LayerIcon size={20} />{layer.label}<span className="detail-plus">+</span></summary><p>{layer.description}</p><div className="portfolio-tags">{layer.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></details>; })}</div>
  </section>;
}
