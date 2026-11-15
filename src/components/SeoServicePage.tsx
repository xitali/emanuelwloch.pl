import PublicPageShell from "@/components/portfolio/PublicPageShell";
import ServiceHeroVisual from "@/components/portfolio/ServiceHeroVisual";
import { IconArrowUpRight, IconCheck, IconPin } from "@/components/portfolio/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ServicePageData } from "@/lib/service-pages";
import { getProjectPath, serializeJsonLd, serviceOgImage, SITE_URL } from "@/lib/seo";
import { relatedProjectsFor, serviceShowcase } from "@/lib/service-showcase";
import { projectLabel } from "@/lib/project-labels";
import { projectMockup } from "@/lib/project-mockups";
import { getProjects } from "@/lib/turso";

export function createServiceMetadata(data: ServicePageData): Metadata {
  const url = `${SITE_URL}${data.path}`;

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: data.path },
    openGraph: {
      title: `${data.metaTitle} | Emanuel Włoch`,
      description: data.metaDescription,
      url,
      siteName: "Emanuel Włoch — strony, aplikacje i programy",
      locale: "pl_PL",
      type: "website",
      images: [{ url: serviceOgImage(data.slug), width: 1200, height: 630, alt: `${data.shortName} — Emanuel Włoch` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.metaTitle} | Emanuel Włoch`,
      description: data.metaDescription,
      images: [serviceOgImage(data.slug)],
    },
  };
}

function createStructuredData(data: ServicePageData) {
  const pageUrl = `${SITE_URL}${data.path}`;
  const serviceId = `${pageUrl}#service`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: data.metaTitle,
        description: data.metaDescription,
        inLanguage: "pl-PL",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": serviceId },
        author: { "@id": `${SITE_URL}/#emanuel-wloch` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: data.shortName,
        serviceType: data.serviceType,
        description: data.directAnswer,
        url: pageUrl,
        areaServed: data.areas,
        provider: { "@type": "Person", "@id": `${SITE_URL}/#emanuel-wloch`, name: "Emanuel Włoch", url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: data.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Usługi", item: `${SITE_URL}/uslugi` },
          { "@type": "ListItem", position: 3, name: data.shortName, item: pageUrl },
        ],
      },
    ],
  };
}

