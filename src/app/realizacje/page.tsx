import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getProjects } from "@/lib/turso";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import ProjectCatalog from "@/components/portfolio/ProjectCatalog";
import { catalogCategoryIds } from "@/lib/project-filter";
import { orderCatalogProjects } from "@/lib/project-highlights";

export const metadata: Metadata = createPageMetadata({
  title: "Realizacje — strony, sklepy, aplikacje i programy",
  description: "Zobacz strony firmowe, sklepy, aplikacje z panelem i bazą danych oraz programy na Windows: zakres, rozwiązania i prawdziwe ekrany.",
  path: "/realizacje",
});

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ kategoria?: string }> }) {
  const { kategoria } = await searchParams;
  const category = catalogCategoryIds.includes(kategoria || "") ? kategoria! : "all";
  return <PublicPageShell><main id="main-content" className="portfolio-subpage"><section className="portfolio-container portfolio-catalog">
    <h1>Strony, sklepy,<br />{" "}aplikacje i programy.</h1><p>Prawdziwe ekrany z projektów, które zaprojektowałem i zaprogramowałem. Przy każdym zobaczysz, jaki problem rozwiązuje, jak działa i co może przydać się Twojej firmie.</p>
    <ProjectCatalog projects={orderCatalogProjects(await getProjects())} category={category} />
  </section></main></PublicPageShell>;
}
