import { createPageMetadata } from "@/lib/seo";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import { IconArrowUpRight, IconPin } from "@/components/portfolio/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serializeJsonLd, SITE_URL } from "@/lib/seo";
import { servicePages } from "@/lib/service-pages";
import { formatPriceFrom, servicePaths } from "@/lib/service-paths";

export const metadata: Metadata = createPageMetadata({
  title: "Strony, sklepy, aplikacje i programy — oferta dla firm",
  description: "Wybierz, czego potrzebuje Twoja firma: strona, sklep, aplikacja webowa, baza danych z panelem albo program na Windows. Zakres, proces i orientacyjne ceny netto.",
  path: "/uslugi",
});

const localPages = servicePages.filter((page) => page.slug.endsWith("jaroslaw") || page.slug.endsWith("rzeszow"));

export default function ServicesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/uslugi#webpage`,
        url: `${SITE_URL}/uslugi`,
        name: "Usługi Emanuela Włocha: strony, sklepy, aplikacje i programy",
        description: metadata.description,
        inLanguage: "pl-PL",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@id": `${SITE_URL}/#emanuel-wloch` },
      },
      {
        "@type": "ItemList",
        itemListElement: servicePages.map((page, index) => ({ "@type": "ListItem", position: index + 1, name: page.shortName, url: `${SITE_URL}${page.path}` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Usługi", item: `${SITE_URL}/uslugi` },
        ],
      },
    ],
  };

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="svc-hero">
            <div className="portfolio-container">
              <nav aria-label="Okruszki" className="svc-crumbs"><ol><li><Link href="/">Strona główna</Link></li><li aria-current="page">Usługi</li></ol></nav>
              <div className="svc-hero-grid">
                <div className="svc-hero-copy">
                  <h1>Czego potrzebuje Twoja firma?</h1>
                  <p className="svc-lead">Nie musisz wiedzieć, czy to ma być strona, aplikacja czy program. Znajdź poniżej sytuację podobną do swojej — zobaczysz, co dostaniesz, jak będziemy pracować i od czego zależy cena.</p>
                </div>
              </div>
            </div>
          </header>

          <section className="svc-section portfolio-container" aria-labelledby="core-services">
            <h2 id="core-services" className="sr-only">Rodzaje projektów</h2>
            <ol className="service-path-list">{servicePaths.map((path) => <li key={path.href} className="service-path-row">
              <Link className="service-path-thumb" href={path.href} tabIndex={-1} aria-hidden="true"><Image src={path.image} alt="" fill sizes="(max-width: 767px) 92vw, 280px" /><span>{path.imageLabel}</span></Link>
              <div className="service-path-main"><h3><Link href={path.href}>{path.title}</Link></h3><p className="service-path-problem">{path.problem}</p></div>
              <div className="service-path-scope"><p>{path.scope}</p><p className="service-path-price">{formatPriceFrom(path.priceFrom)}</p></div>
              <div className="service-path-actions"><Link className="portfolio-button portfolio-button--secondary" href={path.href}>Zakres i pytania <IconArrowUpRight size={16} /></Link></div>
            </li>)}</ol>
            <p className="service-price-note">Ceny „od” to punkt startowy najprostszego zakresu, podany netto. Przed rozpoczęciem dostaniesz zakres prac i dokładną wycenę. <Link href="/#szczegoly-uslug">Policz orientacyjną wycenę</Link>.</p>
          </section>

          <section className="svc-band" aria-labelledby="more-services">
            <div className="portfolio-container svc-band-grid">
              <div>
                <h2 id="more-services">Masz już stronę lub aplikację?</h2>
                <p className="svc-band-lead">Rozwinę ją, przyspieszę albo przeniosę na nowszą technologię. Sprawdzę też kod przed większą inwestycją.</p>
                <div className="portfolio-actions"><Link href="/nextjs-developer" className="portfolio-text-link">Rozwój i audyty aplikacji Next.js <IconArrowUpRight size={15} /></Link></div>
              </div>
              <aside className="svc-fit" aria-labelledby="local-services">
                <h3 id="local-services">Jarosław, Rzeszów i cała Polska</h3>
                <ul>{localPages.map((page) => <li key={page.path}><Link href={page.path}>{page.shortName}</Link></li>)}</ul>
                <p className="svc-fit-note"><IconPin size={14} /> Działam z Jarosławia. Cały projekt możemy przeprowadzić zdalnie.</p>
              </aside>
            </div>
          </section>

          <section className="svc-close portfolio-container svc-section" aria-labelledby="close-heading">
            <div className="svc-close-card">
              <Image src="/emanuel_wloch.jpg" alt="" width={88} height={88} className="svc-close-photo" />
              <div><h2 id="close-heading">Nie wiesz, co wybrać?</h2><p>Opisz problem kilkoma zdaniami. Podpowiem, jakie rozwiązanie ma sens i ile może kosztować.</p></div>
              <Link href="/#kontakt" className="portfolio-button">Opisz problem <IconArrowUpRight size={17} /></Link>
            </div>
          </section>
        </article>
      </main>
    </PublicPageShell>
  );
}
