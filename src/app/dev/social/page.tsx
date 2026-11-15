import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SocialGraphic, { SIZES, type SizeId } from "./SocialGraphic";
import { ogImages, posts } from "./content";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Development-only: renders one marketing graphic at its exact pixel size, for capture by
 * scripts/render-social.mjs. ?id=<post id or og:file>&size=feed|story|gbp|og
 */
export default async function SocialPage({ searchParams }: { searchParams: Promise<{ id?: string; size?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { id = "", size = "feed" } = await searchParams;
  const graphic = id.startsWith("og:") ? ogImages.find(o => o.file === id.slice(3))?.graphic : posts.find(p => p.id === id)?.graphic;
  if (!graphic || !(size in SIZES)) notFound();
  return <SocialGraphic graphic={graphic} size={size as SizeId} />;
}
