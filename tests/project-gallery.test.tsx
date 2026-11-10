// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProjectModal from "../src/components/ProjectModal";
import type { Project } from "../src/types";

vi.mock("@/lib/project-labels", () => ({ projectLabel: () => "Realizacja" }));
vi.mock("@/lib/seo", () => ({ getProjectPath: () => "/projekty/test" }));
vi.mock("@/hooks/useBodyScrollLock", () => ({ useBodyScrollLock: vi.fn() }));
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => React.createElement("img", { src, alt }) }));
vi.mock("next/link", () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));
vi.mock("../src/components/portfolio/ProjectMedia", () => ({ default: ({ onOpen }: { onOpen: () => void }) => <button onClick={onOpen}>Powiększ główne zdjęcie</button> }));

const project = { id: "test", title: "Projekt testowy", short_description: "Opis", images: ["/one.png", "/two.png", "/three.png"], technologies: [] } as Project;
afterEach(cleanup);

describe("galeria w oknie projektu", () => {
  it("keeps only the internal case study link when the record has external links", () => {
    render(<ProjectModal project={{ ...project, project_url: "https://example.com", repository_url: "https://github.com/example/project" }} onClose={vi.fn()} />);
    expect(screen.getAllByRole("link").map(link => link.getAttribute("href"))).toEqual(["/projekty/test"]);
  });

  it("otwiera drugie zdjęcie, przechodzi w obie strony i wraca do miniatury", async () => {
    const close = vi.fn();
    render(<ProjectModal project={project} onClose={close} />);
    const thumbnail = screen.getByRole("button", { name: "Powiększ zdjęcie 2: Projekt testowy" });
    thumbnail.focus(); fireEvent.click(thumbnail);
    expect(screen.getByAltText("Projekt testowy — zdjęcie 2 z 3").getAttribute("src")).toBe("/two.png");
    fireEvent.click(screen.getByRole("button", { name: "Następne zdjęcie" }));
    expect(screen.getByAltText("Projekt testowy — zdjęcie 3 z 3")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
    expect(screen.getByAltText("Projekt testowy — zdjęcie 1 z 3")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
    expect(screen.getByAltText("Projekt testowy — zdjęcie 3 z 3")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(close).not.toHaveBeenCalled();
    await waitFor(() => expect(document.activeElement).toBe(thumbnail));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(close).toHaveBeenCalledOnce();
  });

  it("otwiera również główne zdjęcie i utrzymuje fokus w podglądzie", () => {
    render(<ProjectModal project={{ ...project, images: ["/one.png"] }} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Powiększ główne zdjęcie" }));
    expect(screen.getByAltText("Projekt testowy — zdjęcie 1 z 1")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Następne zdjęcie" })).toBeNull();
    fireEvent.keyDown(screen.getByRole("button", { name: "Zamknij podgląd zdjęcia" }), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Oryginał" }));
  });
});
