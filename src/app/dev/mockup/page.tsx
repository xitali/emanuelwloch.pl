import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { join } from "node:path";
import sharp from "sharp";
import { getProjects } from "@/lib/turso";
import { mockupSources } from "@/lib/project-mockup-sources";
import { heroKinds as stageKinds } from "@/lib/hero-kinds";
import { serviceShowcase } from "@/lib/service-showcase";
import MockupClient from "./MockupClient";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Development-only tool that renders the hero stills and one 3D mockup per published project.
 * Not available in production builds.
 */
export default async function MockupPage({ searchParams }: { searchParams: Promise<{ only?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { only } = await searchParams;
  const heroJobs = stageKinds.map(kind => ({ laptop: kind.laptop, monitor: kind.monitor, out: kind.still.split("/").pop()!, chrome: kind.chrome }));
  const projects = await getProjects();
  const aspects = new Map<string, number>();
  for (const src of new Set(projects.flatMap(p => p.images.filter(i => i.startsWith("/projects/"))))) {
    const { width, height } = await sharp(join(process.cwd(), "public", src)).metadata().catch(() => ({ width: undefined, height: undefined }));
    if (width && height) aspects.set(src, width / height);
  }
  const projectJobs = mockupSources(projects, src => aspects.get(src)).map(source => ({ laptop: source.laptop, monitor: source.monitor, out: `${source.slug}.webp`, chrome: source.chrome }));
  const serviceJobs = Object.entries(serviceShowcase).map(([slug, showcase]) => ({ laptop: showcase.front.src, monitor: showcase.back.src, out: `usluga-${slug}.webp`, chrome: showcase.front.kind }));
  const jobs = [...heroJobs, ...serviceJobs, ...projectJobs].filter(job => !only || job.out.startsWith(only));
  return <MockupClient jobs={jobs} />;
}
