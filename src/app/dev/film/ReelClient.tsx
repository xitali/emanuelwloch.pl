"use client";
import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import OfferScene, { OFFER_TEXTURES } from "@/components/world/scenes/OfferScene";
import { formatPriceFrom, servicePaths } from "@/lib/service-paths";
import { Arrow, Driver, Framing, Line, Mark, wait } from "./FilmClient";
import { easeOut, REELS, span, type ReelId } from "./timeline";

/* One reel per service path: the client's problem, the answer with its price, a call to action. */

const FPS = 30;
const DURATION = 12.5;
/* On the 120 BPM grid of the track (started at its first strong beat): beats at 0, 0.5, 1 … */
const T = { title: 4.0, cta: 9.0 };
const POSTER = 2.6;
const W = 1080, H = 1920;
const C = { bg: "#0c0d0e", text: "#f1eee8", muted: "#a7a8a6", steel: "#acd1e8", copper: "#e08a5b", copperHi: "#eda37b", warm: "#eba27a" };
const DISPLAY = "var(--font-display), var(--font-geist-sans), sans-serif";
const SERIF = "var(--font-serif), Georgia, serif";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";
const progress = { current: 0.4 };
const WARMUP = 5;
const clock = { warmed: false, time: WARMUP };

export default function ReelClient({ reel }: { reel: ReelId }) {
  const index = REELS[reel];
  const path = servicePaths[index];
  const [t, setT] = useState(0);

  useEffect(() => {
    window.__film = {
      fps: FPS, duration: DURATION, poster: POSTER,
      async prepare() {
        await document.fonts.ready;
        await Promise.all([...OFFER_TEXTURES].map(src => { const img = new Image(); img.src = src; return img.decode().catch(() => undefined); }));
      },
      async setTime(next: number) {
        setT(next);
        await wait(40);
        for (let i = 0; i < 600 && window.__filmMounted !== "offer"; i++) await wait(25);
        // Warm-up: let the camera and devices settle for 5 simulated seconds before frame 0,
        // so every reel opens on a framed desk instead of mid-dolly.
        if (!clock.warmed) {
          for (let k = 1; k <= WARMUP * FPS; k++) window.__filmAdvance?.(k / FPS);
          clock.warmed = true;
        }
        // The 3D clock only moves forward, one frame per capture (the cover frame is captured
        // first, out of order, and must not run the scene backwards).
        clock.time += 1 / FPS;
        window.__filmAdvance?.(clock.time);
        await wait(8);
      },
    };
  }, []);

  const display: CSSProperties = { fontFamily: DISPLAY, fontWeight: 450, letterSpacing: "-0.045em", lineHeight: 1.05, color: C.text, whiteSpace: "normal" };
  const italic: CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.015em", color: C.steel };
  const fadeIn = easeOut(span(t, 0, 0.35));
  const dim = easeOut(span(t, T.cta - 0.1, 0.6));
  const cta = (delay: number) => easeOut(span(t, T.cta + delay, 0.6));
  const rise = (e: number): CSSProperties => ({ opacity: e, transform: `translateY(${(1 - e) * 26}px)` });

  return <div style={{ position: "fixed", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: C.bg, zIndex: 1000 }}>
    <style>{`nextjs-portal, [data-nextjs-toast] { display: none !important; } html, body { background: ${C.bg}; overflow: hidden; }`}</style>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 40% at 50% 66%, #acd1e81a, transparent 70%), radial-gradient(ellipse 60% 30% at 25% 100%, #e08a5b14, transparent 70%)" }} />
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas frameloop="never" dpr={1} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} style={{ width: W, height: H }}>
        <Driver />
        <Framing frame={{ x: -0.04, y: -0.13, zoom: 0.9 }} />
        <Suspense fallback={null}>
          <OfferScene active={index} progress={progress} quality="full" onReady={noop} />
          <Mark id="offer" />
        </Suspense>
      </Canvas>
    </div>

    {/* 1 · The client's problem, in the site's own words */}
    {t < T.title && <div style={{ position: "absolute", left: 84, right: 84, top: 250 }}>
      <Line t={t} at={0.2} out={T.title} length={0.8} style={{ ...display, fontSize: 84 }}>{path.problem}</Line>
    </div>}

    {/* 2 · The answer: service, price, scope */}
    {t >= T.title - 0.05 && t < T.cta && <div style={{ position: "absolute", left: 84, right: 84, top: 250 }}>
      <Line t={t} at={T.title} out={T.cta} length={0.6} style={{ ...italic, fontSize: 116, lineHeight: 1.05 }}>{path.title}</Line>
      <Line t={t} at={T.title + 0.25} out={T.cta} length={0.6} style={{ marginTop: 28 }}>
        <span style={{ display: "inline-flex", padding: "12px 24px", borderRadius: 999, border: `1px solid ${C.warm}66`, fontFamily: SANS, fontSize: 36, fontWeight: 500, color: C.warm }}>{formatPriceFrom(path.priceFrom)}</span>
      </Line>
      <Line t={t} at={T.title + 0.5} out={T.cta} length={0.6} style={{ fontFamily: SANS, fontSize: 38, lineHeight: 1.45, color: C.muted, whiteSpace: "normal", marginTop: 34 }}>{path.scope}</Line>
    </div>}

    {/* 3 · Call to action over the dimmed desk */}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg}f5 55%, ${C.bg}aa 100%)`, opacity: dim }} />
    {t >= T.cta - 0.05 && <div style={{ position: "absolute", left: 84, right: 84, top: 330, display: "flex", flexDirection: "column", gap: 34 }}>
      <div style={{ ...display, fontSize: 96, ...rise(cta(0)) }}>Opisz, co chcesz usprawnić.</div>
      <div style={{ ...italic, fontSize: 80, ...rise(cta(0.2)) }}>Wycena jest bezpłatna.</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 30, marginTop: 40 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 22, padding: "28px 42px", borderRadius: 12, background: `linear-gradient(180deg, ${C.copperHi}, ${C.copper})`, color: "#1d0f07", fontFamily: SANS, fontWeight: 600, fontSize: 42, boxShadow: "0 24px 48px -20px #e08a5b99", ...rise(cta(0.45)) }}>Omów projekt <Arrow size={40} /></span>
        <span style={{ fontFamily: SANS, fontSize: 46, color: C.steel, ...rise(cta(0.6)) }}>emanuelwloch.pl</span>
        <span style={{ fontFamily: SANS, fontSize: 32, color: C.muted, ...rise(cta(0.75)) }}>Emanuel Włoch · Jarosław i cała Polska</span>
      </div>
    </div>}

    {/* Wordmark, always on */}
    <div style={{ position: "absolute", left: 84, top: 120, display: "flex", alignItems: "baseline", gap: 14, fontFamily: SANS, color: C.text, opacity: fadeIn }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 44, letterSpacing: "-0.05em" }}>ew</span>
      <span style={{ fontSize: 26, color: C.muted }}>/ Emanuel Włoch</span>
    </div>
    <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: 1 - fadeIn, pointerEvents: "none" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 62%, #00000055)" }} />
  </div>;
}

function noop() {}
