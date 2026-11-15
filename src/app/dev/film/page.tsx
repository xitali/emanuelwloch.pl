import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilmClient from "./FilmClient";
import ReelClient from "./ReelClient";
import { REELS, type ReelId } from "./timeline";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Development-only film composition: the site's real 3D scenes and copy, drawn frame by frame
 * from a time value so a headless browser can capture them (see the render script in the brag output folder).
 */
export default async function FilmPage({ searchParams }: { searchParams: Promise<{ format?: string; reel?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { format, reel } = await searchParams;
  if (reel && reel in REELS) return <ReelClient reel={reel as ReelId} />;
  return <FilmClient format={format === "vertical" ? "vertical" : "landscape"} />;
}
