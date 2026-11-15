import type Lenis from "lenis";

/**
 * One shared Lenis instance (desktop, motion allowed). Other modules scroll through it so a
 * programmatic jump never fights the smoothing. Without it, plain window scrolling is used.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Scroll the page to `top`, smoothly through Lenis when it runs. */
export function scrollPageTo(top: number, smooth: boolean) {
  if (instance && smooth) {
    instance.scrollTo(top, { duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (instance) instance.scrollTo(top, { immediate: true, force: true });
  window.scrollTo({ top, left: 0, behavior: smooth ? "smooth" : "instant" });
}
