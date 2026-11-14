import type { Project } from "@/types";
import { projectMatchesCategory } from "./project-filter";
import { projectGroup } from "./project-highlights";

/** A real screenshot used on a service page; `kind` describes the device it was taken from. */
export type Frame = { src: string; label: string; kind: "browser" | "window" };

export type RelatedFilter = "web" | "e-commerce" | "aplikacje" | "apps" | "data" | "nextjs" | "jaroslaw" | "rzeszow";

const shot = (kind: Frame["kind"], label: string, src: string): Frame => ({ kind, label, src });
const img = {
  vip: shot("browser", "VIP Transfery", "/projects/vip-transfery-platforma-premium-transport-solutions/2026-11-vip-glowna.webp"),
  tattoo: shot("browser", "Iluminatia Tattoo", "/projects/rzeszow-tatuaz-iluminatia-tattoo/2026-11-tattoo-glowna.webp"),
  zielona: shot("browser", "Zielona Baza — menu", "/projects/zielona-baza-restauracja-weganska-w-rzeszowie/2026-11-zielona-menu.webp"),
  fundacja: shot("browser", "Fundacja Serce Mototrasy", "/projects/fundacja-serce-mototrasy-strona-internetowa-organizacji-charytatywnej/2026-11-fundacja-glowna.webp"),
  fundacjaDzialania: shot("browser", "Fundacja — działania", "/projects/fundacja-serce-mototrasy-strona-internetowa-organizacji-charytatywnej/2026-11-fundacja-dzialania.webp"),
  lapki: shot("browser", "Łapki w Ciapki — katalog", "/projects/lapki-w-ciapki-sklep-zoologiczny/2026-11-lapki-katalog.webp"),
  sklep: shot("browser", "Sklep demo — kategorie", "/projects/sklep-internetowy-demo/2026-11-sklep-katalog.webp"),
  panel: shot("browser", "Panel administratora — produkty", "/projects/sklep-internetowy-demo/panel-produktow.webp"),
  mototrasa: shot("browser", "Mototrasa Tour — oferta", "/projects/mototrasa-tour-aplikacja-wypozyczalni-motocykli/2026-11-mototrasa-oferta.webp"),
  solid: shot("browser", "Solid Print — wycena", "/projects/solid-print/2026-11-solid-wycena.webp"),
  cms: shot("browser", "emanuelwloch.pl — oferta", "/projects/emanuel-wloch-full-stack-software-engineer-edge-platform/2026-11-cms-oferta.webp"),
  cmsKatalog: shot("browser", "emanuelwloch.pl — katalog", "/projects/emanuel-wloch-full-stack-software-engineer-edge-platform/2026-11-cms-katalog.webp"),
  wardogs: shot("window", "WARDOGS Companion — przegląd", "/projects/wardogs-companion/2026-11-wardogs-przeglad.webp"),
  wardogsAnaliza: shot("window", "WARDOGS Companion — analiza dni", "/projects/wardogs-companion/2026-11-wardogs-analiza.webp"),
};

/** Real screens and matching realisations for each service page. */
export const serviceShowcase: Record<string, { front: Frame; back: Frame; related: RelatedFilter; catalog: string; demo?: boolean }> = {
  "tworzenie-stron-internetowych": { front: img.vip, back: img.tattoo, related: "web", catalog: "web" },
  "tworzenie-aplikacji-webowych": { front: img.solid, back: img.panel, related: "aplikacje", catalog: "aplikacje", demo: true },
  "sklepy-internetowe": { front: img.lapki, back: img.sklep, related: "e-commerce", catalog: "e-commerce" },
  "nextjs-developer": { front: img.cms, back: img.cmsKatalog, related: "nextjs", catalog: "aplikacje" },
  "tworzenie-stron-internetowych-jaroslaw": { front: img.fundacja, back: img.fundacjaDzialania, related: "jaroslaw", catalog: "web" },
  "tworzenie-stron-internetowych-rzeszow": { front: img.zielona, back: img.tattoo, related: "rzeszow", catalog: "web" },
  "bazy-danych-i-panele": { front: img.panel, back: img.wardogsAnaliza, related: "data", catalog: "aplikacje", demo: true },
  "programy-na-windows": { front: img.wardogs, back: img.wardogsAnaliza, related: "apps", catalog: "apps" },
};

const text = (p: Project) => [p.title, p.short_description, p.detailed_description].filter(Boolean).join(" ");
const stack = (p: Project) => [...(p.technologies ?? []), ...(p.backend_technologies ?? [])].join(" ").toLowerCase();
const DATA_TECH = ["sqlite", "prisma", "supabase", "turso", "libsql", "mysql", "postgres", "d1", "payload"];

function matches(project: Project, filter: RelatedFilter) {
  if (filter === "data") return DATA_TECH.some(t => stack(project).includes(t));
  if (filter === "nextjs") return stack(project).includes("next.js");
  if (filter === "jaroslaw") return /Jarosław/i.test(text(project));
  if (filter === "rzeszow") return /Rzesz[oó]w/i.test(text(project));
  return projectMatchesCategory(project, filter);
}

/** Up to `limit` realisations that prove the service, finished work first; local pages fall back to other websites. */
export function relatedProjectsFor(projects: Project[], filter: RelatedFilter, limit = 3) {
  const rank = (list: Project[]) => [...list].sort((a, b) => Number(a.project_status === "in-development") - Number(b.project_status === "in-development") || Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const found = projects.filter(p => matches(p, filter));
  // For databases, apps, shops and programs prove it better than a website that happens to use a database.
  const primary = rank(filter === "data" ? found.filter(p => projectGroup(p) !== "site") : found);
  const fallback = filter === "jaroslaw" || filter === "rzeszow" ? rank(projects.filter(p => projectMatchesCategory(p, "web") && !primary.includes(p)))
    : filter === "data" ? rank(found.filter(p => !primary.includes(p))) : [];
  return [...primary, ...fallback].slice(0, limit);
}
