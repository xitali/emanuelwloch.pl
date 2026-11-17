"use client";
/* eslint-disable @next/next/no-img-element -- frames are captured from this page; plain images decode predictably */
import { Suspense, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import HeroScene from "@/components/world/scenes/HeroScene";
import OfferScene, { OFFER_TEXTURES } from "@/components/world/scenes/OfferScene";
import StackScene from "@/components/world/scenes/StackScene";
import { heroKinds } from "@/lib/content/hero-kinds";
import { formatPriceFrom, servicePaths } from "@/lib/content/service-paths";
import { CUT, DURATION, FPS, PATH, POSTER, easeIn, easeOut, pathAt, sceneAt, span, type SceneId } from "./timeline";

type Format = "landscape" | "vertical";
type Frame = { x: number; y: number; zoom: number };

/** Where each 3D scene sits in the frame: the desk moves aside to leave room for the type. */
const FRAMING: Record<Format, Record<Exclude<SceneId, null>, Frame>> = {
  landscape: { hero: { x: -0.3, y: -0.08, zoom: 0.64 }, offer: { x: -0.25, y: -0.06, zoom: 0.6 }, office: { x: -0.22, y: 0.02, zoom: 0.86 } },
  vertical: { hero: { x: -0.06, y: -0.12, zoom: 0.33 }, offer: { x: 0.02, y: -0.12, zoom: 0.88 }, office: { x: 0.05, y: -0.14, zoom: 0.5 } },
};
const SIZE: Record<Format, { w: number; h: number }> = { landscape: { w: 1920, h: 1080 }, vertical: { w: 1080, h: 1920 } };

const kinds = heroKinds.map(({ laptop, monitor, chrome }) => ({ laptop, monitor, chrome }));
const TEXTURES = [...new Set([...kinds.flatMap(k => [k.laptop, k.monitor]), ...OFFER_TEXTURES, "/projects/sklep-internetowy-demo/panel-produktow.webp"])];
const C = { bg: "#0c0d0e", text: "#f1eee8", muted: "#a7a8a6", steel: "#acd1e8", copper: "#e08a5b", copperHi: "#eda37b", warm: "#eba27a", paper: "#ece6da", ink: "#171b1e", inkMuted: "#545c61", deepSteel: "#2a5b78" };
const DISPLAY = "var(--font-display), var(--font-geist-sans), sans-serif";
const SERIF = "var(--font-serif), Georgia, serif";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";

declare global {
  interface Window {
    __film?: { fps: number; duration: number; poster: number; prepare: () => Promise<void>; setTime: (t: number) => Promise<void> };
    __filmAdvance?: (t: number) => void;
    __filmMounted?: SceneId;
  }
}

/* Scroll progress the scenes would get on the page; the film sets it from time. */
const heroProgress = { current: 0 };
const offerProgress = { current: 0.4 };
const officeProgress = { current: 0 };

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Applies the scene's framing to whatever camera the scene made default. */
export function Framing({ frame }: { frame: Frame }) {
  useFrame(state => {
    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    camera.setViewOffset(width, height, frame.x * width, frame.y * height, width, height);
    camera.zoom = frame.zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

export function Driver() {
  const advance = useThree(state => state.advance);
  useEffect(() => { window.__filmAdvance = (t: number) => advance(t); }, [advance]);
  return null;
}

/** Mounts only once its Suspense boundary resolved: the scene's textures are in. */
export function Mark({ id }: { id: SceneId }) {
  useEffect(() => {
    window.__filmMounted = id;
    return () => { if (window.__filmMounted === id) window.__filmMounted = null; };
  }, [id]);
  return null;
}

/** A line that rises out of a mask, and leaves upward before the cut. */
export function Line({ t, at, out, children, style, length = 0.75 }: { t: number; at: number; out?: number; children: ReactNode; style?: CSSProperties; length?: number }) {
  const enter = easeOut(span(t, at, length));
  const leave = out === undefined ? 0 : easeIn(span(t, out - 0.3, 0.3));
  return <div style={{ overflow: "hidden", paddingBottom: "0.16em", marginBottom: "-0.16em" }}>
    <div style={{ whiteSpace: "nowrap", transform: `translateY(${(1 - enter) * 108 - leave * 40}%)`, opacity: Math.min(1, enter * 1.4) * (1 - leave), ...style }}>{children}</div>
  </div>;
}

export function Arrow({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8.5 7H17v8.5" /></svg>;
}

export default function FilmClient({ format }: { format: Format }) {
  const [t, setT] = useState(0);
  const v = format === "vertical";
  const { w, h } = SIZE[format];
  const scene = sceneAt(t);

  useEffect(() => {
    window.__film = {
      fps: FPS, duration: DURATION, poster: POSTER,
      async prepare() {
        await document.fonts.ready;
        await Promise.all([...TEXTURES, "/emanuel_wloch.jpg"].map(src => { const img = new Image(); img.src = src; return img.decode().catch(() => undefined); }));
      },
      async setTime(next: number) {
        officeProgress.current = 0.12 + span(next, CUT.office, 2.2) * 0.45;
        setT(next);
        await wait(40);
        const want = sceneAt(next);
        if (!want) return;
        for (let i = 0; i < 600 && window.__filmMounted !== want; i++) await wait(25);
        window.__filmAdvance?.(next);
        await wait(8);
      },
    };
  }, []);

  const path = pathAt(t);
  const pathStart = CUT.offer + path * PATH;
  const dip = Math.max(0, ...[CUT.offer, CUT.office].map(cut => 1 - Math.abs(t - cut) / 0.16));
  const paper = easeOut(span(t, CUT.proof - 0.04, 0.5));
  const outro = easeOut(span(t, CUT.outro - 0.04, 0.5));

  const column: CSSProperties = v
    ? { position: "absolute", left: 84, right: 84, top: 190 }
    : { position: "absolute", left: 120, top: "50%", transform: "translateY(-50%)", width: 860 };
  const big = v ? 96 : 98;
  const display: CSSProperties = { fontFamily: DISPLAY, fontWeight: 450, letterSpacing: "-0.05em", lineHeight: 1.02, color: C.text };
  const italic: CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.015em", color: C.steel };

  return <div className="film-stage" style={{ position: "fixed", left: 0, top: 0, width: w, height: h, overflow: "hidden", background: C.bg, zIndex: 1000 }}>
    <style>{`nextjs-portal, [data-nextjs-toast] { display: none !important; } html, body { background: ${C.bg}; overflow: hidden; }`}</style>
    {/* Soft stage light behind the desk */}
    <div style={{ position: "absolute", inset: 0, background: v
      ? `radial-gradient(ellipse 80% 45% at 50% 68%, #acd1e814, transparent 70%), radial-gradient(ellipse 60% 30% at 30% 95%, #e08a5b10, transparent 70%)`
      : `radial-gradient(ellipse 50% 70% at 68% 55%, #acd1e814, transparent 70%), radial-gradient(ellipse 40% 50% at 10% 100%, #e08a5b0e, transparent 70%)` }} />

    <div style={{ position: "absolute", inset: 0, visibility: scene ? "visible" : "hidden" }}>
      <Canvas frameloop="never" dpr={2} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} style={{ width: w, height: h }}>
        <Driver />
        {scene && <Framing frame={FRAMING[format][scene]} />}
        <Suspense fallback={null}>
          {scene === "hero" && <><HeroScene kinds={kinds} phase={0} progress={heroProgress} quality="full" onReady={noop} /><Mark id="hero" /></>}
          {scene === "offer" && <><OfferScene active={path} progress={offerProgress} quality="full" onReady={noop} /><Mark id="offer" /></>}
          {scene === "office" && <><StackScene progress={officeProgress} quality="full" onReady={noop} /><Mark id="office" /></>}
        </Suspense>
      </Canvas>
    </div>

    {/* 1 · Hook and reveal: the site's own headline */}
    {t < CUT.offer && <div style={column}>
      <Line t={t} at={0.55} out={CUT.offer} style={{ ...display, fontSize: big }}>Strony, sklepy,</Line>
      <Line t={t} at={0.95} out={CUT.offer} style={{ ...display, fontSize: big }}>aplikacje i programy</Line>
      <Line t={t} at={CUT.reveal - 0.12} out={CUT.offer} style={{ ...italic, fontSize: big * 1.1 }}>dla Twojej firmy.</Line>
      <Line t={t} at={CUT.reveal + 0.35} out={CUT.offer} style={{ fontFamily: SANS, fontSize: v ? 30 : 26, letterSpacing: "0.14em", color: C.muted, marginTop: v ? 40 : 34 }}>PROJEKT · KOD · BAZA DANYCH · WDROŻENIE</Line>
    </div>}

    {/* 2 · Five paths, one bar each */}
    {scene === "offer" && <div style={column}>
      <Line t={t} at={CUT.offer + 0.05} out={CUT.office} style={{ fontFamily: SANS, fontSize: v ? 30 : 26, color: C.muted, fontVariantNumeric: "tabular-nums", marginBottom: v ? 26 : 22 }}>
        Zacznij od problemu. Rozwiązanie dobiorę.
      </Line>
      <div key={path}>
        <Line t={t} at={pathStart + (path === 0 ? 0.12 : 0.02)} out={path === 4 ? CUT.office : pathStart + PATH} length={0.6} style={{ ...display, fontSize: v ? 88 : 84 }}>{servicePaths[path].title}</Line>
        <Line t={t} at={pathStart + (path === 0 ? 0.28 : 0.16)} out={path === 4 ? CUT.office : pathStart + PATH} length={0.6} style={{ fontFamily: SANS, fontSize: v ? 38 : 34, color: C.warm, marginTop: v ? 22 : 18 }}>{formatPriceFrom(servicePaths[path].priceFrom)}</Line>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: v ? 56 : 48, opacity: easeOut(span(t, CUT.offer + 0.2, 0.5)) * (1 - easeIn(span(t, CUT.office - 0.3, 0.3))) }}>
        {servicePaths.map((p, i) => <span key={p.href} style={{ position: "relative", width: v ? 150 : 96, height: 3, borderRadius: 2, background: "#ffffff1f", overflow: "hidden" }}>
          <i style={{ position: "absolute", inset: 0, background: C.copper, transformOrigin: "left", transform: `scaleX(${i < path ? 1 : i > path ? 0 : easeOut(span(t, pathStart, PATH * 0.9))})` }} />
        </span>)}
      </div>
    </div>}

    {/* 3 · The back office comes apart */}
    {scene === "office" && <div style={column}>
      <Line t={t} at={CUT.office + 0.15} out={CUT.proof} style={{ ...display, fontSize: v ? 84 : 88 }}>Za stroną jest zaplecze.</Line>
      <Line t={t} at={CUT.office + 0.5} out={CUT.proof} style={{ ...italic, fontSize: (v ? 84 : 88) * 1.1 }}>Zarządzasz nim sam.</Line>
      <Line t={t} at={CUT.office + 0.85} out={CUT.proof} style={{ fontFamily: SANS, fontSize: v ? 34 : 30, color: C.muted, marginTop: v ? 36 : 30, lineHeight: 1.45, whiteSpace: "normal", maxWidth: v ? 900 : 700 }}>Panel, role, API i baza danych — projektuję je razem ze stroną.</Line>
    </div>}

    {/* Dip through black on the 3D cuts */}
    <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: dip, pointerEvents: "none" }} />

    {/* 4 · Proof, on paper */}
    {t >= CUT.proof - 0.05 && <div style={{ position: "absolute", inset: 0, background: C.paper, clipPath: `inset(${(1 - paper) * 100}% 0 0 0)` }}>
      <div style={{ position: "absolute", left: v ? 84 : 200, right: v ? 84 : 260, top: "50%", transform: "translateY(-50%)" }}>
        <Quote t={t} v={v} />
        <div style={{ marginTop: v ? 60 : 54, display: "flex", alignItems: "baseline", gap: 18, opacity: easeOut(span(t, CUT.proof + 0.9, 0.6)), transform: `translateY(${(1 - easeOut(span(t, CUT.proof + 0.9, 0.6))) * 16}px)` }}>
          <span style={{ width: 44, height: 2, background: C.deepSteel, alignSelf: "center" }} />
          <span style={{ fontFamily: SANS, fontSize: v ? 36 : 32, fontWeight: 500, color: C.ink }}>Joanna Michno</span>
          <span style={{ fontFamily: SANS, fontSize: v ? 32 : 28, color: C.inkMuted }}>Zielona Baza</span>
        </div>
      </div>
    </div>}

    {/* 5 · Outro */}
    {t >= CUT.outro - 0.05 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 60% at ${v ? "50% 30%" : "72% 40%"}, #acd1e81c, transparent 70%), radial-gradient(ellipse 45% 50% at ${v ? "50% 100%" : "18% 100%"}, #e08a5b1a, transparent 70%), ${C.bg}`, clipPath: `inset(${(1 - outro) * 100}% 0 0 0)` }}>
      <Outro t={t} v={v} />
    </div>}

    {/* Vignette */}
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, #0000005c)" }} />
  </div>;
}

