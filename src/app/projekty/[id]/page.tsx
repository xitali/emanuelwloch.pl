import { projectLabel } from "@/lib/projects/labels";
import ProjectMedia from "@/components/portfolio/ProjectMedia";
import { projectMockup } from "@/lib/projects/mockups";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { IconArrowUpRight, IconCheck, IconQuote } from "@/components/portfolio/icons";
import { getProjectById, getProjects } from "@/lib/data/projects";
import {
  getProjectIdFromSegment,
  getProjectPath,
  getProjectSegment,
  serializeJsonLd,
  SITE_URL,
  toAbsoluteUrl,
  SOCIAL_IMAGE_URL,
} from "@/lib/content/seo";

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
    title: `${project.title} — realizacja`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.title} — realizacja`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Emanuel Włoch — strony, aplikacje i programy",
      locale: "pl_PL",
      type: "article",
      publishedTime: project.created_at,
      modifiedTime: project.updated_at,
      authors: ["Emanuel Włoch"],
      images: image ? [{ url: image, alt: `Podgląd projektu ${project.title}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — realizacja`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function Checklist({ items }: { items: string[] }) {
  return <ul className="svc-checklist">{items.map((item) => <li key={item}><IconCheck size={18} /><span>{item}</span></li>)}</ul>;
}

const STATUS: Record<string, string> = { active: "Gotowa realizacja", completed: "Gotowa realizacja", "in-development": "Wersja testowa", archived: "Projekt archiwalny" };

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
        name: `${project.title} — realizacja`,
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

  const kind = projectLabel(project.project_type || project.category);
  const facts = [
    ["Rodzaj", kind],
    ["Dla kogo", project.target_audience],
    ["Gdzie działa", project.hosting_platform],
    ["Status", STATUS[project.project_status || "active"] ?? "Gotowa realizacja"],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));
  const metrics = [...(project.performance_metrics ?? []), ...(project.technical_metrics ?? [])];
  // With a 3D mockup in the header, every real screenshot goes to the gallery; otherwise the first is already shown.
  const gallery = project.images.map((image, index) => ({ image, index })).slice(projectMockup(project) ? 0 : 1);

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="svc-hero">
            <div className="portfolio-container">
              <nav aria-label="Okruszki" className="svc-crumbs"><ol><li><Link href="/">Strona główna</Link></li><li><Link href="/realizacje">Realizacje</Link></li><li aria-current="page">{project.title}</li></ol></nav>
              <div className="guide-hero-copy">
                <h1>{project.title}</h1>
                <p className="svc-lead">{project.short_description}</p>
                <div className="portfolio-actions">
                  <Link href={`/?projekt=${project.id}#kontakt`} className="portfolio-button">Omów podobny projekt <IconArrowUpRight size={17} /></Link>
                  {project.project_url && <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="portfolio-text-link">Otwórz {project.project_status === "in-development" ? "wersję testową" : "stronę"} <IconArrowUpRight size={15} /></a>}
                </div>
              </div>
            </div>
          </header>

          {project.images[0] && <section className="portfolio-container project-hero-media" aria-label={`Podgląd: ${project.title}`}>
            <ProjectMedia mockup={projectMockup(project)} alt={project.image_alts?.[0]} previewVideo={project.preview_video} previewPoster={project.preview_poster} projectId={project.id} image={project.images[0]} title={project.title} priority />
          </section>}

          <section className="portfolio-container" aria-label="Projekt w skrócie">
            <dl className="project-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </section>

          <section className="svc-section portfolio-container guide-body" aria-label="Opis realizacji">
            <section className="guide-section" aria-labelledby="problem-heading">
              <h2 id="problem-heading">Problem i cel</h2>
              <div>
                {project.main_challenge && <p className="project-challenge">{project.main_challenge}</p>}
                <p className="project-description">{project.detailed_description || project.short_description}</p>
              </div>
            </section>
            {(project.innovation || (project.key_features?.length ?? 0) > 0) && <section className="guide-section" aria-labelledby="solution-heading">
              <h2 id="solution-heading">Rozwiązanie</h2>
              <div>{project.innovation && <p>{project.innovation}</p>}{project.key_features && project.key_features.length > 0 && <Checklist items={project.key_features} />}</div>
            </section>}
            {project.project_result && <section className="guide-section" aria-labelledby="result-heading">
              <h2 id="result-heading">Efekt</h2>
              <div>
                <p>{project.project_result}</p>
                {project.success_metrics && project.success_metrics.length > 0 && <Checklist items={project.success_metrics} />}
                {project.user_feedback?.[0] && <blockquote className="project-quote"><IconQuote size={20} /><p>{project.user_feedback[0]}</p></blockquote>}
              </div>
            </section>}
          </section>

          {(project.images.length > 1 || projectMockup(project)) && <section className="svc-band" aria-labelledby="gallery-heading">
            <div className="portfolio-container">
              <h2 id="gallery-heading">Widoki projektu</h2>
              <div className="project-gallery">{gallery.map(({ image, index }) => <figure key={`${image}-${index}`}><div className="project-gallery-shot"><Image src={image} alt={project.image_alts?.[index] || `Widok ${index + 1} projektu ${project.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" /></div>{project.image_alts?.[index] && <figcaption>{project.image_alts[index]}</figcaption>}</figure>)}</div>
            </div>
          </section>}

          <section className="svc-section portfolio-container guide-body" aria-label="Technologia i jakość">
            <section className="guide-section" aria-labelledby="tech-heading">
              <h2 id="tech-heading">Technologia</h2>
              <div>
                {techGroups.length > 0 ? <dl className="project-tech">{techGroups.map((group) => <div key={group.label}><dt>{group.label}</dt><dd className="portfolio-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</dd></div>)}</dl> : <div className="portfolio-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>}
              </div>
            </section>
            {(metrics.length > 0 || project.accessibility_features) && <section className="guide-section" aria-labelledby="quality-heading">
              <h2 id="quality-heading">Jakość i sprawdzenie</h2>
              <div>{metrics.length > 0 && <Checklist items={metrics} />}{project.accessibility_features && <p className="project-a11y">{project.accessibility_features}</p>}</div>
            </section>}
          </section>

          <section className="svc-close portfolio-container" aria-labelledby="close-heading">
            <div className="svc-close-card">
              <Image src="/emanuel_wloch.jpg" alt="" width={88} height={88} className="svc-close-photo" />
              <div><h2 id="close-heading">Potrzebujesz czegoś podobnego?</h2><p>Opisz swoją firmę i to, co chcesz usprawnić. Odpowiem osobiście.</p><nav aria-label="Dalej" className="svc-related"><Link href="/realizacje">Wszystkie realizacje</Link><Link href="/uslugi">Oferta</Link></nav></div>
              <Link href={`/?projekt=${project.id}#kontakt`} className="portfolio-button">Omów swój projekt <IconArrowUpRight size={17} /></Link>
            </div>
          </section>
        </article>
      </main>
    </PublicPageShell>
  );
}
