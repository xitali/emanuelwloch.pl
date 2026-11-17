import { describe, expect, it } from "vitest";
import { orderCatalogProjects, selectProjectHighlights } from "../src/lib/projects/highlights";
import { contactSchema } from "../src/lib/validation";
import { messageWithSource } from "../src/lib/contact/sources";
import type { Project } from "../src/types";

describe("wyróżnione realizacje", () => {
  it("uzupełnia wybór dostępnymi projektami bez duplikowania ani modyfikowania danych", () => {
    const projects = ["a", "09e837ed-2206-49b7-9b81-21c6222a18f5", "b", "c"].map((id, index) => ({ id, featured: index === 1 }) as Project);
    expect(selectProjectHighlights(projects).map(p => p.id)).toEqual([projects[1].id, "a", "b"]);
    expect(projects.map(p => p.id)).toEqual(["a", projects[1].id, "b", "c"]);
    expect(selectProjectHighlights([])).toEqual([]);
  });
});

describe("kolejność dowodów wykonania", () => {
  it("pokazuje gotowe wyróżnione realizacje przed wersją testową", () => {
    const projects = [{ id: "test", featured: true, project_status: "in-development" }, { id: "live", featured: true, project_status: "active" }] as Project[];
    expect(selectProjectHighlights(projects).map(p => p.id)).toEqual(["live", "test"]);
    expect(projects[0].id).toBe("test");
  });
});

describe("zakres pokazanych realizacji", () => {
  const make = (id: string, category: string, project_type: string, featured = false) => ({ id, category, project_type, featured, project_status: "active" }) as Project;
  const projects = [make("site-1", "web", "landing-page", true), make("site-2", "web", "web", true), make("shop", "e-commerce", "e-commerce"), make("tv", "apps", "tv-app"), make("site-3", "web", "web")];

  it("pokazuje na głównej stronę, aplikację lub sklep oraz program", () => {
    expect(selectProjectHighlights(projects).map(p => p.id)).toEqual(["site-1", "shop", "tv"]);
  });

  it("przeplata rodzaje w katalogu bez gubienia projektów", () => {
    const ordered = orderCatalogProjects(projects).map(p => p.id);
    expect(ordered).toEqual(["site-1", "shop", "tv", "site-2", "site-3"]);
    expect(ordered).toHaveLength(projects.length);
  });
});

describe("źródło kontaktu", () => {
  const message = { name: "Jan Kowalski", email: "jan@example.com", message: "Proszę o kontakt w sprawie strony." };
  it("pozostawia źródło opcjonalne i zachowuje oryginalną treść", () => {
    expect(contactSchema.parse(message).source).toBe("");
    expect(messageWithSource(message.message, "")).toBe(message.message);
  });
  it("zapisuje wybrane źródło i odrzuca wartości spoza formularza", () => {
    expect(contactSchema.parse({ ...message, source: "Polecenie" }).source).toBe("Polecenie");
    expect(messageWithSource(message.message, "Polecenie")).toContain("Źródło kontaktu (wskazane w formularzu): Polecenie");
    expect(contactSchema.safeParse({ ...message, source: "nieznane\nźródło" }).success).toBe(false);
  });
});
