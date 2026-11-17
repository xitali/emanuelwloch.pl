import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const updates = [
  {
    id: "de9871ba-8ca4-4039-8c57-d8f753b56db3",
    title: "Nowoczesne Strony i Landing Page",
    short_description: "Szybkie, responsywne i wysoko konwertujące witryny internetowe.",
    description: "Projektuję i błyskawicznie wdrażam nowoczesne strony internetowe. Wykorzystuję najnowsze technologie frontendowe (np. Next.js, Tailwind), aby zapewnić niesamowitą wydajność, doskonałe SEO i płynne animacje. Każdy projekt jest perfekcyjnie zoptymalizowany pod urządzenia mobilne.",
    icon: "Globe",
    features: JSON.stringify(["Błyskawiczny czas ładowania", "Nowoczesny design (UI/UX)", "Zaawansowane animacje", "Optymalizacja pod Core Web Vitals", "Responsywność (Mobile-first)"])
  },
  {
    id: "d6fae604-eed1-4051-8ef4-e4cda81b1a4f",
    title: "Kompleksowe Aplikacje Webowe",
    short_description: "Skalowalne systemy i platformy typu SaaS dopasowane do Twojego biznesu.",
    description: "Tworzę zaawansowane aplikacje webowe oparte na nowoczesnej architekturze. Błyskawicznie przekuwam pomysły w działające, bezpieczne platformy (SaaS, portale, platformy B2B). Gwarantuję czysty kod, skalowalność i bezbłędną integrację z nowoczesnymi bazami danych i usługami chmurowymi.",
    icon: "Code",
    features: JSON.stringify(["Architektura Full-Stack", "Systemy autentykacji (JWT/OAuth)", "Integracje zewnętrznych API", "Szybkie wdrożenie MVP", "Skalowalna baza danych"])
  },
  {
    id: "a76b42a8-a706-4e99-b26e-9b8296b83817",
    title: "Narzędzia Wewnętrzne & Dashboardy",
    short_description: "Dedykowane panele administracyjne i systemy CRM przyspieszające pracę.",
    description: "Buduję narzędzia, które transformują i porządkują pracę w Twojej firmie. Od zaawansowanych paneli analitycznych po dedykowane systemy CRM. Dzięki nowoczesnemu podejściu do programowania, dostarczam stabilne i bezpieczne środowiska ułatwiające zarządzanie danymi.",
    icon: "LayoutDashboard",
    features: JSON.stringify(["Dedykowane systemy CRM/ERP", "Interaktywne wykresy i raporty", "Zarządzanie uprawnieniami (RBAC)", "Eksport i analiza danych", "Integracja z systemami firmy"])
  },
  {
    id: "8a9b8313-e96b-4846-b817-66a5a1242ad2",
    title: "E-Commerce & Platformy Sprzedażowe",
    short_description: "Nowoczesne sklepy internetowe stworzone z myślą o maksymalnej sprzedaży.",
    description: "Konstruuję niezawodne platformy e-commerce, które oferują nieskazitelne doświadczenia zakupowe. Od błyskawicznego dodawania produktów po bezpieczne płatności online. Oferuję elastyczność i możliwość tworzenia niestandardowych procesów zakupowych, których nie znajdziesz w gotowych pudełkowych rozwiązaniach.",
    icon: "ShoppingCart",
    features: JSON.stringify(["Bramki płatności (Stripe, PayU)", "Niestandardowe koszyki", "Zarządzanie stanami magazynowymi", "Fakturowanie", "Wysoka konwersja (UX)"])
  },
  {
    id: "25345066-c440-46dd-b1bf-2a471241a7f5",
    title: "Inteligentna Automatyzacja & API",
    short_description: "Automatyzacja powtarzalnych zadań i błyskawiczne przetwarzanie danych.",
    description: "Zamieniam wielogodzinne, manualne procesy w sekundy. Tworzę zaawansowane skrypty, algorytmy analizujące dane oraz szybkie integracje, które automatycznie obsługują rutynowe zadania. Łączę różne, pozornie niekompatybilne systemy w jeden sprawnie działający ekosystem.",
    icon: "Zap",
    features: JSON.stringify(["Automatyzacja procesów biznesowych", "Szybkie przetwarzanie tekstu i danych", "Integracje Webhook / API", "Boty i asystenci automatyczni", "Scraping i analiza danych"])
  },
  {
    id: "91af5810-355b-4553-ba01-331438f9859a",
    title: "Modernizacja & Refaktoring",
    short_description: "Przebudowa i odświeżanie starszych projektów do dzisiejszych standardów.",
    description: "Błyskawicznie diagnozuję problemy w istniejących aplikacjach i podnoszę je do poziomu rynkowych liderów. Refaktoryzuję stary kod, przyspieszam ładowanie stron, usuwam luki bezpieczeństwa i wdrażam nowoczesny, przyciągający wzrok interfejs użytkownika.",
    icon: "Palette",
    features: JSON.stringify(["Szybki audyt wydajności", "Odświeżenie interfejsu", "Eliminacja długu technologicznego", "Poprawa bezpieczeństwa", "Optymalizacja zapytań do bazy"])
  },
  {
    id: "fc06f71b-d746-45b2-a0e2-361ef18f2578",
    title: "Aplikacje Mobilne",
    short_description: "Natywne i hybrydowe aplikacje na smartfony iOS oraz Android.",
    description: "Projektuję i buduję nowoczesne aplikacje mobilne. Dzięki zastosowaniu najnowocześniejszych technologii potrafię drastycznie skrócić czas dostarczenia produktu na rynek, utrzymując przy tym najwyższą jakość, płynność działania i natywne odczucia z użytkowania.",
    icon: "Smartphone",
    features: JSON.stringify(["iOS oraz Android z jednej bazy", "Powiadomienia Push", "Praca w trybie offline", "Płynne natywne animacje", "Publikacja w App Store / Google Play"])
  },
  {
    id: "99329714-cfb4-4149-a276-f4620f272f2b",
    title: "Audyty Architektury & Doradztwo",
    short_description: "Eksperckie konsultacje i projektowanie skalowalnych rozwiązań IT.",
    description: "Pomagam w doborze odpowiednich, przyszłościowych technologii. Błyskawicznie analizuję architekturę Twojego systemu i proponuję konkretne rozwiązania optymalizacyjne. Wspieram w planowaniu cyklu życia aplikacji, aby kod był odporny na błędy i gotowy na intensywny rozwój.",
    icon: "Users",
    features: JSON.stringify(["Analiza i projektowanie systemów", "Code review", "Optymalizacja kosztów chmury", "Strategia rozwoju produktu", "Wsparcie w doborze narzędzi"])
  },
  {
    id: "68561921-fb1d-4e02-ac39-f094faec52ca",
    title: "Wsparcie Techniczne & Skalowanie",
    short_description: "Kompleksowa opieka nad serwerami, bezpieczeństwem i stabilnością aplikacji.",
    description: "Zapewniam ciągłość działania Twoich usług w sieci. Oferuję błyskawiczną reakcję na problemy, regularne aktualizacje zależności i stały monitoring środowiska. Skaluję aplikacje, aby wytrzymały nagłe wzrosty ruchu, dbając o pełne bezpieczeństwo danych.",
    icon: "Shield",
    features: JSON.stringify(["Monitoring uptime 24/7", "Automatyczne kopie zapasowe", "Natychmiastowe łatanie luk", "Skalowanie infrastruktury", "Raportowanie i SLA"])
  }
];

async function main() {
  for (const item of updates) {
    await db.execute({
      sql: `UPDATE services SET 
              title = ?, 
              short_description = ?, 
              description = ?, 
              icon = ?, 
              features = ? 
            WHERE id = ?`,
      args: [item.title, item.short_description, item.description, item.icon, item.features, item.id]
    });
    console.log(`Updated ${item.title}`);
  }
}

main().catch(console.error);