export default async function SeoServicePage({ data }: { data: ServicePageData }) {
  const structuredData = createStructuredData(data);
  const showcase = serviceShowcase[data.slug];
  const projects = showcase ? relatedProjectsFor(await getProjects(), showcase.related) : [];
  const catalogHref = showcase ? `/realizacje?kategoria=${showcase.catalog}` : "/realizacje";

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="svc-hero">
            <div className="portfolio-container">
              <nav aria-label="Okruszki" className="svc-crumbs">
                <ol><li><Link href="/">Strona główna</Link></li><li><Link href="/uslugi">Usługi</Link></li><li aria-current="page">{data.shortName}</li></ol>
              </nav>
              <div className="svc-hero-grid">
                <div className="svc-hero-copy">
                  <h1>{data.title}</h1>
                  <p className="svc-lead">{data.lead}</p>
                  <div className="portfolio-actions">
                    <Link href="/#kontakt" className="portfolio-button">Omów projekt <IconArrowUpRight size={17} /></Link>
                    {showcase?.demo && <Link href="/demo/panel" className="portfolio-text-link">Wypróbuj demo panelu <IconArrowUpRight size={15} /></Link>}
                    <Link href={catalogHref} className="portfolio-text-link">Zobacz realizacje <IconArrowUpRight size={15} /></Link>
                  </div>
                  <ul className="svc-areas" aria-label="Obszar działania">{data.areas.map((area) => <li key={area}><IconPin size={14} />{area}</li>)}</ul>
                </div>
                {showcase && <ServiceHeroVisual still={`/mockups/usluga-${data.slug}.webp`} alt={`${showcase.front.label} i ${showcase.back.label} na laptopie i monitorze`} laptop={showcase.front.src} monitor={showcase.back.src} chrome={showcase.front.kind} />}
              </div>
            </div>
          </header>

          <section className="svc-answer" aria-labelledby="answer-heading">
            <div className="portfolio-container svc-answer-grid">
              <h2 id="answer-heading">W skrócie</h2>
              <p>{data.directAnswer}</p>
            </div>
          </section>

          <section className="svc-section portfolio-container" aria-labelledby="benefits-heading">
            <header className="svc-heading"><h2 id="benefits-heading">Co zyskujesz?</h2><p>Co zmieni się dla Ciebie, Twojego zespołu i Twoich klientów.</p></header>
            <ul className="svc-benefits" data-stagger>
              {data.benefits.map((benefit) => <li key={benefit.title}><h3>{benefit.title}</h3><p>{benefit.description}</p></li>)}
            </ul>
          </section>

          {projects.length > 0 && <section className="svc-section svc-work portfolio-container" aria-labelledby="examples-heading">
            <header className="svc-heading"><h2 id="examples-heading">Podobne realizacje</h2><Link href={catalogHref} className="portfolio-text-link">Wszystkie z tej kategorii <IconArrowUpRight size={15} /></Link></header>
            <ul className="svc-work-grid" data-stagger>
              {projects.map((project) => {
                const image = projectMockup(project) ?? project.images.find((src) => src.startsWith("/projects/")) ?? project.preview_poster ?? project.images[0];
                return <li key={project.id}><Link href={getProjectPath(project)} className="svc-work-card">
                  <span className="svc-work-thumb">{image && <Image src={image} alt="" fill sizes="(max-width: 767px) 92vw, 30vw" />}</span>
                  <span className="svc-work-meta">{projectLabel(project.project_type || project.category)}{project.project_status === "in-development" ? " · wersja testowa" : ""}</span>
                  <strong>{project.title}</strong>
                  <span className="svc-work-desc">{project.short_description}</span>
                </Link></li>;
              })}
            </ul>
          </section>}

          <section className="svc-band" aria-labelledby="deliverables-heading">
            <div className="portfolio-container svc-band-grid">
              <div>
                <h2 id="deliverables-heading">Co otrzymujesz</h2>
                <ul className="svc-checklist">{data.deliverables.map((item) => <li key={item}><IconCheck size={18} /><span>{item}</span></li>)}</ul>
              </div>
              <aside className="svc-fit" aria-labelledby="fit-heading">
                <h3 id="fit-heading">To rozwiązanie dla Ciebie, jeśli…</h3>
                <ul>{data.idealFor.map((item) => <li key={item}>{item}</li>)}</ul>
              </aside>
            </div>
            <div className="portfolio-container">
              <h2 id="process-heading" className="svc-process-heading">Jak będziemy pracować?</h2>
              <ol className="svc-process" aria-labelledby="process-heading" data-stagger>
                {data.process.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}
              </ol>
            </div>
          </section>

          <section className="svc-section svc-faq portfolio-container" aria-labelledby="faq-heading">
            <header className="svc-heading"><h2 id="faq-heading">Najczęstsze pytania</h2><p>Nie ma tu Twojego pytania? Napisz — odpowiem na nie przy wycenie.</p></header>
            <div className="svc-faq-list">
              {data.faq.map((item) => <details key={item.question}><summary><h3>{item.question}</h3><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
            </div>
          </section>

          <section className="svc-close portfolio-container" aria-labelledby="close-heading">
            <div className="svc-close-card">
              <Image src="/emanuel_wloch.jpg" alt="" width={88} height={88} className="svc-close-photo" />
              <div>
                <h2 id="close-heading">Opisz, co chcesz usprawnić.</h2>
                <p>Porozmawiasz bezpośrednio ze mną. Po rozmowie dostaniesz zakres, termin i wycenę netto.</p>
                <nav aria-label="Powiązane usługi" className="svc-related">{data.related.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
              </div>
              <Link href="/#kontakt" className="portfolio-button">Omów projekt <IconArrowUpRight size={17} /></Link>
            </div>
          </section>
        </article>
      </main>
    </PublicPageShell>
  );
}
