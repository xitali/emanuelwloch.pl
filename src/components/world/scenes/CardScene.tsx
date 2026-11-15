"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { MathUtils, Vector3, type Group } from "three";
import DeskComposition from "@/components/portfolio/three/DeskComposition";
import Studio from "@/components/portfolio/three/Studio";
import type { ScreenMaterialType } from "@/components/portfolio/three/ScreenMaterial";
import type { ChromeKind } from "@/components/portfolio/three/chrome";
import type { SceneProps } from "../WorldView";
import { approach, useReady, useScreenTextures } from "./shared";

export interface CardPointer { x: number; y: number; hover: boolean }

/* Same camera as the mockup generator, so the live desk lands exactly on the rendered still. */
const CAMERA: [number, number, number] = [3.4, 3.4, 8.6];
const LOOK_AT = new Vector3(0.05, 1.3, -0.35);

/**
 * A project card's desk, live: it leans toward the pointer, and on hover both screens
 * scroll down the real page while the desk lifts a little toward the viewer.
 */
export default function CardScene({ laptop, monitor, chrome, pointer, onReady }: SceneProps & { laptop: string; monitor: string; chrome: ChromeKind; pointer: { current: CardPointer } }) {
  const [laptopTexture, monitorTexture] = useScreenTextures([laptop, monitor]);
  const root = useRef<Group>(null);
  const laptopScreen = useRef<ScreenMaterialType>(null);
  const monitorScreen = useRef<ScreenMaterialType>(null);
  const read = useRef(0);
  useReady(onReady);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const p = pointer.current;
    const hover = p.hover ? 1 : 0;
    if (root.current) {
      root.current.rotation.y = approach(root.current.rotation.y, p.hover ? p.x * 0.14 : 0, 4, delta);
      root.current.rotation.x = approach(root.current.rotation.x, p.hover ? -p.y * 0.05 : 0, 4, delta);
      root.current.position.y = approach(root.current.position.y, hover * 0.1, 4, delta);
      root.current.position.z = approach(root.current.position.z, hover * 0.25, 4, delta);
    }
    // The page glides down while the pointer is on the card and settles back after.
    read.current = approach(read.current, hover, p.hover ? 0.45 : 1.6, delta);
    const scroll = MathUtils.smootherstep(read.current, 0, 1) * 0.85;
    for (const screen of [laptopScreen.current, monitorScreen.current]) {
      if (!screen) continue;
      screen.uPower = 1;
      screen.uScroll = scroll;
    }
    state.camera.lookAt(LOOK_AT);
  });

  return <>
    <PerspectiveCamera makeDefault position={CAMERA} fov={32} onUpdate={camera => camera.lookAt(LOOK_AT)} />
    <Studio />
    <DeskComposition chrome={chrome} screens={{ laptopA: laptopTexture, monitorA: monitorTexture }} rootRef={root} laptopScreenRef={laptopScreen} monitorScreenRef={monitorScreen} />
  </>;
}
