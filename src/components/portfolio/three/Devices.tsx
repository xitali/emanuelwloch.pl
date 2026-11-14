"use client";
import { forwardRef, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { Group, Texture } from "three";
import { coverFit, ScreenMaterial, ScreenMaterialImpl, type ScreenMaterialType } from "./ScreenMaterial";

/* Shared dimensions (scene units ≈ decimetres): a 16:10 laptop panel and a 16:9 monitor. */
export const LAPTOP_SCREEN = { width: 3.04, height: 1.9 };
export const MONITOR_SCREEN = { width: 4.16, height: 2.34 };

const ALUMINIUM = { color: "#cdd2d6", metalness: 0.62, roughness: 0.36, envMapIntensity: 1.4 };
const GRAPHITE = { color: "#2c3237", metalness: 0.85, roughness: 0.34, envMapIntensity: 1.2 };
const BEZEL = { color: "#060708", metalness: 0.1, roughness: 0.45 };
const KEY = { color: "#1b1f22", metalness: 0.15, roughness: 0.6 };

/** 6 rows of keys, with a wide space bar, laid out on the deck. */
function Keyboard({ width }: { width: number }) {
  const keys = useMemo(() => {
    const list: Array<{ x: number; z: number; w: number }> = [];
    const columns = 14, gap = 0.028;
    const key = (width - 0.34 - gap * (columns - 1)) / columns;
    for (let row = 0; row < 6; row++) {
      const z = -0.62 + row * (key * 0.78 + gap);
      if (row === 5) {
        const space = key * 5 + gap * 4;
        list.push({ x: 0, z, w: space });
        for (let i = 0; i < 4; i++) { const offset = space / 2 + gap + key / 2 + i * (key + gap); list.push({ x: offset, z, w: key }, { x: -offset, z, w: key }); }
        continue;
      }
      for (let c = 0; c < columns; c++) list.push({ x: -(width - 0.34) / 2 + key / 2 + c * (key + gap), z, w: key });
    }
    return { list, depth: key * 0.78 };
  }, [width]);
  return <group position={[0, 0.112, 0]}>
    {keys.list.map((k, i) => <RoundedBox key={i} args={[k.w, 0.02, keys.depth]} radius={0.008} smoothness={2} position={[k.x, 0.006, k.z]}>
      <meshStandardMaterial {...KEY} />
    </RoundedBox>)}
  </group>;
}

export interface ScreenProps {
  width: number;
  height: number;
  textureA: Texture;
  textureB?: Texture;
  materialRef?: React.Ref<ScreenMaterialType>;
}

/** The lit panel plus a thin glossy cover that picks up studio reflections. */
export function Screen({ width, height, textureA, textureB, materialRef }: ScreenProps) {
  const fitA = useMemo(() => coverFit(textureA, width / height), [textureA, width, height]);
  const fitB = useMemo(() => coverFit(textureB ?? textureA, width / height), [textureA, textureB, width, height]);
  return <group>
    <mesh>
      <planeGeometry args={[width, height]} />
      <ScreenMaterial ref={materialRef} key={ScreenMaterialImpl.key} uMapA={textureA} uMapB={textureB ?? textureA} uRepeatA={fitA.repeat} uOffsetA={fitA.offset} uRepeatB={fitB.repeat} uOffsetB={fitB.offset} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0, 0.004]}>
      <planeGeometry args={[width, height]} />
      <meshPhysicalMaterial color="#000000" metalness={0} roughness={0.06} clearcoat={1} clearcoatRoughness={0.04} transparent opacity={0.16} depthWrite={false} />
    </mesh>
  </group>;
}

type GroupProps = ThreeElements["group"];

/** Thin aluminium laptop. `open` is the lid angle in radians (0 closed, ~1.9 open). */
export const Laptop = forwardRef<Group, GroupProps & { lidRef?: React.Ref<Group>; screen: Omit<ScreenProps, "width" | "height"> }>(function Laptop({ lidRef, screen, ...props }, ref) {
  const { width, height } = LAPTOP_SCREEN;
  const depth = 2.3;
  return <group ref={ref} {...props}>
    {/* Base */}
    <RoundedBox args={[width + 0.36, 0.11, depth]} radius={0.05} smoothness={4} position={[0, 0.055, 0]} castShadow receiveShadow>
      <meshStandardMaterial {...ALUMINIUM} />
    </RoundedBox>
    {/* Keyboard and glass trackpad */}
    <Keyboard width={width} />
    <RoundedBox args={[1.3, 0.006, 0.78]} radius={0.003} smoothness={2} position={[0, 0.111, 0.7]}>
      <meshStandardMaterial color="#c9ced2" metalness={0.8} roughness={0.18} envMapIntensity={1.3} />
    </RoundedBox>
    {/* Lid hinges at the back edge of the base */}
    <group ref={lidRef} position={[0, 0.11, -depth / 2 + 0.02]} rotation={[-0.28, 0, 0]}>
      <group position={[0, (height + 0.2) / 2, 0]}>
        <RoundedBox args={[width + 0.36, height + 0.26, 0.07]} radius={0.05} smoothness={4} position={[0, 0, -0.035]} castShadow>
          <meshStandardMaterial {...ALUMINIUM} />
        </RoundedBox>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[width + 0.24, height + 0.16]} />
          <meshStandardMaterial {...BEZEL} />
        </mesh>
        <group position={[0, 0.02, 0.006]}>
          <Screen width={width} height={height} {...screen} />
        </group>
      </group>
    </group>
  </group>;
});

/** Studio monitor on a slim stand. */
export const Monitor = forwardRef<Group, GroupProps & { screen: Omit<ScreenProps, "width" | "height"> }>(function Monitor({ screen, ...props }, ref) {
  const { width, height } = MONITOR_SCREEN;
  return <group ref={ref} {...props}>
    {/* Foot and neck */}
    <RoundedBox args={[1.5, 0.06, 0.95]} radius={0.03} smoothness={4} position={[0, 0.03, 0.05]} castShadow receiveShadow>
      <meshStandardMaterial {...GRAPHITE} />
    </RoundedBox>
    <RoundedBox args={[0.32, 1.35, 0.1]} radius={0.04} smoothness={4} position={[0, 0.72, -0.28]} rotation={[0.12, 0, 0]} castShadow>
      <meshStandardMaterial {...GRAPHITE} />
    </RoundedBox>
    {/* Panel */}
    <group position={[0, 1.92, -0.12]}>
      <RoundedBox args={[width + 0.16, height + 0.16, 0.09]} radius={0.04} smoothness={4} position={[0, 0, -0.045]} castShadow>
        <meshStandardMaterial {...GRAPHITE} />
      </RoundedBox>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[width + 0.08, height + 0.08]} />
        <meshStandardMaterial {...BEZEL} />
      </mesh>
      <group position={[0, 0, 0.006]}>
        <Screen width={width} height={height} {...screen} />
      </group>
    </group>
  </group>;
});
