"use client";
import type { ReactNode } from "react";
import WorldView, { lazyScene } from "@/components/world/WorldView";
import { useQuality } from "@/components/world/World";

const StackScene = lazyScene<object>(() => import("@/components/world/scenes/StackScene"));

/** The panel screenshot; with 3D on, the back office drawn as layers that come apart on scroll. */
export default function BackofficeStage({ children }: { children: ReactNode }) {
  const quality = useQuality();
  return <div className={`backoffice-stage${quality === "static" ? "" : " is-live"}`}>
    <WorldView className="backoffice-world" scene={StackScene} sceneProps={{}} fallback={children} />
  </div>;
}
