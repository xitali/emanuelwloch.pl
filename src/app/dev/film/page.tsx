import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilmClient from "./FilmClient";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Development-only film composition: the site's real 3D scenes and copy, drawn frame by frame
 * from a time value so a headless browser can capture them (see the render script in the brag output folder).
 */
export default async function FilmPage({ searchParams }: { searchParams: Promise<{ format?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { format } = await searchParams;
  return <FilmClient format={format === "vertical" ? "vertical" : "landscape"} />;
}
