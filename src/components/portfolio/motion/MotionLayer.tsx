"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMotionPaused } from "@/lib/motion/preference";
import { ease, gsap, registerGsap, ScrollTrigger, SplitText } from "@/lib/motion/gsap";

const HEADINGS = ".portfolio-section-heading h2, .portfolio-about h2, .portfolio-stack h2";
const MAGNETIC = ".portfolio-button, .showcase-arrow";

type Quick = { x: number; y: number };

/**
 * Warstwa animacji strony (GSAP 3.15: ScrollTrigger + SplitText + matchMedia).
 *
 * Zasady:
 *  1. Stan początkowy ukrycia ustawia CSS (`html.js-motion`), nie JS — brak migotania po hydracji.
 *  2. JS tylko odsłania elementy; nic nie zmienia układu (transform / opacity / clip-path).
 *  3. Wszystko żyje w `gsap.matchMedia()` — przy `prefers-reduced-motion` zero animacji i zero ukrywania.
 *  4. Sprzątanie: `mm.revert()` zdejmuje triggery, SplitText i style inline.
 */
export default function MotionLayer() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [paused] = useMotionPaused();

  useEffect(() => {
    registerGsap();
    const root = document.documentElement;
    const scope = document.querySelector<HTMLElement>(".portfolio-home, .portfolio-site");
    if (!scope) return;
    if (paused) { root.classList.remove("js-motion"); return; }

    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" }, context => {
      const { motion, fine } = (context.conditions ?? {}) as { motion?: boolean; fine?: boolean };
      if (!motion) { root.classList.remove("js-motion"); return; }
      root.classList.add("js-motion");

      /* —— 1. Intro hero: linie nagłówka wjeżdżają spod maski, reszta po nich —— */
      const h1 = scope.querySelector<HTMLElement>(".product-hero-copy h1");
      if (h1) {
        let introPlayed = false;
        SplitText.create(h1, {
          type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
          onSplit(self) {
            if (introPlayed) return gsap.set(self.lines, { yPercent: 0 });
            introPlayed = true;
            return gsap.from(self.lines, { yPercent: 110, duration: 1.25, ease: ease.out, stagger: 0.13, delay: 0.1 });
          },
        });
        gsap.set(h1, { visibility: "visible" });
        const rest = gsap.utils.toArray<HTMLElement>(".product-hero-copy > :not(h1)", scope);
        gsap.fromTo(rest, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, ease: ease.out, stagger: 0.1, delay: 0.5, clearProps: "transform" });
        gsap.fromTo(".product-visual", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.6, ease: ease.out, delay: 0.3, clearProps: "transform" });
      }

      /* —— 2. Nagłówki sekcji: maskowane linie, odtwarzane raz —— */
      const played = new WeakSet<HTMLElement>();
      gsap.utils.toArray<HTMLElement>(HEADINGS, scope).forEach(heading => {
        SplitText.create(heading, {
          type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
          onSplit(self) {
            gsap.set(heading, { visibility: "visible" });
            // Ponowny podział (resize / załadowanie fontu) nie może odtwarzać animacji.
            if (played.has(heading)) return gsap.set(self.lines, { yPercent: 0 });
            return gsap.from(self.lines, {
              yPercent: 108, duration: 1.15, ease: ease.out, stagger: 0.1,
              scrollTrigger: { trigger: heading, start: "top 88%", once: true, onEnter: () => played.add(heading) },
            });
          },
        });
      });

      /* —— 3. Odsłanianie elementów: data-reveal (fade-up | clip | line) i data-stagger ——
             Funkcja jest idempotentna i wywoływana też przez MutationObserver, dlatego
             karty dodane później (np. po zmianie filtra katalogu) nie zostają ukryte. */
      const bound = new WeakSet<Element>();
      const bind = () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]", scope).forEach(el => {
          if (bound.has(el)) return;
          bound.add(el);
          const kind = el.dataset.reveal;
          const trigger = { trigger: el, start: "top 90%", once: true };
          if (kind === "clip") {
            const img = el.querySelector<HTMLElement>("img");
            gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 12px)", duration: 1.4, ease: ease.inOut, scrollTrigger: trigger });
            if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: ease.out, scrollTrigger: trigger });
          } else if (kind === "line") {
            gsap.to(el, { scaleX: 1, duration: 1.4, ease: ease.inOut, scrollTrigger: trigger });
          } else {
            gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: ease.out, clearProps: "transform", scrollTrigger: trigger });
          }
        });
        gsap.utils.toArray<HTMLElement>("[data-stagger]", scope).forEach(group => {
          if (bound.has(group)) return;
          bound.add(group);
          gsap.fromTo(Array.from(group.children), { opacity: 0, y: 16 }, {
            opacity: 1, y: 0, duration: 1, ease: ease.out, stagger: 0.11, clearProps: "transform",
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          });
        });
      };
      bind();
      let frame = 0;
      const mutations = new MutationObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => context.add(bind));
      });
      mutations.observe(scope, { childList: true, subtree: true });

      /* —— 4. Paralaksa zdjęcia, linia procesu, pasek postępu —— */
      const portrait = scope.querySelector<HTMLElement>(".about-portrait img");
      if (portrait) {
        gsap.fromTo(portrait, { scale: 1.16, yPercent: -5 }, {
          scale: 1.16, yPercent: 5, ease: "none",
          scrollTrigger: { trigger: ".about-portrait", start: "top bottom", end: "bottom top", scrub: true },
        });
      }
      const steps = scope.querySelector<HTMLElement>(".service-steps");
      if (steps) {
        gsap.fromTo(steps, { "--line": 0 }, {
          "--line": 1, ease: "none",
          scrollTrigger: { trigger: steps, start: "top 85%", end: "bottom 55%", scrub: 0.6 },
        });
      }
      // Process steps rise out of depth one after another, tied to the scroll position.
      gsap.utils.toArray<HTMLElement>("[data-depth] > li", scope).forEach((step, index) => {
        gsap.fromTo(step, { rotationX: 34, z: -260, yPercent: 18, opacity: 0.08, transformOrigin: "50% 100%" }, {
          rotationX: 0, z: 0, yPercent: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: step.parentElement, start: `top ${92 - index * 6}%`, end: `top ${58 - index * 6}%`, scrub: 0.7 },
        });
      });
      // Opinions drift at slightly different speeds, which gives the row some depth.
      gsap.utils.toArray<HTMLElement>(".testimonial-card", scope).forEach((card, index) => {
        const amount = [-26, 18, -12, 24][index % 4];
        // A CSS variable on `translate`, so the one-off reveal (which owns `transform`) cannot clear it.
        gsap.fromTo(card, { "--drift": `${-amount}px` }, { "--drift": `${amount}px`, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
      });
      if (bar.current) {
        gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.25 } });
      }

      /* —— 5. Nagłówek: stan „po przewinięciu” + chowanie przy scrollu w dół —— */
      const nav = scope.querySelector<HTMLElement>(".portfolio-nav");
      if (nav) {
        ScrollTrigger.create({
          start: 0, end: "max",
          onUpdate(self) {
            const y = self.scroll();
            nav.classList.toggle("is-scrolled", y > 24);
            const menuOpen = Boolean(nav.querySelector("nav.is-open"));
            nav.classList.toggle("is-hidden", self.direction === 1 && y > 720 && !menuOpen && !root.hasAttribute("data-navigation-scroll"));
          },
        });
      }

      /* —— 6. Interakcje wskaźnika (tylko mysz/rysik): spotlight, tilt, magnes —— */
      const cleanups: Array<() => void> = [];
      if (fine) {
        const tilt = new WeakMap<HTMLElement, { rx: (v: number) => void; ry: (v: number) => void }>();
        const getTilt = (el: HTMLElement) => {
          let t = tilt.get(el);
          if (!t) {
            gsap.set(el, { transformPerspective: 1200 });
            t = {
              rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: ease.soft }) as (v: number) => void,
              ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: ease.soft }) as (v: number) => void,
            };
            tilt.set(el, t);
          }
          return t;
        };
        const offset = new WeakMap<HTMLElement, Quick>();

        const move = (event: PointerEvent) => {
          const target = event.target as Element | null;
          if (!target) return;
          const spot = target.closest<HTMLElement>("[data-spotlight]");
          if (spot) {
            const r = spot.getBoundingClientRect();
            spot.style.setProperty("--mx", `${event.clientX - r.left}px`);
            spot.style.setProperty("--my", `${event.clientY - r.top}px`);
          }
          const card = target.closest<HTMLElement>("[data-tilt]");
          if (card) {
            const r = card.getBoundingClientRect();
            const px = (event.clientX - r.left) / r.width - 0.5;
            const py = (event.clientY - r.top) / r.height - 0.5;
            const t = getTilt(card);
            t.rx(-py * 5); t.ry(px * 5);
          }
          const mag = target.closest<HTMLElement>(MAGNETIC);
          if (mag && !(mag as HTMLButtonElement).disabled) {
            const r = mag.getBoundingClientRect();
            const x = (event.clientX - (r.left + r.width / 2)) * 0.22;
            const y = (event.clientY - (r.top + r.height / 2)) * 0.32;
            offset.set(mag, { x, y });
            gsap.to(mag, { "--mag-x": `${x}px`, "--mag-y": `${y}px`, duration: 0.45, ease: ease.soft, overwrite: "auto" });
          }
        };
        const leave = (event: PointerEvent) => {
          const from = event.target as Element | null;
          const to = event.relatedTarget as Node | null;
          if (!from) return;
          const card = from.closest<HTMLElement>("[data-tilt]");
          if (card && !card.contains(to)) { const t = getTilt(card); t.rx(0); t.ry(0); }
          const mag = from.closest<HTMLElement>(MAGNETIC);
          if (mag && !mag.contains(to)) gsap.to(mag, { "--mag-x": "0px", "--mag-y": "0px", duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
        };
        scope.addEventListener("pointermove", move, { passive: true });
        scope.addEventListener("pointerout", leave, { passive: true });
        cleanups.push(() => { scope.removeEventListener("pointermove", move); scope.removeEventListener("pointerout", leave); });
      }

      /* —— 7. Przeliczanie pozycji, gdy zmienia się wysokość dokumentu (obrazy, <details>, fonty) —— */
      let timer = 0;
      const refresh = () => { window.clearTimeout(timer); timer = window.setTimeout(() => ScrollTrigger.refresh(), 180); };
      const observer = new ResizeObserver(refresh);
      observer.observe(document.body);
      document.fonts?.ready.then(refresh).catch(() => {});
      window.addEventListener("load", refresh, { once: true });

      return () => {
        cleanups.forEach(fn => fn());
        observer.disconnect();
        mutations.disconnect();
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        window.removeEventListener("load", refresh);
      };
    });

    root.classList.add("motion-armed");
    return () => {
      mm.revert();
      root.classList.remove("motion-armed", "js-motion");
      scope.querySelector(".portfolio-nav")?.classList.remove("is-hidden", "is-scrolled");
    };
  }, [pathname, paused]);

  return <div className="scroll-progress" aria-hidden="true"><i ref={bar} /></div>;
}
