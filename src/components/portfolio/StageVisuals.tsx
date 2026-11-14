"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";
import type { SceneState } from "./three/layers";
import { heroKinds } from "@/lib/hero-kinds";

const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), { ssr: false });

export const stageKinds = heroKinds;
const screens = stageKinds.map(({ laptop, monitor }) => ({ laptop, monitor }));

let webglSupport: boolean | undefined;
const detectWebgl = () => {
  if (webglSupport === undefined) {
    try { const canvas = document.createElement("canvas"); webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")); } catch { webglSupport = false; }
  }
  return webglSupport;
};
const noSubscription = () => () => {};

function Stills({ phase }: { phase: number }) {
  return <>{stageKinds.map((kind, index) => <div key={kind.id} className={`hero-stage-scene scene-${kind.id}`} data-current={phase === index}>
    <Image src={kind.still} alt="" fill sizes="(max-width: 1023px) 92vw, 52vw" priority={index === 0} className="hero-still" />
  </div>)}</>;
}

export default function StageVisuals({ phase, active, compact, reduced, ready }: { phase: number; state?: SceneState; active: boolean; compact?: boolean; reduced: boolean; ready?: boolean }) {
  const webgl = useSyncExternalStore(noSubscription, detectWebgl, () => false);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const use3d = webgl && !failed && !compact && !reduced && Boolean(ready);
  const onReady = useCallback(() => setLive(true), []);
  const onFail = useCallback(() => setFailed(true), []);
  return <div className="hero-stage-scenes" data-running={active && !reduced} data-live={use3d && live} aria-hidden="true">
    <Stills phase={phase} />
    {use3d && <div className="hero-canvas-wrap"><HeroCanvas kinds={screens} phase={phase} active={active} onReady={onReady} onFail={onFail} fallback={null} /></div>}
    <span className="kind-note">{stageKinds[phase]?.note}</span>
  </div>;
}
