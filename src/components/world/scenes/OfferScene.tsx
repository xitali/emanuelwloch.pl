"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { MathUtils, Vector3, type Group, type Mesh, type MeshStandardMaterial, type Texture } from "three";
import Studio from "@/components/portfolio/three/Studio";
import { Laptop, LAPTOP_SCREEN, Monitor, Phone, pageAspect, Screen } from "@/components/portfolio/three/Devices";
import { coverFit, type ScreenMaterialType } from "@/components/portfolio/three/ScreenMaterial";
import type { SceneProps } from "../WorldView";
import { labelTexture } from "./labels";
import { approach, pageRead, stepWipe, useReady, useScreenTextures, useWipe } from "./shared";

/** Screenshots used by the five modes; order matters (indices below). */
export const OFFER_TEXTURES = [
  "/projects/emanuel-wloch-full-stack-software-engineer-edge-platform/2026-11-cms-oferta.webp", // 0 laptop: site
  "/projects/lapki-w-ciapki-sklep-zoologiczny/2026-11-lapki-katalog.webp", // 1 laptop: shop
  "/projects/sklep-internetowy-demo/panel-produktow.webp", // 2 laptop: database
  "/projects/emanuel-wloch-full-stack-software-engineer-edge-platform/2026-11-cms-telefon.webp", // 3 phone
  "/projects/solid-print/2026-11-solid-wycena.webp", // 4 monitor: app
  "/projects/wardogs-companion/2026-11-wardogs-przeglad.webp", // 5 monitor: program
  "/projects/wardogs-companion/2026-11-wardogs-analiza.webp", // 6 detached window
  "/projects/lapki-w-ciapki-sklep-zoologiczny/2026-11-lapki-glowna.webp", // 7 product card
  "/projects/sklep-internetowy-demo/2026-11-sklep-katalog.webp", // 8 product card
] as const;

type Pose = { at: [number, number, number]; turn: number; scale: number };
const HIDDEN: Pose = { at: [0, -0.6, -1], turn: 0, scale: 0 };
/** Where each device stands in each mode (site, shop, app, database, program). */
const LAPTOP: Pose[] = [
  { at: [-0.75, 0, 0.2], turn: 0.32, scale: 1 },
  { at: [-0.9, 0, 0.1], turn: 0.26, scale: 1 },
  HIDDEN,
  { at: [-1.35, 0, 0.3], turn: 0.38, scale: 1 },
  HIDDEN,
];
const LAPTOP_TEXTURE = [0, 1, 0, 2, 2];
const APP_MONITOR: Pose[] = [HIDDEN, HIDDEN, { at: [-0.7, 0, -0.9], turn: 0.22, scale: 1 }, HIDDEN, HIDDEN];
const PROGRAM_MONITOR: Pose[] = [HIDDEN, HIDDEN, HIDDEN, HIDDEN, { at: [-0.35, 0, -0.9], turn: 0.18, scale: 1 }];
const LOOK_AT = new Vector3(0.2, 1.05, 0);

function useWeight() { return useRef(0); }

function place(group: Group | null, pose: Pose, delta: number) {
  if (!group) return;
  group.position.set(
    approach(group.position.x, pose.at[0], 4, delta),
    approach(group.position.y, pose.at[1], 4, delta),
    approach(group.position.z, pose.at[2], 4, delta),
  );
  group.rotation.y = approach(group.rotation.y, pose.turn, 4, delta);
  const s = approach(group.scale.x, pose.scale, 5, delta);
  group.scale.setScalar(Math.max(s, 0.0001));
  group.visible = s > 0.01;
}

/** Fades a mode's extra props in and out by scaling their group. */
function weigh(group: Group | null, weight: { current: number }, on: boolean, delta: number) {
  weight.current = approach(weight.current, on ? 1 : 0, 3.5, delta);
  if (!group) return;
  const w = MathUtils.smootherstep(weight.current, 0, 1);
  group.scale.setScalar(Math.max(w, 0.0001));
  group.visible = w > 0.01;
}

