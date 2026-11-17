import type { ContactMessage } from "@/types";

/** Fixed reference time so the demo reads the same on every visit. */
export const DEMO_NOW = Date.parse("2026-11-14T10:00:00Z");
const daysAgo = (days: number, hour = 9) => new Date(DEMO_NOW - days * 86_400_000 + (hour - 10) * 3_600_000).toISOString();

/** Fictional enquiries for the public panel demo. No real people or companies. */
export const demoMessages: ContactMessage[] = [
  { id: "demo-1", name: "Marta (przykład)", email: "marta@example.com", subject: "Sklep z ceramiką", status: "unread", created_at: daysAgo(0, 8), message: "Dzień dobry, sprzedaję ręcznie robioną ceramikę na targach i przez Instagram. Chciałabym mieć własny sklep z płatnościami online. Ile to może kosztować i jak długo trwa?" },
  { id: "demo-2", name: "Tomasz (przykład)", email: "tomasz@example.com", subject: "Grafik pracy w warsztacie", status: "unread", created_at: daysAgo(1, 15), message: "Prowadzimy warsztat samochodowy, terminy zapisujemy w zeszycie i w arkuszu. Szukamy prostej aplikacji do rezerwacji, którą obsłużą trzy osoby." },
  { id: "demo-3", name: "Biuro rachunkowe (przykład)", email: "biuro@example.com", subject: "Program do ewidencji dokumentów", status: "in-progress", created_at: daysAgo(3, 11), message: "Potrzebujemy programu na Windows do ewidencji dokumentów od klientów. Dane nie mogą trafiać do chmury." },
  { id: "demo-4", name: "Kamil (przykład)", email: "kamil@example.com", subject: "Strona dla firmy budowlanej", status: "replied", created_at: daysAgo(6, 13), message: "Chcę stronę z ofertą, galerią realizacji i formularzem wyceny. Mam zdjęcia i logo." },
  { id: "demo-5", name: "Fundacja (przykład)", email: "fundacja@example.com", subject: "Aktualizacja strony", status: "closed", created_at: daysAgo(12, 10), message: "Dziękujemy za pomoc przy aktualizacji strony. Wszystko działa." },
];

/** Synthetic, deterministic traffic for the last 30 days. */
export const demoAnalytics = Array.from({ length: 30 }, (_, index) => {
  const day = new Date(DEMO_NOW - (29 - index) * 86_400_000);
  const weekday = day.getUTCDay();
  const visits = Math.round(42 + index * 1.4 + (weekday === 0 || weekday === 6 ? -14 : 6) + ((index * 37) % 11));
  return { date: day.toISOString().slice(0, 10), visits };
});

export const demoVisitsTotal = 18_420;
