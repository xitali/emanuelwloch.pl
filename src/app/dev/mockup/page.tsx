import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const heroJobs = stageKinds.map(kind => ({ laptop: kind.laptop, monitor: kind.monitor, out: kind.still.split("/").pop()! }));
  const projectJobs = mockupSources(await getProjects()).map(source => ({ laptop: source.laptop, monitor: source.monitor, out: `${source.slug}.webp` }));
  const serviceJobs = Object.entries(serviceShowcase).map(([slug, showcase]) => ({ laptop: showcase.front.src, monitor: showcase.back.src, out: `usluga-${slug}.webp` }));
  const jobs = [...heroJobs, ...serviceJobs, ...projectJobs].filter(job => !only || job.out.startsWith(only));
  return <MockupClient jobs={jobs} />;
}