/** A crop of a screenshot used as a printed product card. Clones share the uploaded image. */
function useCardTexture(source: Texture, aspect: number) {
  const texture = useMemo(() => {
    const clone = source.clone();
    const fit = coverFit(source, aspect);
    clone.repeat.copy(fit.repeat);
    clone.offset.set(fit.offset.x, 1 - fit.repeat.y);
    clone.needsUpdate = true;
    return clone;
  }, [source, aspect]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

const CARD = { width: 0.62, height: 0.78 };
/** Shop: product cards leave the screen and land in an order tray. */
function ShopExtras({ textures, groupRef }: { textures: Texture[]; groupRef: React.Ref<Group> }) {
  const a = useCardTexture(textures[0], CARD.width / (CARD.height * 0.62));
  const b = useCardTexture(textures[1], CARD.width / (CARD.height * 0.62));
  const c = useCardTexture(textures[2], CARD.width / (CARD.height * 0.62));
  const cards = useRef<Array<Group | null>>([]);
  useFrame(state => {
    const time = state.clock.elapsedTime;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const t = ((time / 4.2) + i / 3) % 1;
      const fly = MathUtils.smootherstep(t, 0.08, 0.72);
      const from = [-0.55 + i * 0.32, 1.35, -0.25], to = [2.05, 0.2 + i * 0.035, 0.75];
      card.position.set(
        MathUtils.lerp(from[0], to[0], fly),
        MathUtils.lerp(from[1], to[1], fly) + Math.sin(fly * Math.PI) * 1.1,
        MathUtils.lerp(from[2], to[2], fly) + Math.sin(fly * Math.PI) * 0.6,
      );
      card.rotation.set(MathUtils.lerp(0, -Math.PI / 2, fly), MathUtils.lerp(-0.2, 0.1, fly), Math.sin(fly * Math.PI) * 0.35);
      const appear = MathUtils.smoothstep(t, 0, 0.08) * (1 - MathUtils.smoothstep(t, 0.88, 1));
      card.scale.setScalar(Math.max(appear, 0.0001));
    });
  });
  return <group ref={groupRef}>
    {/* Order tray */}
    <RoundedBox args={[1.25, 0.14, 1.5]} radius={0.05} smoothness={4} position={[2.05, 0.07, 0.75]} castShadow receiveShadow>
      <meshStandardMaterial color="#1d2328" metalness={0.7} roughness={0.35} envMapIntensity={1.2} />
    </RoundedBox>
    <mesh position={[2.05, 0.145, 0.75]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1.1, 1.35]} />
      <meshStandardMaterial color="#0e1316" roughness={0.8} />
    </mesh>
    <mesh position={[2.05, 0.9, 1.55]}>
      <planeGeometry args={[1.2, 0.3]} />
      <meshBasicMaterial map={labelTexture("Nowe zamówienie", { accent: true })} transparent toneMapped={false} />
    </mesh>
    {[a, b, c].map((texture, i) => <group key={i} ref={el => { cards.current[i] = el; }}>
      <RoundedBox args={[CARD.width, CARD.height, 0.02]} radius={0.03} smoothness={3} castShadow>
        <meshStandardMaterial color="#eef1f3" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, CARD.height * 0.17, 0.011]}>
        <planeGeometry args={[CARD.width - 0.06, CARD.height * 0.62]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, -CARD.height * 0.3, 0.011]}>
        <planeGeometry args={[CARD.width - 0.18, 0.05]} />
        <meshBasicMaterial color="#1b2227" />
      </mesh>
    </group>)}
  </group>;
}

const LAYERS = ["Interfejs", "Logika i API", "Baza danych"];
/** App: the product splits into its layers in front of the monitor. */
function AppExtras({ groupRef, weight }: { groupRef: React.Ref<Group>; weight: { current: number } }) {
  const layers = useRef<Array<Group | null>>([]);
  useFrame(state => {
    const time = state.clock.elapsedTime;
    const open = MathUtils.smootherstep(weight.current, 0.2, 1);
    layers.current.forEach((layer, i) => {
      if (!layer) return;
      const breathe = Math.sin(time * 0.9 + i) * 0.05;
      layer.position.set(1.45 + i * 0.12 * open, 0.35 + i * 0.55 * open + breathe, 1.2 + i * 0.1 * open);
      layer.rotation.set(-Math.PI / 2 + 0.35, 0, -0.42);
    });
  });
  return <group ref={groupRef}>
    {LAYERS.map((label, i) => <group key={label} ref={el => { layers.current[i] = el; }}>
      <RoundedBox args={[1.6, 1.05, 0.03]} radius={0.04} smoothness={3}>
        <meshPhysicalMaterial color={i === 2 ? "#1e2a31" : "#acd1e8"} metalness={0.2} roughness={0.15} clearcoat={1} transparent opacity={i === 2 ? 0.85 : 0.16 + i * 0.1} depthWrite={false} />
      </RoundedBox>
      <mesh position={[0, 0, 0.02]} renderOrder={2}>
        <planeGeometry args={[1.25, 0.31]} />
        <meshBasicMaterial map={labelTexture(label, { accent: i === 0 })} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>)}
  </group>;
}

