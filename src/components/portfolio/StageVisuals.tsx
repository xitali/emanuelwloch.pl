"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import type { SceneState } from "./three/layers";
import StaticProduct from "./three/StaticProduct";

const Devices = dynamic(() => import("./three/ExplodedScene"), { ssr: false, loading: () => <StaticProduct /> });
const Check = () => <svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function GoalSketch() {
  return <div className="goal-composition">
    <div className="goal-underlay"/>
    <div className="goal-paper">
      <svg viewBox="0 0 700 540" fill="none">
        <defs><pattern id="goal-paper-grid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0V27" stroke="#9aabba" strokeWidth=".6" opacity=".3"/></pattern></defs>
        <rect width="700" height="540" fill="url(#goal-paper-grid)"/>
        <path d="M68 0v540" stroke="#be6a6a" opacity=".22"/>
        <g fill="#26323a" className="sketch-handwriting">
          <text x="98" y="88" fontSize="54">Twój CEL</text>
          <text x="100" y="147" fontSize="26">W czym strona ma Ci pomóc?</text>
          <text x="117" y="228" fontSize="30">Co oferujesz?</text>
          <text x="117" y="311" fontSize="30">Do kogo chcesz dotrzeć?</text>
          <text x="117" y="394" fontSize="30">Jak klient ma się odezwać?</text>
          <text x="110" y="480" fontSize="22" fill="#5f6e79">Najpierw pomysł. Potem rozwiązanie.</text>
        </g>
        <g stroke="#375c74" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" className="sketch-ink">
          <path pathLength="1" d="M98 101q120 8 257-4"/>
          <path pathLength="1" d="m88 216 6 6 12-17m-18 94 6 6 12-17m-18 94 6 6 12-17"/>
          <path pathLength="1" d="M118 244q102 4 216-1m-216 83q170-2 329 2m-329 82q174-3 360 1"/>
          <path pathLength="1" d="M461 124q64-48 116 9m-21-24 22 25-33-3"/>
          <path pathLength="1" d="m537 176 58-8-6 45-58 4zM540 186l39-4m-39 15 24-2"/>
        </g>
        <circle cx="600" cy="436" r="38" stroke="#375c74" strokeWidth="2.5" strokeDasharray="3 4"/>
        <path d="m583 435 12 12 23-26" stroke="#375c74" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="goal-sticky"><span>TWÓJ PLAN</span><strong>Masz pomysł?<br />{" "}Porozmawiajmy.</strong></div>
    <svg className="goal-pencil" viewBox="0 0 30 290" fill="none"><path d="M5 25h20v225L15 281 5 250z" fill="#a8c9dc"/><path d="M5 25h7v224H5z" fill="#d6e5eb"/><path d="M12 25h6v224h-6z" fill="#65869a"/><path d="m5 249 10 32 10-32" fill="#dbc4a6"/><path d="m12 273 3 8 3-8" fill="#26323a"/><rect x="5" y="6" width="20" height="20" rx="4" fill="#405462"/></svg>
  </div>;
}
function DesignWorkshop() {
  return <div className="design-composition">
    <div className="design-board"><span className="scene-eyebrow">WSPÓLNY POMYSŁ</span><strong>Rozrysujmy Twoją stronę.</strong>
      <svg className="design-wireframe" viewBox="0 0 600 210" fill="none"><g stroke="#98b6c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="design-drawing">
        <path pathLength="1" d="M28 26h210v154H28zM28 54h210M44 40h31m90 0h57M44 76h106m-106 14h78M44 111h63v22H44zM171 75h51v58h-51zM44 151h178"/>
        <path pathLength="1" d="M277 48h126v132H277zM289 65h101m-101 21h65m-65 17h81m-81 20h101m-101 20h101m-101 20h65"/>
        <path pathLength="1" d="m441 86 26-16 28 17-26 15zm0 26 26-16 28 17-26 15zM452 145h75m-75 16h52"/>
      </g><path d="m246 102 22-1m-8-8 9 8-9 8m151-8h21m-7-8 9 8-9 8" stroke="#acd1e8" strokeWidth="2" strokeLinecap="round"/></svg>
      <i className="idea-note note-offer">Oferta</i><i className="idea-note note-contact">Kontakt</i>
    </div>
    <div className="creative-person person-woman"/><div className="creative-person person-emanuel"/><div className="creative-person person-man"/>
    <div className="design-desk"><svg viewBox="0 0 600 80" fill="none"><path className="desk-sketch" pathLength="1" d="m167 21 120-5 15 47-131 3zm12 10 94-4m-91 15 41-2m-37 16 89-2m48-33 110 4-10 37-101-3zm12 10 82 3m-85 11 48 2" stroke="#7f9daf" strokeWidth="1.8" strokeLinecap="round"/></svg></div>
    <span className="designer-signature">Emanuel / Twój projektant</span>
  </div>;
}
function Publication() {
  return <div className="launch-composition">
    <div className="launch-domain"><div className="launch-address"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5"/></svg><span>twoja-firma.pl</span><i/></div><div className="launch-success"><span><Check/></span><p>PUBLIKACJA I PRZEKAZANIE</p><strong>Twoja strona.<br />{" "}<em>Już online.</em></strong><small>Pod Twoją domeną. Dostępna dla klientów.</small></div>
      <div className="launch-pipeline"><span>&lt;/&gt;</span><i><b/></i><svg viewBox="0 0 32 32" fill="none"><path d="M9 25h16a6 6 0 0 0 .5-12 10 10 0 0 0-19-1A6.5 6.5 0 0 0 9 25Z" stroke="currentColor" strokeWidth="1.4"/></svg><i><b/></i><svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4"/><ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.2"/><path d="M4 16h24m-22-6h20M6 22h20" stroke="currentColor" strokeWidth="1.2"/></svg></div>
    </div>
    <div className="launch-checklist">{['Twoja domena i HTTPS','Sprawdzony kontakt','Dostęp i instrukcja obsługi'].map((label,i)=><div key={label} style={{'--check-order':i} as CSSProperties}><span><Check/></span>{label}</div>)}</div>
  </div>;
}
export default function StageVisuals({ phase, state, active, compact, reduced, ready }: {phase:number;state:SceneState;active:boolean;compact:boolean;reduced:boolean;ready:boolean}) {
  const building = phase === 2;
  const [hasShownDevices, setHasShownDevices] = useState(false);
  // Keep the same canvas through the exit fade. Hidden scenes stop rendering.
  if (building && ready && !reduced && !hasShownDevices) setHasShownDevices(true);

  useEffect(() => {
    if (!ready) return;
    const atlas = new window.Image(); atlas.decoding = "async"; atlas.src = "/hero/design-team.webp";
  }, [ready]);
  return <div className="hero-stage-scenes" data-running={active && !reduced} aria-hidden="true">
    <div className="hero-stage-scene scene-goal" data-current={phase===0}><GoalSketch/></div>
    <div className="hero-stage-scene scene-design" data-current={phase===1}><DesignWorkshop/></div>
    <div className="hero-stage-scene scene-build" data-current={building}>
      <div className="build-scene-label"><span>JEDEN PROJEKT. KAŻDY EKRAN.</span><strong>Sprawdź, jak działa.</strong></div>
      {hasShownDevices && !reduced ? <Devices state={state} active={active && building} compact={compact} reduced={reduced}/> : <StaticProduct/>}
      <div className="device-platforms"><span>Komputer</span><span>Tablet</span><span>Telefon</span></div>
    </div>
    <div className="hero-stage-scene scene-launch" data-current={phase===3}><Publication/></div>
  </div>;
}
