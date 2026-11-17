import { createPageMetadata } from "@/lib/content/seo";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowUpRight } from "@/components/portfolio/icons";
import { guidePages } from "@/lib/content/guide-pages";
import { serializeJsonLd, SITE_URL } from "@/lib/content/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Poradniki o stronach, aplikacjach i bazach danych",
  description: "Konkretne odpowiedzi o kosztach, terminach i wyborze rozwiązania: strona, aplikacja webowa, baza danych czy program na Windows.",
  path: "/poradniki",
  image: "/og/poradniki.jpg",
});

export default function GuidesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/poradniki#webpage`,
    url: `${SITE_URL}/poradniki`,
    name: "Poradniki Emanuela Włocha",
    inLanguage: "pl-PL",
    author: { "@id": `${SITE_URL}/#emanuel-wloch` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guidePages.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: `${SITE_URL}${guide.path}` })),
    },
  };

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <header className="svc-hero">
          <div className="portfolio-container">
            <nav aria-label="Okruszki" className="svc-crumbs"><ol><li><Link href="/">Strona główna</Link></li><li aria-current="page">Poradniki</li></ol></nav>
            <div className="guide-hero-copy">
              <h1>Zanim zdecydujesz</h1>
              <p className="svc-lead">Koszty, terminy i wybór rozwiązania wyjaśnione wprost: strona, aplikacja, baza danych czy program na komputer.</p>
            </div>
          </div>
        </header>
        <section className="svc-section portfolio-container" aria-label="Lista poradników">
          <ul className="guide-list">{guidePages.map((guide) => <li key={guide.path}><Link href={guide.path}><h2>{guide.title}</h2><p>{guide.metaDescription}</p><span>Czytaj poradnik <IconArrowUpRight size={15} /></span></Link></li>)}</ul>
        </section>
      </main>
    </PublicPageShell>
  );
}
