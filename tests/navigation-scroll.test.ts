// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { openContactForm, CONTACT_PREFILL_EVENT } from "../src/lib/contact/prefill";
import { createNavigationScroll, scrollToSection } from "../src/lib/motion/navigation-scroll";

let controller: ReturnType<typeof createNavigationScroll> | undefined;
let x = 0, y = 0;
const settle = () => vi.advanceTimersByTime(80);
const scroll = (top: number) => { y = top; window.dispatchEvent(new Event("scroll")); };
beforeEach(() => {
  vi.useFakeTimers(); sessionStorage.clear();
  history.replaceState({ __NA: true, tree: "retained" }, "", "/");
  document.body.innerHTML = '<header class="portfolio-nav"></header><main id="main-content"></main><section id="kontakt"></section>';
  document.querySelector("header")!.getBoundingClientRect = () => ({ height: 86 } as DOMRect);
  document.querySelector("#kontakt")!.getBoundingClientRect = () => ({ top: 1800 - y } as DOMRect);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 16));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
  vi.spyOn(window, "scrollX", "get").mockImplementation(() => x);
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => y);
  vi.spyOn(window, "scrollTo").mockImplementation(options => { const o = options as ScrollToOptions; x = o.left ?? x; y = o.top ?? y; });
  x = 0; y = 0;
});
afterEach(() => { controller?.dispose(); controller = undefined; vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); document.documentElement.classList.remove("motion-paused"); });

it("opens a new route at the top and preserves Next history state", () => {
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  scroll(900);
  history.pushState({ __NA: true, tree: "new" }, "", "/o-mnie");
  controller.ready(); settle();
  expect(y).toBe(0);
  expect(history.state).toMatchObject({ __NA: true, tree: "new", ewScrollEntry: expect.any(String) });
});

it("restores independent history entries even when they have the same URL", () => {
  const traverse = history.replaceState.bind(history);
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  scroll(650); const first = history.state;
  history.pushState({ __NA: true }, "", "/"); settle(); vi.advanceTimersByTime(1800);
  scroll(1400); const second = history.state;
  // Simulate the URL/state part of browser traversal, then its popstate event.
  traverse(first, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate", { state: first })); settle();
  expect(y).toBe(650);
  traverse(second, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate", { state: second })); settle();
  expect(y).toBe(1400);
});

it("aligns section links below the fixed header and a link home returns to zero", () => {
  controller = createNavigationScroll(); settle();
  document.body.insertAdjacentHTML("beforeend", '<a id="section-link" href="/#kontakt">Kontakt</a><a id="home-link" href="/">Start</a>');
  document.querySelector<HTMLAnchorElement>("#section-link")!.click(); settle();
  expect(location.hash).toBe("#kontakt"); expect(y).toBe(1698);
  expect(document.activeElement?.id).toBe("kontakt");
  document.querySelector<HTMLAnchorElement>("#home-link")!.click(); settle();
  expect(location.hash).toBe(""); expect(y).toBe(0);
});

it("keeps the catalogue position when only its filter changes", () => {
  history.replaceState({}, "", "/realizacje");
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  scroll(420);
  history.pushState({}, "", "/realizacje?kategoria=apps"); settle();
  expect(y).toBe(420);
});

it("does not reset user scrolling after restoration is interrupted", () => {
  controller = createNavigationScroll();
  window.dispatchEvent(new WheelEvent("wheel")); scroll(300); settle();
  expect(y).toBe(300);
});

it("uses instant section scrolling when motion is restricted", () => {
  document.documentElement.classList.add("motion-paused");
  expect(scrollToSection("kontakt")).toBe(true);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1698, left: 0, behavior: "instant" });
  expect(scrollToSection("missing")).toBe(false);
});

it("keeps history metadata intact when the router retains a disposed wrapper", () => {
  const first = createNavigationScroll();
  const retainedReplace = history.replaceState;
  history.replaceState = function (state, unused, url) { retainedReplace.call(history, state, unused, url); };
  first.dispose();
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  history.pushState({ __NA: true }, "", "/o-mnie"); controller.ready(); settle();
  const entry = history.state.ewScrollEntry;
  history.replaceState({ __NA: true, tree: "updated" }, "", "/o-mnie");
  expect(history.state.ewScrollEntry).toBe(entry);
  expect(history.state.tree).toBe("updated");
});

it("restores a reload from session storage without losing its section URL", () => {
  history.replaceState({}, "", "/#kontakt");
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  scroll(1820); controller.dispose(); controller = undefined;
  y = 0;
  controller = createNavigationScroll(); settle();
  expect(location.hash).toBe("#kontakt");
  expect(y).toBe(1820);
});

it("does not save a transient position during Strict Mode's initial remount", () => {
  history.replaceState({}, "", "/#kontakt"); y = 247;
  const first = createNavigationScroll(); first.dispose();
  controller = createNavigationScroll(); settle();
  expect(y).toBe(1698);
});

it("keeps the pre-click position when the router scrolls during a filter update", () => {
  history.replaceState({}, "", "/realizacje");
  controller = createNavigationScroll(); settle(); vi.advanceTimersByTime(1800);
  scroll(252);
  document.body.insertAdjacentHTML("beforeend", '<nav class="portfolio-filters"><a href="/realizacje?kategoria=apps">Aplikacje</a></nav>');
  const link = document.querySelector<HTMLAnchorElement>(".portfolio-filters a")!;
  link.addEventListener("click", event => {
    event.preventDefault(); scroll(42);
    history.pushState({ __NA: true }, "", link.href);
  });
  link.click(); settle();
  expect(y).toBe(252);
});

it("reaches the contact form immediately before focusing its prefilled subject", () => {
  document.body.insertAdjacentHTML("beforeend", '<input id="contact-subject" />');
  const payload = { subject: "Strona firmowa", message: "Mój cel" };
  const receive = vi.fn();
  window.addEventListener(CONTACT_PREFILL_EVENT, receive, { once: true });
  const input = document.getElementById("contact-subject")!;
  const focus = vi.spyOn(input, "focus");
  openContactForm(payload);
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 1698, left: 0, behavior: "instant" });
  expect(y).toBe(1698);
  expect((receive.mock.calls[0][0] as CustomEvent).detail).toEqual(payload);
  vi.advanceTimersByTime(500);
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
});
