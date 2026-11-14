// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
const { timeline } = vi.hoisted(() => ({ timeline: vi.fn(() => vi.fn()) }));
vi.mock("@/components/portfolio/three/ScrollTimeline", () => ({ createScrollTimeline: timeline }));
import ProductStory from "@/components/portfolio/ProductStory";
import { stageKinds } from "@/components/portfolio/StageVisuals";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

beforeEach(() => {
  timeline.mockClear();
  vi.stubGlobal("matchMedia", (query:string) => ({ matches:query.includes("max-width"), addEventListener:vi.fn(), removeEventListener:vi.fn() }));
  vi.stubGlobal("IntersectionObserver", class { observe(){} disconnect(){} unobserve(){} });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.documentElement.classList.remove("motion-paused"); });

it("names every kind of software in the first heading", () => {
  render(<ProductStory />);
  const heading = screen.getByRole("heading", { level: 1 }).textContent ?? "";
  for (const word of ["Strony", "sklepy", "aplikacje", "programy"]) expect(heading).toContain(word);
});

it("lets a mobile visitor switch between four kinds of product without a scroll timeline", async () => {
  render(<ProductStory />);
  await waitFor(() => expect(document.querySelector(".scene-site")?.getAttribute("data-current")).toBe("true"));
  for (const [name, scene] of [["Sklep internetowy", "shop"], ["Aplikacja i baza danych", "app"], ["Program na Windows", "program"]]) {
    fireEvent.click(screen.getByRole("button", { name: `Pokaż: ${name}` }));
    expect(document.querySelector(`.scene-${scene}`)?.getAttribute("data-current")).toBe("true");
    expect(document.querySelectorAll(".hero-stage-scene[data-current=true]")).toHaveLength(1);
  }
  expect(document.querySelector(".scene-program img")?.getAttribute("src")).toContain("hero-program");
  expect(timeline).not.toHaveBeenCalled();
});

it("keeps every kind selectable and still when motion is paused", async () => {
  document.documentElement.classList.add("motion-paused");
  render(<ProductStory />);
  fireEvent.click(screen.getByRole("button", { name: "Pokaż: Strona firmowa" }));
  expect(document.querySelector(".scene-site")?.getAttribute("data-current")).toBe("true");
  await waitFor(() => expect(document.querySelector(".hero-stage-scenes")?.getAttribute("data-running")).toBe("false"));
  expect(timeline).not.toHaveBeenCalled();
});

it("shows only real screenshots that exist in the project", () => {
  for (const kind of stageKinds) for (const src of [kind.laptop, kind.monitor, kind.still]) expect(existsSync(resolve("public", src.slice(1)))).toBe(true);
});
