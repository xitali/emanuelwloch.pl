"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotionPaused } from "@/lib/motion/preference";
import { setLenis } from "@/lib/motion/smooth-scroll";

/**
 * Inertial wheel scrolling for mouse and trackpad, driven by the GSAP ticker so ScrollTrigger
 * scenes stay in step with every frame. Touch keeps native scrolling. Off when motion is
 * reduced in the system or paused on the site.
 */
export default function SmoothScroll() {
  const [paused] = useMotionPaused();
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (paused || reduced || !fine) return;
    registerGsap();
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: false, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("has-smooth-scroll");
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("has-smooth-scroll");
    };
  }, [paused]);
  return null;
}