/** Database: spreadsheet rows stream into a stack of storage discs that light up on arrival. */
function DatabaseExtras({ groupRef }: { groupRef: React.Ref<Group> }) {
  const rows = useRef<Array<Mesh | null>>([]);
  const rings = useRef<Array<MeshStandardMaterial | null>>([]);
  const ROWS = 9;
  useFrame(state => {
    const time = state.clock.elapsedTime;
    let arrival = 0;
    rows.current.forEach((row, i) => {
      if (!row) return;
      const t = ((time / 3.2) + i / ROWS) % 1;
      const k = MathUtils.smootherstep(t, 0, 0.85);
      row.position.set(MathUtils.lerp(-0.4, 1.65, k), MathUtils.lerp(1.4 - (i % 3) * 0.18, 1.62, k) + Math.sin(k * Math.PI) * 0.35, MathUtils.lerp(0.1, 0.25, k));
      const s = MathUtils.smoothstep(t, 0, 0.1) * (1 - MathUtils.smoothstep(t, 0.78, 0.9));
      row.scale.set(Math.max(s * (1 - k * 0.5), 0.0001), Math.max(s, 0.0001), Math.max(s, 0.0001));
      if (t > 0.8 && t < 0.95) arrival = Math.max(arrival, 1 - Math.abs(t - 0.86) / 0.08);
    });
    rings.current.forEach((ring, i) => { if (ring) ring.emissiveIntensity = 0.4 + arrival * (1.8 - i * 0.4); });
  });
  return <group ref={groupRef}>
    {[0, 1, 2].map(i => <group key={i} position={[1.65, 0.26 + i * 0.5, 0.15]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.4, 64]} />
        <meshStandardMaterial color="#1f262b" metalness={0.75} roughness={0.42} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.735, 0.735, 0.025, 64]} />
        <meshStandardMaterial ref={el => { rings.current[i] = el; }} color="#0f1418" emissive="#acd1e8" emissiveIntensity={0.4} />
      </mesh>
    </group>)}
    {Array.from({ length: ROWS }, (_, i) => <mesh key={i} ref={el => { rows.current[i] = el; }}>
      <boxGeometry args={[0.95, 0.07, 0.2]} />
      <meshStandardMaterial color={i % 3 === 0 ? "#acd1e8" : "#d9e0e4"} emissive={i % 3 === 0 ? "#acd1e8" : "#000000"} emissiveIntensity={0.5} roughness={0.4} />
    </mesh>)}
    <mesh position={[1.65, 1.95, 0.9]}>
      <planeGeometry args={[1.2, 0.3]} />
      <meshBasicMaterial map={labelTexture("Jedna baza", { accent: true })} transparent toneMapped={false} />
    </mesh>
  </group>;
}

/** Program: a tool window pulls out of the monitor and floats beside it. */
function ProgramExtras({ texture, groupRef, weight }: { texture: Texture; groupRef: React.Ref<Group>; weight: { current: number } }) {
  const win = useRef<Group>(null);
  useFrame(state => {
    if (!win.current) return;
    const out = MathUtils.smootherstep(weight.current, 0.3, 1);
    const bob = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    win.current.position.set(MathUtils.lerp(-0.2, 1.55, out), MathUtils.lerp(1.9, 1.15, out) + bob, MathUtils.lerp(-0.7, 1.25, out));
    win.current.rotation.set(-0.06, MathUtils.lerp(0.18, -0.38, out), 0);
  });
  return <group ref={groupRef}>
    <group ref={win}>
      <RoundedBox args={[2.32, 1.38, 0.04]} radius={0.03} smoothness={3} position={[0, 0, -0.025]} castShadow>
        <meshStandardMaterial color="#11171c" metalness={0.4} roughness={0.4} />
      </RoundedBox>
      <Screen width={2.24} height={1.3} textureA={texture} chrome="window" />
    </group>
  </group>;
}

/**
 * Offer stage: one set of devices that re-arranges itself for the path being read —
 * laptop and phone for a website, cards flying into a tray for a shop, layers of an app,
 * rows streaming into a database, a window leaving the monitor for a desktop program.
 */
