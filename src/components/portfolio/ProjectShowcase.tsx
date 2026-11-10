"use client";
import { projectLabel } from "@/lib/project-labels";
import { useState } from "react";
import ProjectMedia from "./ProjectMedia";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconArrowUpRight as ArrowUpRight } from "./icons";
import type { Project } from "@/types";

import { getProjectPath } from "@/lib/seo";
import { selectProjectHighlights } from "@/lib/project-highlights";

const ProjectModal = dynamic(() => import("@/components/ProjectModal"));

export function ProjectCard({ project, index, onOpen, highlighted = false }: { project: Project; index: number; onOpen: () => void; highlighted?: boolean }) {
  return <article data-reveal className={`showcase-card${index === 0 ? " showcase-featured" : ""}`}>
    {project.images[0] ? <ProjectMedia alt={project.image_alts?.[0]} previewVideo={project.preview_video} previewPoster={project.preview_poster} projectId={project.id} image={project.images[0]} fallbackImage={project.images.find(src => src.startsWith("/projects/"))} title={project.title} onOpen={onOpen} /> : <button className="showcase-type-visual" onClick={onOpen}>{project.title}</button>}
    <div className="showcase-info">
    {project.project_status === "in-development" && <p className="portfolio-kicker project-release-label">WERSJA TESTOWA / W ROZWOJU</p>}
    <div className="showcase-caption"><div><p className="portfolio-kicker">{String(index + 1).padStart(2, "0")} / {projectLabel(project.project_type || project.category)}</p><h3><Link href={getProjectPath(project)}>{project.title}</Link></h3><p>{project.short_description}</p></div><Link className="showcase-arrow" href={getProjectPath(project)} aria-label={`Opis realizacji: ${project.title}`}><ArrowUpRight /></Link></div>
    {highlighted ? <><dl className="project-outcome">{project.main_challenge && <div><dt>Wyzwanie</dt><dd>{project.main_challenge}</dd></div>}{project.project_result && <div><dt>Rezultat</dt><dd>{project.project_result}</dd></div>}</dl><Link className="portfolio-text-link" href={getProjectPath(project)}>Opis realizacji <ArrowUpRight size={16} /></Link></> : <div className="portfolio-tags">{project.technologies.slice(0, 5).map((tech, i) => <span key={`${tech}-${i}`}>{tech}</span>)}</div>}
    </div>
  </article>;
}

export default function ProjectShowcase({ initialProjects }: { initialProjects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const highlights = selectProjectHighlights(initialProjects);
  return <section id="projekty" className="portfolio-projects portfolio-container" aria-labelledby="projects-heading">
    <header className="portfolio-section-heading"><div><p className="portfolio-kicker">01 / WYBRANE REALIZACJE</p><h2 id="projects-heading">Zobacz, co powstało.<br />{" "}<span>Oceń jakość wykonania.</span></h2></div><p>Zobacz strony, które przygotowałem.<br />{" "}Sprawdź, co mogłoby sprawdzić się również u Ciebie.</p></header>
    <div className="showcase-grid">{highlights.map((project, index) => <ProjectCard key={project.id} project={project} index={index} highlighted onOpen={() => setSelected(project)} />)}</div>
    <Link href="/realizacje" data-reveal className="portfolio-button portfolio-button--secondary project-archive">Wszystkie realizacje ({initialProjects.length}) <ArrowUpRight size={17} /></Link>
    {!initialProjects.length && <p className="portfolio-empty">Realizacje są chwilowo niedostępne. <a href="#kontakt">Napisz do mnie.</a></p>}
    {selected && <ProjectModal dark project={selected} onClose={() => setSelected(null)} />}
  </section>;
}
