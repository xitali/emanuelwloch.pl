import type { Project } from "@/types";

/** Which two real screenshots a project's 3D mockup shows: the laptop gets the first, the monitor the second. */
export function mockupSources(projects: Project[]) {
  return projects.flatMap(project => {
    const images = project.images.filter(src => src.startsWith("/projects/"));
    if (!project.slug || images.length === 0) return [];
    return [{ slug: project.slug, laptop: images[0], monitor: images[1] ?? images[0] }];
  });
}
