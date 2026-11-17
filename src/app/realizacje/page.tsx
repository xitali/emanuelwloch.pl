import { createPageMetadata, getProjectPath, serializeJsonLd, SITE_URL } from "@/lib/content/seo";
import type { Metadata } from "next";
import { getProjects } from "@/lib/server/turso";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import ProjectCatalog from "@/components/portfolio/ProjectCatalog";
import { catalogCategoryIds } from "@/lib/projects/filter";
import { orderCatalogProjects } from "@/lib/projects/highlights";

export const metadata: Metadata = createPageMetadata({
  title: "Realizacje — strony, sklepy, aplikacje i programy",
  description: "Zobacz strony firmowe, sklepy, aplikacje z panelem i bazą danych oraz programy na Windows: zakres, rozwiązania i prawdziwe ekrany.",
  path: "/realizacje",
  image: "/og/realizacje.jpg",
});

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ kategoria?: string }> }) {
  const { kategoria } = await searchParams;
  const category = catalogCategoryIds.includes(kategoria || "") ? kategoria! : "all";
  const projects = orderCatalogProjects(await getProjects());
  // Catalogue as a collection of case studies, so search engines see what each project is.
  const jsonLd = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Realizacje — strony, sklepy, aplikacje i programy", url: `${SITE_URL}/realizacje`,
    mainEntity: { "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}${getProjectPath(project)}`, name: project.title })) },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Realizacje", item: `${SITE_URL}/realizacje` }] },
  };
  return <PublicPageShell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} /><main id="main-content" className="portfolio-subpage"><section className="portfolio-container portfolio-catalog">
    <h1>Strony, sklepy,<br />{" "}aplikacje i programy.</h1><p>Prawdziwe ekrany z projektów, które zaprojektowałem i zaprogramowałem. Przy każdym zobaczysz, jaki problem rozwiązuje, jak działa i co może przydać się Twojej firmie.</p>
    <ProjectCatalog projects={projects} category={category} />
  </section></main></PublicPageShell>;
}
