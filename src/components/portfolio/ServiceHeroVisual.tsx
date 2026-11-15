"use client";
import Image from "next/image";
import { useRef } from "react";
import WorldView, { lazyScene } from "@/components/world/WorldView";
import type { CardPointer } from "@/components/world/scenes/CardScene";
import type { ChromeKind } from "./three/chrome";

const CardScene = lazyScene<{ laptop: string; monitor: string; chrome: ChromeKind; pointer: { current: CardPointer } }>(() => import("@/components/world/scenes/CardScene"));

/** Service page hero: the rendered desk, drawn live over the still when 3D is on. */
export default function ServiceHeroVisual({ still, alt, laptop, monitor, chrome }: { still: string; alt: string; laptop: string; monitor: string; chrome: ChromeKind }) {
  const pointer = useRef<CardPointer>({ x: 0, y: 0, hover: false });
  const track = (event: React.PointerEvent<HTMLDivElement>, hover: boolean) => {
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: ((event.clientX - box.left) / box.width) * 2 - 1, y: -(((event.clientY - box.top) / box.height) * 2 - 1), hover };
  };
  return <div className="svc-hero-visual svc-hero-visual--mockup" data-reveal onPointerMove={event => track(event, true)} onPointerLeave={event => track(event, false)}>
    <WorldView className="svc-hero-world" scene={CardScene} sceneProps={{ laptop, monitor, chrome, pointer }} fallback={null} />
    <Image src={still} alt={alt} fill priority sizes="(max-width: 1023px) 92vw, 48vw" className="svc-hero-mockup" />
  </div>;
}
