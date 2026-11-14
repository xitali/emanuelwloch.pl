import { describe, expect, it } from "vitest";
import { projectMatchesCategory } from "../src/lib/project-filter";
import type { Project } from "../src/types";

const project: Project = {
  id: "1",
  title: "Sklep",
  short_description: "Test",
  technologies: [],
  images: [],
  category: "web",
  project_type: "e-commerce",
};

describe("filtrowanie projektów", () => {
  it.each(["tv-app", "desktop-app"])("oddziela %s od realizacji internetowych", (type) => {
    const app = { ...project, category: "apps", project_type: type };
    expect(projectMatchesCategory(app, "apps")).toBe(true);
    expect(projectMatchesCategory(app, "web")).toBe(false);
    expect(projectMatchesCategory(app, "e-commerce")).toBe(false);
  });
  it("nie nakłada kategorii web i e-commerce", () => {
    expect(projectMatchesCategory(project, "web")).toBe(false);
    expect(projectMatchesCategory(project, "e-commerce")).toBe(true);
    expect(projectMatchesCategory(project, "mobile")).toBe(false);
  });

  it("rozpoznaje projekt mobilny", () => {
    const mobileProject: Project = {
      ...project,
      id: "2",
      category: "mobile",
      project_type: "android-app",
    };

    expect(projectMatchesCategory(mobileProject, "mobile")).toBe(true);
    expect(projectMatchesCategory(mobileProject, "web")).toBe(false);
  });

  it("oddziela aplikacje internetowe od stron firmowych", () => {
    const webApp = { ...project, category: "web", project_type: "web-app" };
    expect(projectMatchesCategory(webApp, "aplikacje")).toBe(true);
    expect(projectMatchesCategory(webApp, "web")).toBe(false);
    expect(projectMatchesCategory({ ...project, category: "web", project_type: "landing-page" }, "web")).toBe(true);
    expect(projectMatchesCategory(project, "aplikacje")).toBe(false);
  });

  it("zwraca wszystkie projekty dla filtra all", () => {
    expect(projectMatchesCategory(project, "all")).toBe(true);
  });
});
