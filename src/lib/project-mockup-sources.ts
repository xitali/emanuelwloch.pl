import type { Project } from "@/types";
import { projectGroup } from "./project-highlights";

/**
 * Which two real screenshots a project's 3D mockup shows: the laptop gets the first, the monitor the second.
 * `aspectOf` lets the caller skip banners and other images that are not screen-shaped.
 */
export function mockupSources(projects: Project[], aspectOf: (src: string) => number | undefined = () => undefined) {
  const screenShaped = (src: string) => { const aspect = aspectOf(src); return aspect === undefined || (aspect >= 1.3 && aspect <= 2.1); };
  return projects.flatMap(project => {
    const images = project.images.filter(src => src.startsWith("/projects/") && screenShaped(src));
    if (!project.slug || images.length === 0) return [];
    return [{ slug: project.slug, laptop: images[0], monitor: images[1] ?? images[0], chrome: projectGroup(project) === "program" ? "window" as const : "browser" as const }];
  });
}
