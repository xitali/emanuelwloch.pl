import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const projectId = "5187fe58-43e9-46a8-aba5-7016acfbc55a";

  const updates = {
    title: "Emanuel Włoch - Full-Stack Software Engineer & Edge Platform",
    short_description: "Autorska platforma portfolio z wbudowanym systemem CMS, panelem administracyjnym oraz analityką ruchu na brzegu sieci (Edge).",
    detailed_description: "Portfolio i panel CMS zbudowane w Next.js 16 i React 19. Aplikacja prezentuje projekty, usługi i opinie, obsługuje formularz kontaktowy, bezpieczne logowanie administratora, zarządzanie treścią, trwałe pliki oraz anonimowe statystyki odsłon.",
    technologies: JSON.stringify(["Next.js 16", "React 19", "TypeScript", "Turso (libSQL)", "Tailwind CSS v4", "Framer Motion", "Zod", "Recharts", "Vercel"]),
    frontend_technologies: JSON.stringify(["Next.js 16 App Router", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Recharts"]),
    backend_technologies: JSON.stringify(["Turso (libSQL)", "Next.js Server Actions", "Next.js Route Handlers", "JOSE", "bcrypt", "Zod"]),
    tools_and_services: JSON.stringify(["Turso Database", "Vercel", "Vercel Blob", "Lucide Icons", "Dedykowany CMS", "Vitest", "GitHub Actions"]),
    hosting_platform: "Vercel (Edge Network) + Turso (AWS EU-West)",
    key_features: JSON.stringify([
      "Błyskawiczny czas ładowania i ocena Lighthouse 95-100",
      "Globalna baza danych Turso SQLite replikowana na brzegu sieci",
      "Zabezpieczony panel administracyjny z systemem CMS i edycją cen w czasie rzeczywistym",
      "Moduł analityki ruchu i odwiedzin z wykresami Recharts",
      "Interaktywny terminal CLI w sekcji Hero z obsługą komend",
      "Przełącznik motywów Dark / Light mode z pełną obsługą dostępności",
      "System bezpośredniego przesyłania i zarządzania zdjęciami z komputera"
    ]),
    design_style: "glassmorphism, modern dark slate, cyan neon accents, ultra-fast UI",
    color_palette: JSON.stringify(["Slate #060913", "Cyan #0ea5e9", "Emerald #10b981", "Purple #a855f7"]),
    target_audience: "Klienci biznesowi, partnerzy komercyjni, rekruterzy IT, inwestorzy",
    main_challenge: "Osiągnięcie ultra-niskich opóźnień (sub-10ms) przy jednoczesnym dynamicznym pobieraniu danych z bazy Turso oraz zapewnieniu płynnej zmiany motywów Light/Dark.",
    innovation: "Połączenie Server Components i Server Actions z bazą Turso, walidacją Zod, trwałym ograniczaniem liczby żądań i panelem administracyjnym.",
    project_result: "Responsywne portfolio z publicznymi case studies, formularzem kontaktowym oraz panelem CMS.",
    performance_metrics: JSON.stringify([]),
    success_metrics: JSON.stringify(["Responsywny interfejs", "Dostępność klawiaturą", "Automatyczna walidacja w CI"]),
    technical_metrics: JSON.stringify([
      "Next.js 16 App Router z Server Actions",
      "W pełni typowany kod TypeScript bez błędów w runtime",
      "System pamięci podręcznej ISR (Incremental Static Regeneration)",
      "Zero-dług technologiczny i pełna responsywność na telefonach"
    ]),
  };

  await db.execute({
    sql: `UPDATE projects SET 
      title = ?,
      short_description = ?,
      detailed_description = ?,
      technologies = ?,
      frontend_technologies = ?,
      backend_technologies = ?,
      tools_and_services = ?,
      hosting_platform = ?,
      key_features = ?,
      design_style = ?,
      color_palette = ?,
      target_audience = ?,
      main_challenge = ?,
      innovation = ?,
      project_result = ?,
      performance_metrics = ?,
      success_metrics = ?,
      technical_metrics = ?,
      updated_at = datetime('now')
      WHERE id = ?`,
    args: [
      updates.title,
      updates.short_description,
      updates.detailed_description,
      updates.technologies,
      updates.frontend_technologies,
      updates.backend_technologies,
      updates.tools_and_services,
      updates.hosting_platform,
      updates.key_features,
      updates.design_style,
      updates.color_palette,
      updates.target_audience,
      updates.main_challenge,
      updates.innovation,
      updates.project_result,
      updates.performance_metrics,
      updates.success_metrics,
      updates.technical_metrics,
      projectId,
    ],
  });

  console.log("Successfully updated all details for Emanuel Włoch Portfolio project in Turso DB!");
}

main().catch(console.error);
