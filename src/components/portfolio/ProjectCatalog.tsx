"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectShowcase";
import { catalogCategories, projectMatchesCategory } from "@/lib/project-filter";

const ProjectModal = dynamic(() => import("@/components/ProjectModal"));

export default function ProjectCatalog({ projects, category }: { projects: Project[]; category: string }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const filtered = projects.filter(project => projectMatchesCategory(project, category));
  const visible = catalogCategories.map(([id, label]) => ({ id, label, count: projects.filter(p => projectMatchesCategory(p, id)).length })).filter(c => c.id === "all" || c.count > 0 || c.id === category);
  return <><nav className="portfolio-filters" aria-label="Rodzaje realizacji">{visible.map(({ id, label, count }) => <Link key={id} className="portfolio-button portfolio-button--secondary" aria-current={id === category ? "page" : undefined} href={id === "all" ? "/realizacje" : `/realizacje?kategoria=${id}`}>{label} ({count})</Link>)}</nav>
    <div className="showcase-grid">{filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelected(project)} />)}</div>
    {!filtered.length && <p>Brak realizacji w tej kategorii. <Link href="/realizacje">Zobacz wszystkie</Link>.</p>}
    {selected && <ProjectModal dark project={selected} onClose={() => setSelected(null)} />}
  </>;
}
