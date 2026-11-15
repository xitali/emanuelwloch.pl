"use client";
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { View } from "@react-three/drei";
import { registerGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useQuality } from "./World";
import type { WorldQuality } from "./quality";

export interface SceneProps {
  /** 0 when the view's top enters the viewport bottom, 1 when its bottom leaves the top. */
  progress: { current: number };
  quality: Exclude<WorldQuality, "static">;
  /** Call once the scene has its textures and has drawn; the still underneath then fades out. */
  onReady: () => void;
}

/**
 * A placeholder that one scene of the shared canvas draws into. With 3D off it shows
 * `fallback` (a rendered still of the same scene) instead.
 */
export default function WorldView<P extends object>({ scene: Scene, sceneProps, fallback, className, track }: {
  scene: ComponentType<P & SceneProps>;
  sceneProps: P;
  fallback: ReactNode;
  className?: string;
  /** Element whose scroll position drives `progress`; the view itself when omitted. */
  track?: React.RefObject<HTMLElement | null>;
}) {
  const quality = useQuality();
  const box = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (quality === "static") return;
    registerGsap();
    const trigger = ScrollTrigger.create({
      trigger: track?.current ?? box.current, start: "top bottom", end: "bottom top",
      onUpdate: self => { progress.current = self.progress; },
      onRefresh: self => { progress.current = self.progress; },
    });
    return () => trigger.kill();
  }, [quality, track]);
  return <div ref={box} className={`world-view ${className ?? ""}`} data-live={quality !== "static"} data-ready={ready}>
    {quality === "static" ? fallback : <>
      <div className="world-view-still" aria-hidden="true">{fallback}</div>
      <View className="world-view-port">
        <Suspense fallback={null}><Scene {...sceneProps} progress={progress} quality={quality} onReady={onReady} /></Suspense>
      </View>
    </>}
  </div>;
}

/** Loads a scene module only when the visitor gets 3D (React.lazy: next/dynamic cannot suspend inside the R3F reconciler). */
export function lazyScene<P extends object>(load: () => Promise<{ default: ComponentType<P & SceneProps> }>) {
  return lazy(load) as unknown as ComponentType<P & SceneProps>;
}
