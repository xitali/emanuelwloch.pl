"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { MathUtils, Vector3, type Group, type Mesh } from "three";
import Studio from "@/components/portfolio/three/Studio";
import { Screen } from "@/components/portfolio/three/Devices";
import type { ScreenMaterialType } from "@/components/portfolio/three/ScreenMaterial";
import type { SceneProps } from "../WorldView";
import { labelTexture } from "./labels";
import { approach, pageRead, useReady, useScreenTextures } from "./shared";

const PANEL = "/projects/sklep-internetowy-demo/panel-produktow.webp";
const WIDTH = 3.4, DEPTH = 1.92;
const LAYERS = [
  { label: "Panel administratora", accent: true },
  { label: "Role i logowanie", accent: false },
  { label: "API i integracje", accent: false },
  { label: "Baza danych", accent: false },
];
const LOOK_AT = new Vector3(0.45, 1.1, 0);

function Slab({ tint = "#151b20" }: { tint?: string }) {
  return <>
    <RoundedBox args={[WIDTH + 0.12, 0.09, DEPTH + 0.12]} radius={0.04} smoothness={3} castShadow receiveShadow>
      <meshPhysicalMaterial color={tint} metalness={0.5} roughness={0.32} clearcoat={0.8} clearcoatRoughness={0.2} envMapIntensity={1.1} />
    </RoundedBox>
    {/* Lit edge in the site accent */}
    <mesh position={[0, 0.047, DEPTH / 2 + 0.061]}>
      <boxGeometry args={[WIDTH + 0.04, 0.012, 0.004]} />
      <meshBasicMaterial color="#acd1e8" toneMapped={false} />
    </mesh>
  </>;
}

/**
 * The back office taken apart: the admin panel on top, then roles, API and the database
 * beneath it. Scrolling through the section pulls the layers apart; data pulses travel
 * up from the database to the panel.
 */
export default function StackScene({ progress, quality, onReady }: SceneProps) {
  const [panel] = useScreenTextures([PANEL]);
  const root = useRef<Group>(null);
  const layers = useRef<Array<Group | null>>([]);
  const labels = useRef<Array<Mesh | null>>([]);
  const pulses = useRef<Array<Mesh | null>>([]);
  const screen = useRef<ScreenMaterialType>(null);
  const open = useRef(0);
  useReady(onReady);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const time = state.clock.elapsedTime;
    open.current = approach(open.current, MathUtils.smootherstep(progress.current, 0.18, 0.48), 5, delta);
    const o = open.current;
    const gap = MathUtils.lerp(0.11, 0.78, o);
    layers.current.forEach((layer, i) => {
      if (!layer) return;
      const y = (LAYERS.length - 1 - i) * gap + (quality === "full" ? Math.sin(time * 0.8 + i * 0.7) * 0.025 * o : 0);
      layer.position.set(i * 0.05 * o, y, -i * 0.06 * o);
    });
    labels.current.forEach((label, i) => {
      if (!label) return;
      label.scale.setScalar(Math.max(MathUtils.smoothstep(o, 0.35 + i * 0.1, 0.7 + i * 0.08), 0.0001));
    });
    // Pulses climb from the database to the panel along three columns.
    pulses.current.forEach((pulse, i) => {
      if (!pulse) return;
      const t = ((time / 2.4) + i / pulses.current.length) % 1;
      const column = i % 3;
      pulse.position.set(-1.1 + column * 1.1, MathUtils.lerp(0.05, (LAYERS.length - 1) * gap, t), 0.2 - column * 0.2);
      pulse.scale.setScalar(Math.max(o * Math.sin(t * Math.PI), 0.0001));
    });
    if (root.current) root.current.rotation.y = approach(root.current.rotation.y, -0.5 + progress.current * 0.5 + state.pointer.x * 0.08, 3, delta);
    if (screen.current) {
      screen.current.uPower = 1;
      screen.current.uScroll = quality === "full" ? pageRead(time, 14) * 0.7 : 0;
    }
    state.camera.lookAt(LOOK_AT.x, LOOK_AT.y + o * 0.3, LOOK_AT.z);
  });

  return <>
    <PerspectiveCamera makeDefault position={[0.9, 4.6, 8.8]} fov={32} onUpdate={camera => camera.lookAt(LOOK_AT)} />
    <Studio shadowY={-0.08} />
    <group ref={root} rotation-y={-0.5}>
      {LAYERS.map((layer, i) => <group key={layer.label} ref={el => { layers.current[i] = el; }}>
        <Slab tint={i === 0 ? "#1b2227" : i === 3 ? "#10151a" : "#151b20"} />
        {i === 0 && <group position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}>
          <Screen width={WIDTH} height={DEPTH} textureA={panel} materialRef={screen} />
        </group>}
        {i === 1 && [-1, 0, 1].map(x => <group key={x} position={[x * 0.9, 0.12, 0]}>
          <mesh castShadow><sphereGeometry args={[0.13, 32, 16]} /><meshStandardMaterial color="#d6dde2" roughness={0.35} metalness={0.2} /></mesh>
          <mesh position={[0, -0.04, 0]} rotation-x={-Math.PI / 2}><torusGeometry args={[0.24, 0.018, 12, 48]} /><meshStandardMaterial color="#acd1e8" emissive="#acd1e8" emissiveIntensity={x === 0 ? 1.2 : 0.3} /></mesh>
        </group>)}
        {i === 2 && [-1, 0, 1].map(x => <mesh key={x} position={[x * 1.1, 0.065, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.16, 0.2, 40]} />
          <meshBasicMaterial color="#acd1e8" toneMapped={false} />
        </mesh>)}
        {i === 3 && [-1, 0, 1].map(x => <mesh key={x} position={[x * 1.1, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 48]} />
          <meshStandardMaterial color="#2a3238" metalness={0.8} roughness={0.35} />
        </mesh>)}
        <mesh ref={el => { labels.current[i] = el; }} position={[WIDTH / 2 + 0.55, 0.3, 0.5]} rotation-y={0.45}>
          <planeGeometry args={[1.35, 0.32]} />
          <meshBasicMaterial map={labelTexture(layer.label, { accent: layer.accent, aspect: 4.2 })} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </group>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} ref={el => { pulses.current[i] = el; }}>
        <sphereGeometry args={[0.05, 16, 8]} />
        <meshBasicMaterial color="#cfe6f3" toneMapped={false} />
      </mesh>)}
    </group>
  </>;
}
