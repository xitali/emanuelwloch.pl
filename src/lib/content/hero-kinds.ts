/** One product kind per hero scene: laptop and monitor screens come from published realisations. */
export const heroKinds = [
  { id: "site", chrome: "browser" as const, note: "Strona ofertowa · strona restauracji", still: "/mockups/hero-site.webp",
    laptop: "/projects/vip-transfery-platforma-premium-transport-solutions/2026-11-vip-glowna.webp",
    monitor: "/projects/zielona-baza-restauracja-weganska-w-rzeszowie/2026-11-zielona-menu.webp" },
  { id: "shop", chrome: "browser" as const, note: "Katalog z filtrami · koszyk", still: "/mockups/hero-shop.webp",
    laptop: "/projects/lapki-w-ciapki-sklep-zoologiczny/2026-11-lapki-katalog.webp",
    monitor: "/projects/sklep-internetowy-demo/2026-11-sklep-katalog.webp" },
  { id: "app", chrome: "browser" as const, note: "Panel produktów · formularz wyceny", still: "/mockups/hero-app.webp",
    laptop: "/projects/solid-print/2026-11-solid-wycena.webp",
    monitor: "/projects/sklep-internetowy-demo/panel-produktow.webp" },
  { id: "program", chrome: "window" as const, note: "C# · .NET · lokalna baza SQLite", still: "/mockups/hero-program.webp",
    laptop: "/projects/wardogs-companion/2026-11-wardogs-analiza.webp",
    monitor: "/projects/wardogs-companion/2026-11-wardogs-przeglad.webp" },
];
