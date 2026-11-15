"use client";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import type { WorldQuality } from "./quality";

/**
 * The single WebGL canvas behind the page. Each section draws its own scene into the screen
 * rectangle of its placeholder (drei View), so the page keeps one GPU context however many
 * scenes it has, and scenes outside the viewport cost nothing.
 */
export default function WorldCanvas({ quality }: { quality: Exclude<WorldQuality, "static"> }) {
  return <Canvas
    className="world-canvas"
    eventSource={document.body}
    eventPrefix="client"
    dpr={quality === "full" ? [1, 1.75] : [1, 1.25]}
    gl={{ alpha: true, antialias: quality === "full", powerPreference: "high-performance" }}
    style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}
  >
    <View.Port />
  </Canvas>;
}
