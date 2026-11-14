"use client";
import type { Ref } from "react";
import type { Group, Texture } from "three";
import { Laptop, Monitor } from "./Devices";
import type { ScreenMaterialType } from "./ScreenMaterial";
import type { ChromeKind } from "./chrome";

export interface DeskScreens {
  laptopA: Texture;
  laptopB?: Texture;
  monitorA: Texture;
  monitorB?: Texture;
}

/** Monitor behind on the right, laptop in front on the left: two real screens of one project. */
export default function DeskComposition({ screens, chrome = "browser", rootRef, laptopRef, lidRef, monitorRef, laptopScreenRef, monitorScreenRef }: {
  screens: DeskScreens;
  /** Browser bars for websites and web apps, Windows title bars for desktop programs. */
  chrome?: ChromeKind;
  rootRef?: Ref<Group>;
  laptopRef?: Ref<Group>;
  lidRef?: Ref<Group>;
  monitorRef?: Ref<Group>;
  laptopScreenRef?: Ref<ScreenMaterialType>;
  monitorScreenRef?: Ref<ScreenMaterialType>;
}) {
  return <group ref={rootRef}>
    <Monitor ref={monitorRef} position={[1.35, 0, -1.55]} rotation={[0, -0.28, 0]} screen={{ textureA: screens.monitorA, textureB: screens.monitorB, chrome, materialRef: monitorScreenRef }} />
    <Laptop ref={laptopRef} lidRef={lidRef} position={[-1.15, 0, 0.75]} rotation={[0, 0.42, 0]} screen={{ textureA: screens.laptopA, textureB: screens.laptopB, chrome, materialRef: laptopScreenRef }} />
  </group>;
}
