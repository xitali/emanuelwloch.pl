import { scrollPageTo } from "@/lib/motion/smooth-scroll";

type Position = { x: number; y: number };
type Destination = { url: URL; position?: Position; focus?: boolean };
const STATE_KEY = "ewScrollEntry";
const STORAGE_KEY = "ew:scroll-positions:v1";

export function scrollToSection(id: string, smooth = true) {
  const target = document.getElementById(id);
  if (!target) return false;
  const header = document.querySelector(".portfolio-nav")?.getBoundingClientRect().height || 0;
  const top = id === "main-content" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - header - 16);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("motion-paused");
  scrollPageTo(top, smooth && !reduced);
  return true;
}

/** Own only scroll metadata; preserve all Next.js history state and routing. */
export function createNavigationScroll() {
  const history = window.history;
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;
  const previousRestoration = history.scrollRestoration;
  const positions = new Map<string, Position>();
  let disposed = false;
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) for (const [key, value] of saved.slice(-80)) {
      if (typeof key === "string" && value && Number.isFinite(value.x) && Number.isFinite(value.y) && value.x >= 0 && value.y >= 0) positions.set(key, value);
    }
  } catch { /* Storage may be disabled. In-memory back/forward still works. */ }
  const newKey = () => crypto.randomUUID();
  const stateWithKey = (state: unknown, key: string) => ({ ...(state && typeof state === "object" ? state : {}), [STATE_KEY]: key });
  const persist = () => {
    while (positions.size > 80) positions.delete(positions.keys().next().value!);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...positions])); } catch { /* Optional persistence. */ }
  };
  let key: string = history.state?.[STATE_KEY] || newKey();
  originalReplace.call(history, stateWithKey(history.state, key), "");
  history.scrollRestoration = "manual";
  let current = new URL(location.href);
  let pending: Destination | undefined = { url: current, position: positions.get(key) };
  let cancelRestore: (() => void) | undefined;
  let restoring = false;
  let clickIntent: { url: string; position: Position } | undefined;
  let intentTimer = 0;
  const remember = () => {
    if (!restoring && !clickIntent) positions.set(key, { x: window.scrollX, y: window.scrollY });
  };
  const consumePosition = (url: URL) => {
    const position = clickIntent?.url === url.href ? clickIntent.position : positions.get(key);
    if (clickIntent?.url === url.href) { clickIntent = undefined; clearTimeout(intentTimer); }
    return position;
  };
  const stop = () => { cancelRestore?.(); cancelRestore = undefined; };
  const hashId = (hash: string) => {
    try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); }
  };
  const restore = (destination: Destination) => {
    stop();
    restoring = true;
    document.documentElement.setAttribute("data-navigation-scroll", "restoring");
    document.querySelector(".portfolio-nav")?.classList.remove("is-hidden");
    let frame = 0;
    let secondFrame = 0;
    let stopped = false;
    let focused = false;
    let applied = false;
    const apply = () => {
      if (stopped) return;
      applied = true;
      if (destination.position) window.scrollTo({ left: destination.position.x, top: destination.position.y, behavior: "instant" });
      else if (destination.url.hash && scrollToSection(hashId(destination.url.hash), false)) {
        if (destination.focus && !focused) {
          focused = true;
          const target = document.getElementById(hashId(destination.url.hash));
          if (target) {
            const hadTabIndex = target.hasAttribute("tabindex");
            if (!hadTabIndex) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
            if (!hadTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
          }
        }
        return;
      }
      else window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    };
    const queue = () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame);
      frame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(apply); });
    };
    const observer = new ResizeObserver(queue);
    observer.observe(document.body);
    const interrupt = (event: Event) => {
      if (event instanceof KeyboardEvent && !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) return;
      finish();
    };
    const finish = () => {
      if (stopped) return;
      stopped = true; restoring = false;
      document.documentElement.removeAttribute("data-navigation-scroll");
      observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame);
      clearTimeout(timer);
      for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.removeEventListener(event, interrupt, true);
      window.removeEventListener("load", queue);
      if (applied) remember();
    };
    const timer = window.setTimeout(finish, 1800);
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(event, interrupt, { capture: true, passive: true });
    window.addEventListener("load", queue);
    document.fonts?.ready.then(() => { if (!stopped) queue(); }).catch(() => {});
    cancelRestore = finish;
    queue();
  };
  const ready = () => {
    if (!pending || pending.url.pathname !== location.pathname || pending.url.search !== location.search) return;
    const destination = pending; pending = undefined;
    restore(destination);
  };
  const navigate = (url: URL, position?: Position) => {
    const samePage = url.pathname === current.pathname;
    stop();
    key = history.state?.[STATE_KEY] || newKey();
    pending = { url, position, focus: !position && Boolean(url.hash) };
    current = url;
    if (samePage) ready(); // Includes section anchors and catalogue filters.
  };
  const push: History["pushState"] = function (state, unused, url) {
    if (disposed) return originalPush.call(history, state, unused, url);
    stop(); persist();
    const from = current;
    originalPush.call(history, stateWithKey(state, newKey()), unused, url);
    const next = new URL(location.href);
    const position = consumePosition(next);
    navigate(next, next.pathname === from.pathname && !next.hash ? position : undefined);
  };
  const replace: History["replaceState"] = function (state, unused, url) {
    if (disposed) return originalReplace.call(history, state, unused, url);
    const previous = location.href;
    originalReplace.call(history, stateWithKey(state, history.state?.[STATE_KEY] || key), unused, url);
    if (location.href !== previous) {
      const next = new URL(location.href);
      const position = consumePosition(next);
      navigate(next, next.pathname === current.pathname && !next.hash ? position : undefined);
    }
  };
  history.pushState = push;
  history.replaceState = replace;
  const pop = () => {
    stop(); remember(); persist();
    if (!history.state?.[STATE_KEY]) originalReplace.call(history, stateWithKey(history.state, newKey()), "");
    navigate(new URL(location.href), positions.get(history.state[STATE_KEY]));
  };
  const click = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) return;
    clickIntent = undefined; clearTimeout(intentTimer);
    stop(); remember(); persist();
    if (url.pathname !== location.pathname || url.search !== location.search) {
      clickIntent = { url: url.href, position: { x: window.scrollX, y: window.scrollY } };
      intentTimer = window.setTimeout(() => { clickIntent = undefined; remember(); }, 5000);
      return;
    }
    if (url.href === location.href && anchor.closest(".portfolio-filters")) { event.preventDefault(); return; }
    if (url.hash && !document.getElementById(hashId(url.hash))) return;
    event.preventDefault();
    if (url.href !== location.href) history.pushState(history.state, "", url);
    pending = undefined;
    restore({ url, focus: Boolean(url.hash) });
  };
  const leave = () => { stop(); remember(); persist(); };
  const show = (event: PageTransitionEvent) => {
    if (event.persisted) restore({ url: new URL(location.href), position: positions.get(key) });
  };
  window.addEventListener("scroll", remember, { passive: true });
  window.addEventListener("popstate", pop);
  window.addEventListener("pagehide", leave);
  window.addEventListener("pageshow", show);
  document.addEventListener("click", click, true);
  ready();
  return {
    ready,
    dispose() {
      stop(); persist();
      disposed = true;
      clearTimeout(intentTimer);
      if (history.pushState === push) history.pushState = originalPush;
      if (history.replaceState === replace) history.replaceState = originalReplace;
      history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("pageshow", show);
      document.removeEventListener("click", click, true);
    },
  };
}
