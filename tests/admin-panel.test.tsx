// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const actions = vi.hoisted(() => ({
  deleteMessageAction: vi.fn(async () => ({ success: true })),
  updateMessageStatusAction: vi.fn(async () => ({ success: true })),
  deleteProjectAction: vi.fn(async () => ({ success: true })),
  createProjectAction: vi.fn(async () => ({ success: true })),
  updateProjectAction: vi.fn(async () => ({ success: true })),
  updateServicePriceAction: vi.fn(async () => ({ success: true })),
  createTestimonialAction: vi.fn(async () => ({ success: true })),
  deleteTestimonialAction: vi.fn(async () => ({ success: true })),
  logoutAdminAction: vi.fn(),
}));
vi.mock("@/app/actions/admin", () => actions);
vi.mock("recharts", () => ({ ResponsiveContainer: () => null, LineChart: () => null, Line: () => null, XAxis: () => null, YAxis: () => null, CartesianGrid: () => null, Tooltip: () => null }));

import AdminDashboard from "@/components/admin/AdminDashboard";
import { DEMO_NOW, demoAnalytics, demoMessages } from "@/lib/admin-demo";
import { isOpenMessage, messageStatusSchema, normalizeMessageStatus } from "@/lib/message-status";
import type { Project } from "@/types";

const project = { id: "p1", title: "Strona testowa", short_description: "Opis", technologies: [], images: [], category: "web", project_status: "active" } as Project;
const base = { messages: demoMessages, visitsCount: 10, projects: [project], services: [], testimonials: [], analytics: demoAnalytics, now: DEMO_NOW };

beforeEach(() => { vi.spyOn(window, "confirm").mockReturnValue(true); Object.values(actions).forEach(fn => fn.mockClear()); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("statusy wiadomości", () => {
  it("traktuje nieznany lub pusty status jak nową wiadomość", () => {
    expect(normalizeMessageStatus(undefined)).toBe("unread");
    expect(normalizeMessageStatus("cokolwiek")).toBe("unread");
    expect(isOpenMessage("in-progress")).toBe(true);
    expect(isOpenMessage("closed")).toBe(false);
    expect(messageStatusSchema.safeParse("deleted").success).toBe(false);
  });
});

describe("dane demonstracyjne", () => {
  it("nie zawierają prawdziwych adresów i są oznaczone jako przykład", () => {
    for (const message of demoMessages) {
      expect(message.email.endsWith("@example.com")).toBe(true);
      expect(message.name).toContain("przykład");
    }
    expect(demoAnalytics).toHaveLength(30);
  });
});

describe("panel administratora", () => {
  it("zaczyna od przeglądu z liczbą nowych wiadomości", () => {
    render(<AdminDashboard {...base} />);
    expect(screen.getByRole("heading", { level: 2, name: "Masz 2 nowe wiadomości" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Wiadomości/ }));
    expect(screen.getByRole("heading", { name: "Wiadomości od klientów" })).toBeTruthy();
  });

  it("w wersji demo niczego nie wysyła na serwer", async () => {
    render(<AdminDashboard {...base} demo />);
    expect(screen.getByRole("note").textContent).toContain("zmiany nie są zapisywane");
    fireEvent.click(screen.getByRole("navigation", { name: "Sekcje panelu" }).querySelectorAll("button")[2]);
    fireEvent.click(screen.getByRole("button", { name: "Usuń realizację: Strona testowa" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("wersja demo"));
    fireEvent.click(screen.getByRole("navigation", { name: "Sekcje panelu" }).querySelectorAll("button")[1]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "closed" } });
    expect(Object.values(actions).every(fn => fn.mock.calls.length === 0)).toBe(true);
    expect(screen.queryByRole("button", { name: "Wyloguj się" })).toBeNull();
  });

  it("w panelu właściciela zapisuje zmianę statusu", async () => {
    render(<AdminDashboard {...base} initialTab="messages" />);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "replied" } });
    await waitFor(() => expect(actions.updateMessageStatusAction).toHaveBeenCalledWith("demo-1", "replied"));
  });
});
