import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/projects";
import { getProjectPath, SITE_URL, toAbsoluteUrl } from "@/lib/content/seo";
import { servicePages } from "@/lib/content/service-pages";
import { guidePages } from "@/lib/content/guide-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${SITE_URL}/realizacje`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}/uslugi`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/o-mnie`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...servicePages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: page.slug.endsWith("jaroslaw") ? 0.9 : 0.8,
    })),
    {
      url: `${SITE_URL}/poradniki`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...guidePages.map((guide) => ({
      url: `${SITE_URL}${guide.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    {
      url: `${SITE_URL}/polityka-prywatnosci`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}${getProjectPath(project)}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at)
        : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: project.images
        .map((image) => toAbsoluteUrl(image))
        .filter((image): image is string => Boolean(image)),
    })),
  ];
}
