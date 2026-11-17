"use client";
import { forwardRef, useMemo } from "react";
import { RoundedBox, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { Color, type Group, type Mesh, type MeshStandardMaterial, type Object3D, type Texture } from "three";
import { coverFit, ScreenMaterial, ScreenMaterialImpl, type ScreenMaterialType } from "./ScreenMaterial";
import { CHROME_HEIGHT, chromeTexture, type ChromeKind } from "./chrome";

/*
 * The laptop and the monitor are real models (Sketchfab, CC BY 4.0, credited on /polityka-prywatnosci#licencje):
 * "Apple MacBook Pro 2020" by CGDELUXE and "PC Monitor 27 inch" by Annelida, optimised to WebP + meshopt.
 * The lit panels are our own Screen meshes laid exactly over the models' displays.
 */
const LAPTOP_URL = "/models/laptop.glb";
const MONITOR_URL = "/models/monitor.glb";

/* Model-space measurements (metres) read from the files. */
const LAPTOP_MODEL = { screenWidth: 0.3432, screenHeight: 0.2135, screenY: 0.00545, screenZ: -0.1191, hingeY: -0.1147, hingeZ: -0.1157, bottom: -0.1242 };
const MONITOR_MODEL = { screenWidth: 0.7084, screenHeight: 0.3985, bottom: -0.3107 };
const LAPTOP_SCALE = 3.04 / LAPTOP_MODEL.screenWidth;
const MONITOR_SCALE = 4.16 / MONITOR_MODEL.screenWidth;

/* Shared dimensions (scene units ≈ decimetres): the laptop panel is 16:10, the monitor 16:9. */
export const LAPTOP_SCREEN = { width: 3.04, height: +(LAPTOP_MODEL.screenHeight * LAPTOP_SCALE).toFixed(3) };
export const MONITOR_SCREEN = { width: 4.16, height: 2.34 };
/** Portrait phone panel, the shape of a 390 × 844 mobile screenshot. */
export const PHONE_SCREEN = { width: 0.74, height: 1.6 };

const BEZEL = { color: "#050607", metalness: 0.2, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 };

/** Copies of a model's meshes with their baked world transforms, so they can be regrouped (e.g. lid vs base). */
function useMeshes(url: string, adjust?: (mesh: Mesh, material: MeshStandardMaterial) => void) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    scene.updateMatrixWorld(true);
    const meshes: Mesh[] = [];
    scene.traverse((object: Object3D) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const copy = mesh.clone();
      copy.matrixAutoUpdate = false;
      copy.matrix.copy(mesh.matrixWorld);
      copy.castShadow = true;
      copy.receiveShadow = true;
      const material = (mesh.material as MeshStandardMaterial).clone();
      copy.material = material;
      adjust?.(copy, material);
      meshes.push(copy);
    });
    return meshes;
  }, [scene, adjust]);
}

export interface ScreenProps {
  width: number;
  height: number;
  textureA: Texture;
  textureB?: Texture;
  /** Browser toolbar or Windows title bar above the page. */
  chrome?: ChromeKind;
  materialRef?: React.Ref<ScreenMaterialType>;
}

/** Aspect of the page area under the chrome; screenshots are fitted into it. */
export const pageAspect = (width: number, height: number, chrome: ChromeKind = "browser") => width / (height * (1 - CHROME_HEIGHT[chrome]));

/** The lit panel (chrome bar + page) plus a thin glossy cover that picks up studio reflections. */
export function Screen({ width, height, textureA, textureB, chrome = "browser", materialRef }: ScreenProps) {
  const bar = height * CHROME_HEIGHT[chrome];
  const page = height - bar;
  const aspect = pageAspect(width, height, chrome);
  const fitA = useMemo(() => coverFit(textureA, aspect), [textureA, aspect]);
  const fitB = useMemo(() => coverFit(textureB ?? textureA, aspect), [textureA, textureB, aspect]);
  const chromeMap = useMemo(() => chrome === "none" ? null : chromeTexture(chrome), [chrome]);
  return <group>
    {chromeMap && <mesh position={[0, height / 2 - bar / 2, 0]}>
      <planeGeometry args={[width, bar]} />
      <meshBasicMaterial map={chromeMap} toneMapped={false} />
    </mesh>}
    <mesh position={[0, -bar / 2, 0]}>
      <planeGeometry args={[width, page]} />
      <ScreenMaterial ref={materialRef} key={ScreenMaterialImpl.key} uMapA={textureA} uMapB={textureB ?? textureA} uRepeatA={fitA.repeat} uOffsetA={fitA.offset} uRepeatB={fitB.repeat} uOffsetB={fitB.offset} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0, 0.004]}>
      <planeGeometry args={[width, height]} />
      <meshPhysicalMaterial color="#000000" metalness={0} roughness={0.06} clearcoat={1} clearcoatRoughness={0.04} transparent opacity={0.16} depthWrite={false} />
    </mesh>
  </group>;
}

type GroupProps = ThreeElements["group"];

