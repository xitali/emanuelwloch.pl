"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { MathUtils, Vector3, type Group, type SpotLight } from "three";
import DeskComposition from "@/components/portfolio/three/DeskComposition";
import Studio from "@/components/portfolio/three/Studio";
import { LAPTOP_SCREEN, LID_CLOSED, LID_OPEN, MONITOR_SCREEN, pageAspect } from "@/components/portfolio/three/Devices";
import type { ScreenMaterialType } from "@/components/portfolio/three/ScreenMaterial";
import type { ChromeKind } from "@/components/portfolio/three/chrome";
import type { SceneProps } from "../WorldView";
import { approach, pageRead, stepWipe, useReady, useScreenTextures, useWipe } from "./shared";

export interface HeroKind { laptop: string; monitor: string; chrome: ChromeKind }

/** One shot per kind of product: desk turn, monitor lift and turn, camera position. */
const SHOTS = [
  { turn: -0.04, lift: 0, monitor: -0.28, camera: [3.4, 3.4, 8.6] },
  { turn: 0.1, lift: 0.06, monitor: -0.36, camera: [2.6, 3.0, 8.9] },
  { turn: -0.14, lift: 0.03, monitor: -0.2, camera: [3.9, 3.7, 8.3] },
  { turn: 0.05, lift: 0.08, monitor: -0.32, camera: [3.0, 2.9, 8.7] },
] as const;
const LOOK_AT = new Vector3(0.4, 1.3, -0.35);

/**
 * Opening sequence: the desk rises out of the dark, a light sweeps across the aluminium,
 * the lid opens and both screens power on. Each kind of product is then its own shot,
 * with the screens wiping to the next project and pages being read slowly.
 */
export default function HeroScene({ kinds, phase, progress, quality, onReady }: SceneProps & { kinds: HeroKind[]; phase: number }) {
  const urls = useMemo(() => kinds.flatMap(k => [k.laptop, k.monitor]), [kinds]);
  const loaded = useScreenTextures(urls);
  const laptopTextures = useMemo(() => loaded.filter((_, i) => i % 2 === 0), [loaded]);
  const monitorTextures = useMemo(() => loaded.filter((_, i) => i % 2 === 1), [loaded]);
  const root = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const monitor = useRef<Group>(null);
  const sweep = useRef<SpotLight>(null);
  const laptopScreen = useRef<ScreenMaterialType>(null);
  const monitorScreen = useRef<ScreenMaterialType>(null);
  const intro = useRef(0);
  const [first] = useState(phase);
  const laptopWipe = useWipe(first);
  const monitorWipe = useWipe(first);
  const target = useRef(phase);
  useEffect(() => { target.current = phase; }, [phase]);
  useReady(onReady);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const time = state.clock.elapsedTime;
    intro.current = Math.min(1, intro.current + delta / 2.4);
    const t = intro.current;
    const shot = SHOTS[target.current] ?? SHOTS[0];
    const pointer = state.pointer;
    // Scrolling past the hero eases the whole desk back and down a little.
    const leave = MathUtils.smoothstep(progress.current, 0.55, 1);
    if (root.current) {
      root.current.rotation.y = approach(root.current.rotation.y, shot.turn + pointer.x * 0.12 + leave * 0.25, 3, delta);
      root.current.rotation.x = approach(root.current.rotation.x, -pointer.y * 0.05, 3, delta);
      const rise = 1 - Math.pow(1 - MathUtils.smoothstep(t, 0, 0.45), 3);
      root.current.position.y = (1 - rise) * -0.9 + (quality === "full" ? Math.sin(time * 0.6) * 0.04 : 0) - leave * 0.6;
    }
    if (lid.current) lid.current.rotation.x = MathUtils.lerp(LID_CLOSED, LID_OPEN, MathUtils.smootherstep(t, 0.3, 0.85));
    if (monitor.current) {
      monitor.current.position.y = approach(monitor.current.position.y, shot.lift, 4, delta);
      monitor.current.rotation.y = approach(monitor.current.rotation.y, shot.monitor, 3, delta);
    }
    // A narrow light sweeps once across the desk while it rises.
    if (sweep.current) {
      const s = MathUtils.smoothstep(t, 0.05, 0.75);
      sweep.current.position.set(MathUtils.lerp(-7, 7, s), 4, 3);
      sweep.current.intensity = Math.sin(s * Math.PI) * 60;
      sweep.current.target.position.set(0, 0.5, 0);
      sweep.current.target.updateMatrixWorld();
    }
    const camera = state.camera;
    camera.position.set(
      approach(camera.position.x, shot.camera[0], 1.8, delta),
      approach(camera.position.y, shot.camera[1] + leave * 0.8, 1.8, delta),
      approach(camera.position.z, shot.camera[2], 1.8, delta),
    );
    camera.lookAt(LOOK_AT);
    const power = MathUtils.smoothstep(t, 0.7, 1);
    for (const [screen, offset] of [[laptopScreen.current, 0], [monitorScreen.current, 5]] as const) {
      if (!screen) continue;
      screen.uPower = power;
      screen.uScroll = quality === "full" ? pageRead(time, 16, offset) * 0.9 : 0;
    }
    const chrome = kinds[target.current]?.chrome ?? "browser";
    stepWipe(laptopScreen.current, laptopWipe.current, laptopTextures, target.current, pageAspect(LAPTOP_SCREEN.width, LAPTOP_SCREEN.height, chrome), delta);
    stepWipe(monitorScreen.current, monitorWipe.current, monitorTextures, target.current, pageAspect(MONITOR_SCREEN.width, MONITOR_SCREEN.height, chrome), delta);
  });

  return <>
    <PerspectiveCamera makeDefault position={[3.4, 3.4, 8.6]} fov={28} onUpdate={camera => camera.lookAt(LOOK_AT)} />
    <Studio />
    <spotLight ref={sweep} angle={0.22} penumbra={0.9} distance={20} decay={1.4} color="#eaf3f8" intensity={0} />
    <DeskComposition chrome={kinds[phase]?.chrome ?? "browser"} screens={{ laptopA: laptopTextures[first], monitorA: monitorTextures[first] }} rootRef={root} lidRef={lid} monitorRef={monitor} laptopScreenRef={laptopScreen} monitorScreenRef={monitorScreen} />
  </>;
}
