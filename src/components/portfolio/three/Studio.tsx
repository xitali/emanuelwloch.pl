"use client";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
/* Warm key and top light on the aluminium, steel-blue rim: the same pairing as the page palette. */
const light = { key: "#ffe9d6", top: "#fff3e8", rim: "#a9c8dc", fill: "#f3e2d2" };

/**
 * Procedural studio: soft box reflections for the aluminium and glass, a cool rim in the
 * site accent, and a contact shadow on an invisible floor. No HDR download.
 */
export default function Studio({ shadowY = 0, shadowScale = 14, frames = 1 }: { shadowY?: number; shadowScale?: number; frames?: number }) {
  return <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[4, 7, 6]} intensity={2.2} color={light.key} />
    <directionalLight position={[-6, 3, -4]} intensity={1.1} color={light.rim} />
    <Environment resolution={256} frames={frames} background={false}>
      <color attach="background" args={["#1a2026"]} />
      <Lightformer form="rect" intensity={5} color={light.top} position={[0, 7, 1]} rotation-x={Math.PI / 2} scale={[12, 5, 1]} />
      <Lightformer form="rect" intensity={3.2} color={light.fill} position={[-8, 2.5, 3]} rotation-y={Math.PI / 2} scale={[7, 4, 1]} />
      <Lightformer form="rect" intensity={2.4} color={light.rim} position={[8, 2, -2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[3, 3, 9]} scale={[8, 2, 1]} />
      <Lightformer form="ring" intensity={2} color="#ffffff" position={[-3, 4, 7]} scale={2.5} />
    </Environment>
    <ContactShadows position={[0, shadowY, 0]} scale={shadowScale} blur={2.2} far={5} opacity={0.75} resolution={1024} frames={frames} color="#000000" />
  </>;
}
