"use client";
import type { SceneState } from "./three/layers";
import ScreenFrame, { type Frame } from "./ScreenFrame";

type Kind = { id: string; front: Frame; back: Frame; note: string };

/** Real screens from published realisations — one product type per scene. */
export const stageKinds: Kind[] = [
  { id: "site", note: "Strona ofertowa · strona restauracji",
    front: { kind: "browser", label: "VIP Transfery", src: "/projects/vip-transfery-platforma-premium-transport-solutions/2026-11-vip-glowna.webp" },
    back: { kind: "browser", label: "Zielona Baza — menu", src: "/projects/zielona-baza-restauracja-weganska-w-rzeszowie/2026-11-zielona-menu.webp" } },
  { id: "shop", note: "Katalog z filtrami · koszyk",
    front: { kind: "browser", label: "Łapki w Ciapki — katalog", src: "/projects/lapki-w-ciapki-sklep-zoologiczny/2026-11-lapki-katalog.webp" },
    back: { kind: "browser", label: "Sklep demo — kategorie", src: "/projects/sklep-internetowy-demo/2026-11-sklep-katalog.webp" } },
  { id: "app", note: "Panel produktów · formularz wyceny",
    front: { kind: "browser", label: "Panel administratora — produkty", src: "/projects/sklep-internetowy-demo/panel-produktow.webp" },
    back: { kind: "browser", label: "Solid Print — wycena", src: "/projects/solid-print/2026-11-solid-wycena.webp" } },
  { id: "program", note: "C# · .NET · lokalna baza SQLite",
    front: { kind: "window", label: "WARDOGS Companion — przegląd", src: "/projects/wardogs-companion/2026-11-wardogs-przeglad.webp" },
    back: { kind: "window", label: "WARDOGS Companion — analiza dni", src: "/projects/wardogs-companion/2026-11-wardogs-analiza.webp" } },
];

export default function StageVisuals({ phase, active, reduced }: { phase: number; state?: SceneState; active: boolean; compact?: boolean; reduced: boolean; ready?: boolean }) {
  return <div className="hero-stage-scenes" data-running={active && !reduced} aria-hidden="true">
    {stageKinds.map((kind, index) => <div key={kind.id} className={`hero-stage-scene scene-${kind.id}`} data-current={phase === index}>
      <div className="kind-composition">
        <ScreenFrame frame={kind.back} className="stage-frame--back" eager={index === 0} />
        <ScreenFrame frame={kind.front} className="stage-frame--front" eager={index === 0} />
        <span className="kind-note">{kind.note}</span>
      </div>
    </div>)}
  </div>;
}
