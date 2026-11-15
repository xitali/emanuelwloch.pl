"use client";
import { useEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { MathUtils, type Texture } from "three";
import { coverFit, prepareScreenTexture, type ScreenMaterialType } from "@/components/portfolio/three/ScreenMaterial";

/** Loads screenshots as display textures (sRGB, anisotropic). Suspends until they are ready. */
export function useScreenTextures(urls: string[]) {
  return useTexture(urls, textures => textures.forEach(prepareScreenTexture)) as Texture[];
}

/** Tells the view that the scene has drawn, once, after textures resolved. */
export function useReady(onReady: () => void) {
  useEffect(() => {
    const id = window.setTimeout(onReady, 120);
    return () => window.clearTimeout(id);
  }, [onReady]);
}

/** One screen's wipe from the texture it shows to the one wanted next. */
export function useWipe(initial: number) {
  return useRef({ shown: initial, progress: 1 });
}

export function stepWipe(material: ScreenMaterialType | null, wipe: { shown: number; progress: number }, textures: Texture[], target: number, aspect: number, delta: number, duration = 0.9) {
  if (!material) return;
  if (wipe.shown !== target && wipe.progress >= 1) {
    const from = coverFit(textures[wipe.shown], aspect);
    const to = coverFit(textures[target], aspect);
    material.uMapA = textures[wipe.shown]; material.uRepeatA = from.repeat; material.uOffsetA = from.offset;
    material.uMapB = textures[target]; material.uRepeatB = to.repeat; material.uOffsetB = to.offset;
    material.uMix = 0;
    wipe.progress = 0;
    wipe.shown = target;
  }
  if (wipe.progress < 1) {
    wipe.progress = Math.min(1, wipe.progress + delta / duration);
    material.uMix = MathUtils.smootherstep(wipe.progress, 0, 1);
  }
}

/**
 * A slow read of the page on a screen: rest at the top, glide down, rest, glide back.
 * Returns 0..1 for the screen material's uScroll.
 */
export function pageRead(time: number, period = 14, phase = 0) {
  const t = ((time + phase) % period) / period;
  const leg = t < 0.5 ? t * 2 : 2 - t * 2;
  return MathUtils.smootherstep(leg, 0.2, 0.8);
}

/** Exponential approach that is frame-rate independent and settles exactly. */
export function approach(current: number, target: number, lambda: number, delta: number) {
  const next = MathUtils.damp(current, target, lambda, delta);
  return Math.abs(next - target) < 0.0005 ? target : next;
}
