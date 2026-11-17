import type { Metadata } from "next";
import type { Project } from "@/types";

export const SITE_URL = "https://emanuelwloch.pl";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function slugify(value: string): string {
  return value
    .replace(/[łŁ]/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getProjectSegment(project: Pick<Project, "id" | "title" | "slug">) {
  if (project.slug) return project.slug;
  const slug = slugify(project.title) || "projekt";
  return `${slug}-${project.id}`;
}

export function getProjectPath(project: Pick<Project, "id" | "title" | "slug">) {
  return `/projekty/${getProjectSegment(project)}`;
}

export function getProjectIdFromSegment(segment: string) {
  const uuidAtEnd = segment.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i,
  );

  return uuidAtEnd?.[1] ?? segment;
}

export function toAbsoluteUrl(value?: string) {
  if (!value) return undefined;

  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return undefined;
  }
}

// Link previews (1200 × 630), rendered from /dev/social. New file names keep social networks
// from serving a cached old preview.
export const SOCIAL_IMAGE_PATH = "/og/home.jpg";
export const SOCIAL_IMAGE_URL = `${SITE_URL}${SOCIAL_IMAGE_PATH}`;

/** Preview image for a service page: its own, or the closest one (city pages use the website one). */
export function serviceOgImage(slug: string) {
  const own = ["tworzenie-stron-internetowych", "sklepy-internetowe", "tworzenie-aplikacji-webowych", "bazy-danych-i-panele", "programy-na-windows"];
  const file = own.includes(slug) ? slug : slug.startsWith("tworzenie-stron-internetowych") ? "tworzenie-stron-internetowych" : slug === "nextjs-developer" ? "tworzenie-aplikacji-webowych" : "home";
  return `${SITE_URL}/og/${file}.jpg`;
}

export function createPageMetadata({ title, description, path, image = SOCIAL_IMAGE_URL, type = "website" }: {
  title: string; description: string; path: string; image?: string; type?: "website" | "profile" | "article";
}): Metadata {
  const imageUrl = toAbsoluteUrl(image)!;
  return {
    title, description, alternates: { canonical: path },
    openGraph: {
      title, description, url: new URL(path, SITE_URL).href,
      siteName: "Emanuel Włoch — strony, aplikacje i programy", locale: "pl_PL", type,
      images: [{ url: imageUrl, alt: title, ...(imageUrl.startsWith(`${SITE_URL}/og/`) ? { width: 1200, height: 630, type: "image/jpeg" } : {}) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}
