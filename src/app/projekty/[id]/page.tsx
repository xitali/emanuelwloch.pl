import { projectLabel } from "@/lib/project-labels";
import ProjectMedia from "@/components/portfolio/ProjectMedia";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Gauge, Layers3, Quote, Target } from "lucide-react";
import { getProjectById, getProjects } from "@/lib/turso";
import {
  getProjectIdFromSegment,
  getProjectPath,
  getProjectSegment,
  serializeJsonLd,
  SITE_URL,
  toAbsoluteUrl,
  SOCIAL_IMAGE_URL,
} from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

function compactDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= 158 ? normalized : `${normalized.slice(0, 155).trimEnd()}…`;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: getProjectSegment(project) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id: segment } = await params;
  const project = await getProjectById(getProjectIdFromSegment(segment));
  if (!project) return {};

  const path = getProjectPath(project);
  const image = toAbsoluteUrl(project.preview_poster || project.images[0]) || SOCIAL_IMAGE_URL;
  const description = compactDescription(project.short_description);

  return {
    title: `${project.title} — case study`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.title} — case study`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Emanuel Włoch – Web Development",
      locale: "pl_PL",
      type: "article",
      publishedTime: project.created_at,
      modifiedTime: project.updated_at,
      authors: ["Emanuel Włoch"],
      images: image ? [{ url: image, alt: `Podgląd projektu ${project.title}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — case study`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-4 text-sm leading-6 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)]">
          <Check className="mt-0.5 size-4 shrink-0 text-[var(--p-accent)] dark:text-[var(--p-accent)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: segment } = await params;
  const project = await getProjectById(getProjectIdFromSegment(segment));
  if (!project) notFound();

  const canonicalSegment = getProjectSegment(project);
  if (segment !== canonicalSegment) permanentRedirect(getProjectPath(project));

  const projectUrl = `${SITE_URL}${getProjectPath(project)}`;
  const images = project.images.map((image) => toAbsoluteUrl(image)).filter((image): image is string => Boolean(image));
  const techGroups = [
    { label: "Frontend", items: project.frontend_technologies ?? [] },
    { label: "Backend", items: project.backend_technologies ?? [] },
    { label: "Narzędzia i usługi", items: project.tools_and_services ?? [] },
  ].filter((group) => group.items.length > 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${projectUrl}#case-study`,
        mainEntityOfPage: { "@id": `${projectUrl}#webpage` },
        headline: project.title,
        description: compactDescription(project.short_description),
        url: projectUrl,
        image: images,
        inLanguage: "pl-PL",
        datePublished: project.created_at,
        dateModified: project.updated_at,
        keywords: project.technologies,
        about: [project.project_type, project.category, ...project.technologies].filter(Boolean),
        author: { "@id": `${SITE_URL}/#emanuel-wloch` },
        publisher: { "@id": `${SITE_URL}/#emanuel-wloch` },
      },
      {
        "@type": "WebPage",
        "@id": `${projectUrl}#webpage`,
        url: projectUrl,
        name: `${project.title} — case study`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${projectUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${projectUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projekty", item: `${SITE_URL}/realizacje` },
          { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
        ],
      },
    ],
  };

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="border-b border-[var(--p-border)] bg-[var(--p-surface)] px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
            <div className="mx-auto max-w-[1280px]">
              <nav aria-label="Okruszki" className="text-xs text-[var(--p-muted)]">
                <Link href="/" className="hover:text-[var(--p-accent)]">Strona główna</Link> / <Link href="/realizacje" className="hover:text-[var(--p-accent)]">Projekty</Link> / <span aria-current="page">{project.title}</span>
              </nav>
              <Link href="/realizacje" className="mt-9 inline-flex items-center gap-2 text-sm text-[var(--p-accent)]"><ArrowLeft className="size-4" /> Wszystkie projekty</Link>
              <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
                <div>
                  {project.project_status === "in-development" && <p className="portfolio-kicker">Wersja testowa / projekt w rozwoju</p>}
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)]">Realizacja · {projectLabel(project.project_type || project.category)}</p>
                  <h1 className="mt-5 text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.055em]">{project.title}</h1>
                </div>
                <p className="text-base leading-8 text-[var(--p-muted)] sm:text-lg">{project.short_description}</p>
              </div>
              <div className="mt-9 flex flex-wrap gap-2">
                {project.technologies.slice(0, 8).map((technology) => <span key={technology} className="portfolio-tag">{technology}</span>)}
              </div>
            </div>
          </header>

          {project.images[0] && (
            <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14" aria-label={`Główny podgląd projektu ${project.title}`}>
              <div className="mx-auto max-w-[1280px]"><ProjectMedia alt={project.image_alts?.[0]} previewVideo={project.preview_video} previewPoster={project.preview_poster} projectId={project.id} image={project.images[0]} title={project.title} priority /></div>
            </section>
          )}

          <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24" aria-labelledby="summary-heading">
            <div className="mx-auto max-w-[1280px]">
              <h2 id="summary-heading" className="sr-only">Projekt w skrócie</h2>
              <div className="grid gap-px overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] md:grid-cols-3">
                {[
                  ["Odbiorcy", project.target_audience || "Użytkownicy końcowi i klienci marki"],
                  ["Zakres", projectLabel(project.project_type || project.category)],
                  ["Wdrożenie", project.hosting_platform || projectLabel(project.project_status, "Środowisko produkcyjne")],
                ].map(([label, value]) => <div key={label} className="bg-[var(--p-surface)] p-6 dark:bg-[var(--p-surface)]"><div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--p-muted)] dark:text-[var(--p-muted)]">{label}</div><p className="mt-3 text-sm font-medium">{value}</p></div>)}
              </div>
            </div>
          </section>

          <section className="border-y border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-20 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]">01 · Kontekst</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Problem i cel projektu</h2></div>
              <div className="space-y-9">
                <p className="whitespace-pre-line text-base leading-8 text-[var(--p-muted)] dark:text-[var(--p-muted)] sm:text-lg">{project.detailed_description || project.short_description}</p>
                {project.main_challenge && <div className="rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)]"><div className="flex items-center gap-2 text-sm font-semibold"><Target className="size-4 text-[var(--p-accent)] dark:text-[var(--p-accent)]" /> Główne wyzwanie</div><p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--p-muted)] dark:text-[var(--p-muted)]">{project.main_challenge}</p></div>}
              </div>
            </div>
          </section>

          <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="solution-heading">
            <div className="mx-auto max-w-[1280px]">
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]">02 · Realizacja</p><h2 id="solution-heading" className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Rozwiązanie</h2></div><div>{project.innovation && <p className="mb-8 whitespace-pre-line text-base leading-8 text-[var(--p-muted)] dark:text-[var(--p-muted)] sm:text-lg">{project.innovation}</p>}{project.key_features && project.key_features.length > 0 && <BulletList items={project.key_features} />}</div></div>
            </div>
          </section>

          <section className="border-y border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-20 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] sm:px-6 lg:px-8 lg:py-24" aria-labelledby="architecture-heading">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]"><Layers3 className="size-3.5" /> 03 · Architektura</div>
              <h2 id="architecture-heading" className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Technologie dobrane do celu</h2>
              {techGroups.length > 0 ? <div className="mt-10 grid gap-4 md:grid-cols-3">{techGroups.map((group) => <section key={group.label} className="rounded-[var(--p-radius)] border border-[var(--p-border)] p-6 dark:border-[var(--p-border)]"><h3 className="text-sm font-semibold">{group.label}</h3><div className="mt-5 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="portfolio-tag">{item}</span>)}</div></section>)}</div> : <div className="mt-8 flex flex-wrap gap-2">{project.technologies.map((item) => <span key={item} className="portfolio-tag">{item}</span>)}</div>}
            </div>
          </section>

          {((project.performance_metrics?.length ?? 0) > 0 || (project.technical_metrics?.length ?? 0) > 0 || project.accessibility_features) && (
            <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="quality-heading">
              <div className="mx-auto max-w-[1280px]"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]"><Gauge className="size-3.5" /> 04 · Jakość techniczna</div><h2 id="quality-heading" className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Wydajność, SEO i dostępność</h2><div className="mt-10 grid gap-4 lg:grid-cols-2">{project.performance_metrics && project.performance_metrics.length > 0 && <BulletList items={project.performance_metrics} />}{project.technical_metrics && project.technical_metrics.length > 0 && <BulletList items={project.technical_metrics} />}{project.accessibility_features && <p className="rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-sm leading-7 text-[var(--p-muted)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:text-[var(--p-muted)] lg:col-span-2">{project.accessibility_features}</p>}</div></div>
            </section>
          )}

          {project.project_result && <section className="border-y border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-20 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] sm:px-6 lg:px-8 lg:py-24" aria-labelledby="result-heading">
            <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]">05 · Efekt</p><h2 id="result-heading" className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Rezultat</h2></div><div><p className="whitespace-pre-line text-base leading-8 text-[var(--p-muted)] dark:text-[var(--p-muted)] sm:text-lg">{project.project_result}</p>{project.success_metrics && project.success_metrics.length > 0 && <div className="mt-8"><BulletList items={project.success_metrics} /></div>}{project.user_feedback?.[0] && <blockquote className="mt-8 rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 dark:border-[var(--p-border)] dark:bg-[var(--p-surface)]"><Quote className="size-5 text-[var(--p-accent)] dark:text-[var(--p-accent)]" /><p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--p-muted)] dark:text-[var(--p-muted)]">{project.user_feedback[0]}</p></blockquote>}</div></div>
          </section>}

          {project.images.length > 1 && <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="gallery-heading"><div className="mx-auto max-w-[1280px]"><h2 id="gallery-heading" className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Widoki projektu</h2><div className="mt-9 grid gap-4 md:grid-cols-2">{project.images.slice(1).map((image, index) => <div key={`${image}-${index}`} className="relative aspect-video overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] dark:border-[var(--p-border)]"><Image src={image} alt={`Widok ${index + 2} projektu ${project.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" /></div>)}</div></div></section>}


          <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1280px] rounded-[var(--p-radius)] bg-[var(--p-surface)] p-8 text-white sm:p-10 lg:flex lg:items-end lg:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)]">Podobny cel?</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Porozmawiajmy o Twojej firmie.</h2><div className="mt-5 text-xs text-[var(--p-muted)]"><Link href="/uslugi" className="hover:text-[var(--p-accent)]">Zobacz usługi</Link></div></div><Link href={`/?projekt=${project.id}#kontakt`} className="portfolio-button mt-8 shrink-0 lg:mt-0">Omów swój projekt <ArrowRight className="size-4" /></Link></div></section>
        </article>
      </main>
    </PublicPageShell>
  );
}
