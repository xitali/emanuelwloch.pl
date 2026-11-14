import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { servicePages } from "../src/lib/service-pages";
import { servicePaths } from "../src/lib/service-paths";
import { relatedProjectsFor, serviceShowcase } from "../src/lib/service-showcase";
import type { Project } from "../src/types";
import { projectMockup } from "../src/lib/project-mockups";
import mockupManifest from "../src/lib/mockup-manifest.json";

const make = (id: string, extra: Partial<Project>) => ({ id, title: id, short_description: "", technologies: [], images: [], category: "web", project_status: "active", ...extra }) as Project;

describe("podstrony usług pokazują prawdziwe ekrany", () => {
  it.each(servicePages.map(p => p.slug))("%s ma dwa istniejące zrzuty", (slug) => {
    const showcase = serviceShowcase[slug];
    expect(showcase).toBeDefined();
    for (const frame of [showcase.front, showcase.back]) expect(existsSync(resolve("public", frame.src.slice(1)))).toBe(true);
  });

  it("każda ścieżka oferty prowadzi do istniejącej podstrony", () => {
    const paths = new Set(servicePages.map(p => p.path));
    for (const path of servicePaths) expect(paths.has(path.href)).toBe(true);
  });
});

describe("realizacje dobrane do usługi", () => {
  const projects = [
    make("strona", { project_type: "landing-page", technologies: ["Next.js 16"] }),
    make("sklep", { category: "e-commerce", project_type: "e-commerce", backend_technologies: ["Prisma", "SQLite"] }),
    make("program", { category: "apps", project_type: "desktop-app", technologies: ["C#", "SQLite"] }),
    make("test", { project_type: "web-app", backend_technologies: ["Supabase"], project_status: "in-development" }),
    make("rzeszow", { title: "Restauracja w Rzeszowie", project_type: "web" }),
  ];

  it("dla programów pokazuje tylko programy", () => {
    expect(relatedProjectsFor(projects, "apps").map(p => p.id)).toEqual(["program"]);
  });

  it("dla baz danych wybiera projekty z bazą, gotowe przed testowymi", () => {
    expect(relatedProjectsFor(projects, "data").map(p => p.id)).toEqual(["sklep", "program", "test"]);
  });

  it("przy bazach danych stawia aplikacje i programy przed stronami z bazą", () => {
    const withSite = [make("restauracja", { project_type: "web", technologies: ["PHP", "MySQL"] }), ...projects];
    expect(relatedProjectsFor(withSite, "data").map(p => p.id)).toEqual(["sklep", "program", "test"]);
    expect(relatedProjectsFor(withSite, "data", 4).map(p => p.id)).toEqual(["sklep", "program", "test", "restauracja"]);
  });

  it("na stronie lokalnej uzupełnia wybór innymi stronami firmowymi", () => {
    expect(relatedProjectsFor(projects, "rzeszow").map(p => p.id)).toEqual(["rzeszow", "strona"]);
  });
});

describe("makiety 3D", () => {
  it("każda podstrona usługi ma wyrenderowaną makietę", () => {
    for (const page of servicePages) expect(existsSync(resolve("public", "mockups", `usluga-${page.slug}.webp`))).toBe(true);
  });

  it("manifest wskazuje tylko istniejące makiety realizacji", () => {
    expect(mockupManifest.length).toBeGreaterThan(0);
    for (const file of mockupManifest) expect(existsSync(resolve("public", "mockups", file))).toBe(true);
    expect(projectMockup({ slug: "solid-print" })).toBe("/mockups/solid-print.webp");
    expect(projectMockup({ slug: "nie-ma-takiego-projektu" })).toBeUndefined();
  });
});
