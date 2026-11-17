import PublicPageShell from "@/components/portfolio/PublicPageShell";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { IconArrowUpRight, IconCheck } from "@/components/portfolio/icons";
import { getGuidePage, guidePages } from "@/lib/content/guide-pages";
import { serializeJsonLd, SITE_URL } from "@/lib/content/seo";

const GUIDE_IMAGE = `${SITE_URL}/og/poradniki.jpg`;

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guidePages.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuidePage((await params).slug);
  if (!guide) return {};

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: guide.path },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `${SITE_URL}${guide.path}`,
      type: "article",
      publishedTime: "2026-08-01",
      modifiedTime: guide.updated,
      authors: ["Emanuel Włoch"],
      images: [{ url: GUIDE_IMAGE, alt: guide.title }],
    },
    twitter: { card: "summary_large_image", title: guide.metaTitle, description: guide.metaDescription, images: [GUIDE_IMAGE] },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = getGuidePage((await params).slug);
  if (!guide) notFound();

  const pageUrl = `${SITE_URL}${guide.path}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        headline: guide.title,
        description: guide.metaDescription,
        datePublished: "2026-08-01",
        dateModified: guide.updated,
        inLanguage: "pl-PL",
        author: { "@id": `${SITE_URL}/#emanuel-wloch` },
        publisher: { "@id": `${SITE_URL}/#emanuel-wloch` },
        image: GUIDE_IMAGE,
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: guide.title,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Poradniki", item: `${SITE_URL}/poradniki` },
          { "@type": "ListItem", position: 3, name: guide.title, item: pageUrl },
        ],
      },
    ],
  };

  const updated = new Date(`${guide.updated}T12:00:00Z`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="svc-hero">
            <div className="portfolio-container">
              <nav aria-label="Okruszki" className="svc-crumbs"><ol><li><Link href="/">Strona główna</Link></li><li><Link href="/poradniki">Poradniki</Link></li><li aria-current="page">{guide.metaTitle}</li></ol></nav>
              <div className="guide-hero-copy">
                <h1>{guide.title}</h1>
                <p className="svc-lead">{guide.lead}</p>
                <p className="guide-byline"><time dateTime={guide.updated}>Aktualizacja: {updated}</time> · autor: <Link href="/o-mnie" rel="author">Emanuel Włoch</Link></p>
              </div>
            </div>
          </header>

          <section className="svc-answer" aria-labelledby="answer-heading">
            <div className="portfolio-container svc-answer-grid">
              <h2 id="answer-heading">W skrócie</h2>
              <p>{guide.directAnswer}</p>
            </div>
          </section>

          <div className="svc-section portfolio-container guide-body">
            {guide.sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`guide-section-${index}`} className="guide-section">
                <h2 id={`guide-section-${index}`}>{section.title}</h2>
                <div>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.points && <ul className="svc-checklist">{section.points.map((point) => <li key={point}><IconCheck size={18} /><span>{point}</span></li>)}</ul>}
                </div>
              </section>
            ))}
          </div>

          <section className="svc-section svc-faq portfolio-container" aria-labelledby="guide-faq">
            <header className="svc-heading"><h2 id="guide-faq">Najczęstsze pytania</h2></header>
            <div className="svc-faq-list">{guide.faq.map((item) => <details key={item.question}><summary><h3>{item.question}</h3><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
          </section>

          <section className="svc-close portfolio-container" aria-labelledby="close-heading">
            <div className="svc-close-card">
              <Image src="/emanuel_wloch.jpg" alt="" width={88} height={88} className="svc-close-photo" />
              <div><h2 id="close-heading">Masz pytanie o swój projekt?</h2><p>Napisz kilka zdań — odpowiem osobiście.</p><nav aria-label="Czytaj dalej" className="svc-related">{guide.related.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></div>
              <Link href="/#kontakt" className="portfolio-button">Napisz do mnie <IconArrowUpRight size={17} /></Link>
            </div>
          </section>
        </article>
      </main>
    </PublicPageShell>
  );
}