export default function OfferScene({ active, progress, quality, onReady }: SceneProps & { active: number }) {
  const textures = useScreenTextures(OFFER_TEXTURES as unknown as string[]);
  const laptopTextures = useMemo(() => [textures[0], textures[1], textures[2]], [textures]);
  const root = useRef<Group>(null);
  const laptop = useRef<Group>(null);
  const phone = useRef<Group>(null);
  const appMonitor = useRef<Group>(null);
  const programMonitor = useRef<Group>(null);
  const shop = useRef<Group>(null);
  const app = useRef<Group>(null);
  const data = useRef<Group>(null);
  const program = useRef<Group>(null);
  const weights = [useWeight(), useWeight(), useWeight(), useWeight(), useWeight()];
  const laptopScreen = useRef<ScreenMaterialType>(null);
  const phoneScreen = useRef<ScreenMaterialType>(null);
  const [first] = useState(() => LAPTOP_TEXTURE[active] ?? 0);
  const laptopWipe = useWipe(first);
  const mode = useRef(active);
  useEffect(() => { mode.current = active; }, [active]);
  useReady(onReady);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const m = mode.current;
    const time = state.clock.elapsedTime;
    place(laptop.current, LAPTOP[m], delta);
    place(phone.current, m === 0 ? { at: [1.75, 1.15, 0.85], turn: -0.4, scale: 1.45 } : HIDDEN, delta);
    if (phone.current) phone.current.rotation.x = -0.08;
    place(appMonitor.current, APP_MONITOR[m], delta);
    place(programMonitor.current, PROGRAM_MONITOR[m], delta);
    weigh(shop.current, weights[1], m === 1, delta);
    weigh(app.current, weights[2], m === 2, delta);
    weigh(data.current, weights[3], m === 3, delta);
    weigh(program.current, weights[4], m === 4, delta);
    if (root.current) {
      const enter = 1 - Math.pow(1 - MathUtils.smoothstep(progress.current, 0.02, 0.3), 3);
      root.current.position.y = (1 - enter) * -0.8 + (quality === "full" ? Math.sin(time * 0.5) * 0.03 : 0);
      root.current.rotation.y = approach(root.current.rotation.y, (1 - enter) * -0.35 + state.pointer.x * 0.1, 3, delta);
    }
    // Keep about 5.8 units of width in frame whatever the column's shape.
    const camera = state.camera as import("three").PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fit = 2.9 / (Math.tan(MathUtils.degToRad(camera.fov / 2)) * Math.min(aspect, 1.5));
    const distance = Math.max(fit, 6.4);
    camera.position.set(
      approach(camera.position.x, 2.2 + state.pointer.x * 0.25, 2, delta),
      approach(camera.position.y, 2.9 - state.pointer.y * 0.15, 2, delta),
      approach(camera.position.z, distance, 2, delta),
    );
    camera.lookAt(LOOK_AT);
    if (laptopScreen.current) {
      laptopScreen.current.uPower = 1;
      laptopScreen.current.uScroll = quality === "full" ? pageRead(time, 15) * 0.85 : 0;
    }
    if (phoneScreen.current) {
      phoneScreen.current.uPower = 1;
      phoneScreen.current.uScroll = quality === "full" ? pageRead(time, 11, 3) : 0;
    }
    stepWipe(laptopScreen.current, laptopWipe.current, laptopTextures, LAPTOP_TEXTURE[m] ?? 0, pageAspect(LAPTOP_SCREEN.width, LAPTOP_SCREEN.height), delta);
  });

  return <>
    <PerspectiveCamera makeDefault position={[2.2, 2.9, 10]} fov={30} onUpdate={camera => camera.lookAt(LOOK_AT)} />
    <Studio />
    <group ref={root}>
      <Laptop ref={laptop} position={LAPTOP[active].at} scale={LAPTOP[active].scale || 0.0001} screen={{ textureA: laptopTextures[first], materialRef: laptopScreen }} />
      <Phone ref={phone} scale={0.0001} position={[1.75, 1.15, 0.85]} screen={{ textureA: textures[3], materialRef: phoneScreen }} />
      <Monitor ref={appMonitor} scale={0.0001} screen={{ textureA: textures[4] }} />
      <Monitor ref={programMonitor} scale={0.0001} screen={{ textureA: textures[5], chrome: "window" }} />
      <ShopExtras groupRef={shop} textures={[textures[7], textures[8], textures[1]]} />
      <AppExtras groupRef={app} weight={weights[2]} />
      <DatabaseExtras groupRef={data} />
      <ProgramExtras groupRef={program} texture={textures[6]} weight={weights[4]} />
    </group>
  </>;
}
