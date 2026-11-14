import type { Project } from "@/types";
import manifest from "./mockup-manifest.json";

const rendered = new Set<string>(manifest as string[]);

/** Path to the rendered 3D mockup of a project, when one has been generated (see /dev/mockup). */
export function projectMockup(project: Pick<Project, "slug">) {
  return project.slug && rendered.has(`${project.slug}.webp`) ? `/mockups/${project.slug}.webp` : undefined;
}
