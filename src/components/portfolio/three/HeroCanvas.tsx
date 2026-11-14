"use client";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils, Vector3, type Group, type Texture } from "three";
import DeskComposition from "./DeskComposition";
import Studio from "./Studio";
import { coverFit, prepareScreenTexture, type ScreenMaterialType } from "./ScreenMaterial";
import { LAPTOP_SCREEN, MONITOR_SCREEN, pageAspect } from "./Devices";
import type { ChromeKind } from "./chrome";

export interface HeroKindScreens { laptop: string; monitor: string; chrome: ChromeKind }

/** Per-kind pose: a slow turn of the whole desk so each change of product reads as a new shot. */
const POSES = [
  { turn: -0.04, lift: 0, monitor: -0.28, camera: [3.4, 3.4, 8.6] },
  { turn: 0.1, lift: 0.06, monitor: -0.36, camera: [2.6, 3.0, 8.9] },
  { turn: -0.14, lift: 0.03, monitor: -0.2, camera: [3.9, 3.7, 8.3] },
  { turn: 0.05, lift: 0.08, monitor: -0.32, camera: [3.0, 2.9, 8.7] },
] as const;
const LOOK_AT = new Vector3(0.4, 1.3, -0.35);
const LID_OPEN = -0.28;
const LID_CLOSED = -Math.PI / 2 - 0.02;

/** Tracks one screen's wipe from the texture it shows to the one the current kind needs. */
function useWipe(initial: number) {
  return useRef({ shown: initial, progress: 1 });
}

function stepWipe(material: ScreenMaterialType | null, wipe: { shown: number; progress: number }, textures: Texture[], target: number, aspect: number, delta: number) {
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
    // ~0.9 s, eased; a newer target waits until this wipe ends.
    wipe.progress = Math.min(1, wipe.progress + delta / 0.9);
    material.uMix = MathUtils.smootherstep(wipe.progress, 0, 1);
  }
}

function Desk({ kinds, phase, onReady }: { kinds: HeroKindScreens[]; phase: number; onReady: () => void }) {
  const urls = useMemo(() => kinds.flatMap(k => [k.laptop, k.monitor]), [kinds]);
  const loaded = useTexture(urls, textures => textures.forEach(prepareScreenTexture));
  const laptopTextures = useMemo(() => loaded.filter((_, i) => i % 2 === 0), [loaded]);
  const monitorTextures = useMemo(() => loaded.filter((_, i) => i % 2 === 1), [loaded]);
  const root = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const monitor = useRef<Group>(null);
  const laptopScreen = useRef<ScreenMaterialType>(null);
  const monitorScreen = useRef<ScreenMaterialType>(null);
  const pointer = useThree(state => state.pointer);
  const intro = useRef(0);
  // Screens mount once with the first kind; later kinds arrive through the wipe, not through props.
  const [first] = useState(phase);
  const laptopWipe = useWipe(first);
  const monitorWipe = useWipe(first);
  const target = useRef(phase);
  useEffect(() => { target.current = phase; }, [phase]);

  useEffect(() => { onReady(); }, [onReady]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    intro.current = Math.min(1, intro.current + delta / 1.6);
    const eased = 1 - Math.pow(1 - intro.current, 3);
    const pose = POSES[target.current] ?? POSES[0];
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, pose.turn + pointer.x * 0.12, 3, delta);
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, -pointer.y * 0.05, 3, delta);
      root.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.04 + (1 - eased) * -0.6;
    }
    if (lid.current) lid.current.rotation.x = MathUtils.lerp(LID_CLOSED, LID_OPEN, MathUtils.smoothstep(intro.current, 0.15, 1));
    if (monitor.current) {
      monitor.current.position.y = MathUtils.damp(monitor.current.position.y, pose.lift, 4, delta);
      monitor.current.rotation.y = MathUtils.damp(monitor.current.rotation.y, pose.monitor, 3, delta);
    }
    // A short dolly to a new angle for every kind of product.
    const camera = state.camera;
    camera.position.set(
      MathUtils.damp(camera.position.x, pose.camera[0], 1.8, delta),
      MathUtils.damp(camera.position.y, pose.camera[1], 1.8, delta),
      MathUtils.damp(camera.position.z, pose.camera[2], 1.8, delta),
    );
    camera.lookAt(LOOK_AT);
    // Screens power on once the lid is nearly open.
    const power = MathUtils.smoothstep(intro.current, 0.55, 1);
    if (laptopScreen.current) laptopScreen.current.uPower = power;
    if (monitorScreen.current) monitorScreen.current.uPower = Math.min(1, power * 1.2);
    const chrome = kinds[target.current]?.chrome ?? "browser";
    stepWipe(laptopScreen.current, laptopWipe.current, laptopTextures, target.current, pageAspect(LAPTOP_SCREEN.width, LAPTOP_SCREEN.height, chrome), delta);
    stepWipe(monitorScreen.current, monitorWipe.current, monitorTextures, target.current, pageAspect(MONITOR_SCREEN.width, MONITOR_SCREEN.height, chrome), delta);
  });

  return <DeskComposition chrome={kinds[phase]?.chrome ?? "browser"} screens={{ laptopA: laptopTextures[first], monitorA: monitorTextures[first] }} rootRef={root} lidRef={lid} monitorRef={monitor} laptopScreenRef={laptopScreen} monitorScreenRef={monitorScreen} />;
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function LostContext({ onLost }: { onLost: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onLost(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);
  return null;
}

/** Live hero desk. Renders only while visible; the caller shows a still until `onReady`. */
export default function HeroCanvas({ kinds, phase, active, onReady, onFail, fallback }: { kinds: HeroKindScreens[]; phase: number; active: boolean; onReady: () => void; onFail: () => void; fallback: ReactNode }) {
  const [lost, setLost] = useState(false);
  useEffect(() => { if (lost) onFail(); }, [lost, onFail]);
  if (lost) return <>{fallback}</>;
  return <SceneBoundary fallback={fallback}>
    <Canvas className="hero-canvas" eventSource={typeof document !== "undefined" ? document.documentElement : undefined} eventPrefix="client" dpr={[1, 1.75]} frameloop={active ? "always" : "never"} camera={{ position: [3.4, 3.4, 8.6], fov: 28 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} onCreated={({ camera }) => camera.lookAt(0.4, 1.3, -0.35)} fallback={fallback}>
      <Suspense fallback={null}>
        <Studio frames={1} />
        <Desk kinds={kinds} phase={phase} onReady={onReady} />
      </Suspense>
      <LostContext onLost={() => setLost(true)} />
    </Canvas>
  </SceneBoundary>;
}