/** Lid angles about the hinge: shut on the keyboard, and open at about 105°. */
export const LID_CLOSED = Math.PI / 2 - 0.004;
export const LID_OPEN = -0.26;

/** Space-grey aluminium, a subtle keyboard backlight and no brand marks (the lid logo becomes plain metal). */
function adjustLaptop(mesh: Mesh, material: MeshStandardMaterial) {
  // The lid logo is its own patch of the shell: give it the same plain aluminium.
  if (material.name === "aluminium" || material.name === "apple_logo__aluminium") {
    material.map = null;
    material.color = new Color("#8e9296");
    material.metalness = 0.92;
    material.roughness = 0.34;
    material.envMapIntensity = 1.3;
  }
  // Matte black keys; the source's backlight texture washes them out to white under studio light.
  if (material.name.includes("keyboard") || material.name === "touchpad") {
    material.emissiveIntensity = 0;
    material.map = null;
    material.color = new Color(material.name === "touchpad" ? "#0c0d0f" : "#16171a");
    material.roughness = 0.55;
  }
}

/** Graphite plastic and metal for the monitor (the source albedo is a light grey). */
function adjustMonitor(_mesh: Mesh, material: MeshStandardMaterial) {
  material.color = new Color("#3a3d41");
  material.envMapIntensity = 1.1;
}

/** Space-grey unibody laptop; the lid group pivots on the real hinge axis. */
export const Laptop = forwardRef<Group, GroupProps & { lidRef?: React.Ref<Group>; screen: Omit<ScreenProps, "width" | "height"> }>(function Laptop({ lidRef, screen, ...props }, ref) {
  const meshes = useMeshes(LAPTOP_URL, adjustLaptop);
  const lid = meshes.filter(mesh => mesh.name.startsWith("Rectangle004"));
  const base = meshes.filter(mesh => !mesh.name.startsWith("Rectangle004"));
  const m = LAPTOP_MODEL;
  return <group ref={ref} {...props}>
    <group scale={LAPTOP_SCALE} position={[0, -m.bottom * LAPTOP_SCALE, 0]}>
      {base.map(mesh => <primitive key={mesh.uuid} object={mesh} />)}
      {/* Lid: rotation.x = LID_CLOSED shuts it on the keyboard, LID_OPEN opens it */}
      <group ref={lidRef} position={[0, m.hingeY, m.hingeZ]} rotation={[LID_OPEN, 0, 0]}>
        <group position={[0, -m.hingeY, -m.hingeZ]}>
          {lid.map(mesh => <primitive key={mesh.uuid} object={mesh} />)}
          <group position={[0, m.screenY, m.screenZ + 0.0002]} scale={1 / LAPTOP_SCALE}>
            <Screen width={LAPTOP_SCREEN.width} height={LAPTOP_SCREEN.height} {...screen} />
          </group>
        </group>
      </group>
    </group>
  </group>;
});

/** 27-inch monitor with a thin bezel on its stand. */
export const Monitor = forwardRef<Group, GroupProps & { screen: Omit<ScreenProps, "width" | "height"> }>(function Monitor({ screen, ...props }, ref) {
  const meshes = useMeshes(MONITOR_URL, adjustMonitor);
  return <group ref={ref} {...props}>
    <group scale={MONITOR_SCALE} position={[0, -MONITOR_MODEL.bottom * MONITOR_SCALE, -0.12]}>
      {meshes.map(mesh => <primitive key={mesh.uuid} object={mesh} />)}
      <group position={[0, 0, 0.0003]} scale={1 / MONITOR_SCALE}>
        <Screen width={MONITOR_SCREEN.width} height={MONITOR_SCREEN.height} {...screen} />
      </group>
    </group>
  </group>;
});

useGLTF.preload(LAPTOP_URL);
useGLTF.preload(MONITOR_URL);

const TITANIUM = { color: "#8f979d", metalness: 0.9, roughness: 0.3, envMapIntensity: 1.4 };

/** Modern phone: titanium frame, black glass front, a pill-shaped camera cut-out. */
export const Phone = forwardRef<Group, GroupProps & { screen: Omit<ScreenProps, "width" | "height" | "chrome"> }>(function Phone({ screen, ...props }, ref) {
  const { width, height } = PHONE_SCREEN;
  return <group ref={ref} {...props}>
    <RoundedBox args={[width + 0.08, height + 0.08, 0.075]} radius={0.034} smoothness={6} position={[0, 0, -0.0375]} castShadow>
      <meshStandardMaterial {...TITANIUM} />
    </RoundedBox>
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[width + 0.05, height + 0.05]} />
      <meshStandardMaterial {...BEZEL} />
    </mesh>
    <group position={[0, 0, 0.004]}>
      <Screen width={width} height={height} chrome="none" {...screen} />
    </group>
    <RoundedBox args={[0.2, 0.055, 0.004]} radius={0.0275} smoothness={4} position={[0, height / 2 - 0.06, 0.008]}>
      <meshStandardMaterial color="#000000" roughness={0.3} />
    </RoundedBox>
  </group>;
});
