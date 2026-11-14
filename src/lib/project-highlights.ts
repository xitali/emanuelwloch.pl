import type { Project } from "@/types";

export type ProjectGroup = "site" | "app" | "program";

/** Which kind of work a project proves: a website, a web app or shop, or a desktop/TV program. */
export function projectGroup(project: Project): ProjectGroup {
  const values = [project.category, project.project_type].filter(Boolean).map(v => v!.toLowerCase());
  if (values.some(v => ["apps", "tv-app", "desktop-app"].includes(v))) return "program";
  if (values.some(v => v.includes("e-commerce") || v === "web-app")) return "app";
  return "site";
}

const liveFirst = (projects: Project[]) => [...projects].sort((a, b) => Number(a.project_status === "in-development") - Number(b.project_status === "in-development"));

/** Featured work first, finished before test versions, then one project per kind so the selection shows the full range. */
export function selectProjectHighlights(projects: Project[], limit = 3) {
  const ranked = [...liveFirst(projects.filter(p => Boolean(p.featured))), ...projects.filter(p => !p.featured)];
  const picked: Project[] = [];
  for (const group of ["site", "app", "program"] as const) {
    const match = ranked.find(p => projectGroup(p) === group && !picked.includes(p));
    if (match) picked.push(match);
  }
  for (const project of ranked) if (picked.length < limit && !picked.includes(project)) picked.push(project);
  return picked.slice(0, limit);
}

/** Interleaves kinds in the catalog so programs and apps are not buried after every website. */
export function orderCatalogProjects(projects: Project[]) {
  const queues = (["site", "app", "program"] as const).map(group => projects.filter(p => projectGroup(p) === group));
  const ordered: Project[] = [];
  while (queues.some(q => q.length)) for (const queue of queues) { const next = queue.shift(); if (next) ordered.push(next); }
  return ordered;
}
