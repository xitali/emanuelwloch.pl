"use client";
import Image from "next/image";
import type { RefObject } from "react";
import WorldView, { lazyScene } from "@/components/world/WorldView";
import { servicePaths } from "@/lib/service-paths";

const OfferScene = lazyScene<{ active: number }>(() => import("@/components/world/scenes/OfferScene"));

/** Rendered desk shots of each service, shown without 3D and while the scene loads. */
const stills = servicePaths.map(path => `/mockups/usluga-${path.href.slice(1)}.webp`);

function Stills({ active }: { active: number }) {
  return <>{stills.map((src, index) => <div key={src} className="offer-stage-still" data-current={active === index}>
    <Image src={src} alt="" fill sizes="(max-width: 1179px) 0px, 44vw" loading="lazy" />
  </div>)}</>;
}

/** Sticky 3D stage beside the service list; follows the row being read. */
export default function OfferStage({ active, track }: { active: number; track: RefObject<HTMLElement | null> }) {
  const path = servicePaths[active];
  return <div className="offer-stage" aria-hidden="true">
    <WorldView className="offer-world" scene={OfferScene} sceneProps={{ active }} track={track} fallback={<Stills active={active} />} />
    <div className="offer-stage-caption"><span>0{active + 1} / 0{servicePaths.length}</span><strong>{path.title}</strong><small>{path.imageLabel}</small></div>
  </div>;
}