function noop() {}

const QUOTE = "„Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze.”";
function Quote({ t, v }: { t: number; v: boolean }) {
  const words = QUOTE.split(" ");
  return <p style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontSize: v ? 84 : 92, lineHeight: 1.12, letterSpacing: "-0.015em", color: C.ink, textWrap: "balance" }}>
    {words.map((word, i) => {
      const e = easeOut(span(t, CUT.proof + 0.25 + i * 0.045, 0.6));
      return <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: e, transform: `translateY(${(1 - e) * 0.35}em)`, filter: `blur(${(1 - e) * 6}px)`, color: i === 0 || i === words.length - 1 ? C.deepSteel : undefined }}>{word}</span>;
    })}
  </p>;
}

function Outro({ t, v }: { t: number; v: boolean }) {
  const at = (delay: number, length = 0.6) => easeOut(span(t, CUT.outro + delay, length));
  const rise = (e: number, px = 22): CSSProperties => ({ opacity: e, transform: `translateY(${(1 - e) * px}px)` });
  const portrait = at(0.15, 0.8);
  const button = at(1.0, 0.55);
  return <div style={v
    ? { position: "absolute", left: 84, right: 84, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }
    : { position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 88 }}>
    <img src="/emanuel_wloch.jpg" alt="" width={v ? 260 : 300} height={v ? 260 : 300} style={{ flex: "none", width: v ? 260 : 300, height: v ? 260 : 300, borderRadius: "50%", objectFit: "cover", objectPosition: "center 28%", opacity: portrait, transform: `scale(${0.9 + portrait * 0.1})`, boxShadow: "0 30px 60px -24px #000c, 0 0 0 1px #ffffff1f" }} />
    <div style={{ marginTop: v ? 64 : 0 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 450, letterSpacing: "-0.045em", fontSize: v ? 92 : 96, lineHeight: 1, color: C.text, ...rise(at(0.3)) }}>Emanuel Włoch</div>
      <div style={{ fontFamily: SANS, fontSize: v ? 38 : 36, lineHeight: 1.45, color: C.muted, marginTop: v ? 30 : 26, maxWidth: v ? 860 : 820, ...rise(at(0.5)) }}>Od pierwszej rozmowy do wdrożenia pracujesz ze mną.</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: v ? "center" : "flex-start", gap: 36, marginTop: v ? 64 : 52, flexDirection: v ? "column" : "row" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 22, padding: v ? "26px 40px" : "24px 36px", borderRadius: 10, background: `linear-gradient(180deg, ${C.copperHi}, ${C.copper})`, color: "#1d0f07", fontFamily: SANS, fontWeight: 500, fontSize: v ? 38 : 34, boxShadow: "0 22px 44px -18px #e08a5b88, inset 0 1px 0 #ffffff66", opacity: button, transform: `translateY(${(1 - button) * 18}px) scale(${0.96 + button * 0.04})` }}>Omów projekt <Arrow size={v ? 36 : 32} /></span>
        <span style={{ fontFamily: SANS, fontSize: v ? 40 : 36, color: C.steel, letterSpacing: "0.01em", ...rise(at(0.75)) }}>emanuelwloch.pl</span>
      </div>
    </div>
  </div>;
}
