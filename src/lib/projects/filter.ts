import type { Project } from "@/types";

/** Catalog filters in the order a client thinks about the work. Mobile apps are not offered. */
export const catalogCategories = [["all", "Wszystkie"], ["web", "Strony firmowe"], ["e-commerce", "Sklepy"], ["aplikacje", "Aplikacje i panele"], ["apps", "Programy na Windows i TV"]] as const;
export const catalogCategoryIds: string[] = catalogCategories.map(([id]) => id);

export function projectMatchesCategory(
  project: Project,
  selectedCategory: string,
): boolean {
  if (selectedCategory === "all") return true;

  const projectCategories = [project.category, project.project_type]
    .filter(Boolean)
    .map((value) => value!.toLowerCase());
  const isEcommerce = projectCategories.some(
    (value) => value.includes("e-commerce") || value.includes("ecommerce"),
  );
  const isMobile = projectCategories.some((value) =>
    ["mobile", "android", "ios", "react-native", "kotlin", "swift"].some(
      (mobileCategory) => value.includes(mobileCategory),
    ),
  );
  const isApp = projectCategories.some((value) => ["apps", "tv-app", "desktop-app"].includes(value));
  const isWebApp = !isEcommerce && !isMobile && !isApp && projectCategories.includes("web-app");

  if (selectedCategory === "e-commerce") return isEcommerce;
  if (selectedCategory === "mobile") return isMobile;
  if (selectedCategory === "apps") return isApp;
  if (selectedCategory === "aplikacje") return isWebApp;
  if (selectedCategory === "web") {
    return !isEcommerce && !isMobile && !isApp && !isWebApp;
  }

  return projectCategories.some((value) => value.includes(selectedCategory));
}
