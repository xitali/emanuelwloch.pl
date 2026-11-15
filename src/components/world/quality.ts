"use client";
import { useSyncExternalStore } from "react";

/**
 * How much 3D a visitor gets:
 *  - "full": desktop and laptops, every scene live;
 *  - "lite": capable phones and tablets, simpler scenes at lower resolution;
 *  - "static": reduced motion, paused motion, no WebGL, data saver or weak devices — rendered stills.
 */
export type WorldQuality = "full" | "lite" | "static";

const MOTION_EVENT = "portfolio:motion-preference";
let webgl: boolean | undefined;

function hasWebgl() {
  if (webgl === undefined) {
    try { const canvas = document.createElement("canvas"); webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")); } catch { webgl = false; }
  }
  return webgl;
}

export function detectQuality(): WorldQuality {
  const root = document.documentElement;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || root.classList.contains("motion-paused")) return "static";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData || !hasWebgl()) return "static";
  const touchFirst = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!touchFirst && innerWidth >= 1024) return "full";
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  return memory >= 4 && cores >= 6 ? "lite" : "static";
}

function subscribe(callback: () => void) {
  const queries = ["(prefers-reduced-motion: reduce)", "(hover: none), (pointer: coarse)", "(min-width: 1024px)"].map(q => matchMedia(q));
  queries.forEach(q => q.addEventListener("change", callback));
  window.addEventListener(MOTION_EVENT, callback);
  return () => { queries.forEach(q => q.removeEventListener("change", callback)); window.removeEventListener(MOTION_EVENT, callback); };
}

/** Server and first client render are "static", so markup always hydrates the same. */
export function useWorldQuality(): WorldQuality {
  return useSyncExternalStore(subscribe, detectQuality, () => "static");
}
