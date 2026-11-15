"use client";
import Image from "next/image";
import type { RefObject } from "react";
import type { SceneState } from "./three/layers";
import { heroKinds } from "@/lib/hero-kinds";
import WorldView, { lazyScene } from "@/components/world/WorldView";
import type { HeroKind } from "@/components/world/scenes/HeroScene";

const HeroScene = lazyScene<{ kinds: HeroKind[]; phase: number }>(() => import("@/components/world/scenes/HeroScene"));

export const stageKinds = heroKinds;
const kinds: HeroKind[] = stageKinds.map(({ laptop, monitor, chrome }) => ({ laptop, monitor, chrome }));

/** Rendered stills of the same desk: shown without 3D and while the live scene loads. */
function Stills({ phase }: { phase: number }) {
  return <>{stageKinds.map((kind, index) => <div key={kind.id} className={`hero-stage-scene scene-${kind.id}`} data-current={phase === index}>
    <Image src={kind.still} alt="" fill sizes="(max-width: 1023px) 92vw, 52vw" priority={index === 0} className="hero-still" />
  </div>)}</>;
}

export default function StageVisuals({ phase, active, reduced, track }: { phase: number; state?: SceneState; active: boolean; compact?: boolean; reduced: boolean; ready?: boolean; track?: RefObject<HTMLElement | null> }) {
  return <div className="hero-stage-scenes" data-running={active && !reduced} aria-hidden="true">
    <WorldView className="hero-world" scene={HeroScene} sceneProps={{ kinds, phase }} track={track} fallback={<Stills phase={phase} />} />
    <span className="kind-note">{stageKinds[phase]?.note}</span>
  </div>;
}
