/* eslint-disable @next/next/no-img-element -- captured as a still; plain images keep exact pixel control */
import type { CSSProperties, ReactNode } from "react";
import { formatPriceFrom, servicePaths } from "@/lib/content/service-paths";
import type { Graphic } from "./content";

export const SIZES = {
  feed: { w: 1080, h: 1350 },  // Facebook/Instagram feed, 4:5
  story: { w: 1080, h: 1920 }, // Stories, Reels cover, 9:16
  gbp: { w: 1200, h: 900 },    // Google Business Profile post, 4:3
  og: { w: 1200, h: 630 },     // link preview
} as const;
export type SizeId = keyof typeof SIZES;

const C = { bg: "#0c0d0e", text: "#f1eee8", muted: "#a7a8a6", steel: "#acd1e8", copper: "#e08a5b", copperHi: "#eda37b", copperInk: "#1d0f07", warm: "#eba27a", paper: "#ece6da", card: "#f7f3ec", ink: "#171b1e", inkMuted: "#545c61", deepSteel: "#2a5b78" };
const DISPLAY = "var(--font-display), var(--font-geist-sans), sans-serif";
const SERIF = "var(--font-serif), Georgia, serif";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";

const slugOf = (href: string) => href.replace(/^\//, "");

function Wordmark({ dark = true, scale }: { dark?: boolean; scale: number }) {
  return <div style={{ display: "flex", alignItems: "baseline", gap: 14 * scale, fontFamily: SANS, color: dark ? C.text : C.ink }}>
    <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 40 * scale, letterSpacing: "-0.05em" }}>ew</span>
    <span style={{ fontSize: 22 * scale, color: dark ? C.muted : C.inkMuted }}>/ Emanuel Włoch</span>
  </div>;
}

function Cta({ scale, label = "Omów projekt" }: { scale: number; label?: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 14 * scale, padding: `${18 * scale}px ${28 * scale}px`, borderRadius: 10 * scale, background: `linear-gradient(180deg, ${C.copperHi}, ${C.copper})`, color: C.copperInk, fontFamily: SANS, fontWeight: 600, fontSize: 26 * scale, boxShadow: `0 ${18 * scale}px ${36 * scale}px -${16 * scale}px #e08a5b88` }}>
    {label}
    <svg width={24 * scale} height={24 * scale} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8.5 7H17v8.5" /></svg>
  </span>;
}

function Footer({ scale, dark = true, cta = true }: { scale: number; dark?: boolean; cta?: boolean }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 * scale }}>
    <span style={{ fontFamily: SANS, fontSize: 28 * scale, color: dark ? C.steel : C.deepSteel, letterSpacing: "0.01em" }}>emanuelwloch.pl</span>
    {cta && <Cta scale={scale} />}
  </div>;
}

/** Dark stage with a steel glow behind the devices and a faint copper one at the base. */
function Stage({ children, w, h, portrait }: { children: ReactNode; w: number; h: number; portrait: boolean }) {
  return <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: `radial-gradient(ellipse 70% 45% at ${portrait ? "50% 68%" : "72% 55%"}, #acd1e81f, transparent 70%), radial-gradient(ellipse 55% 35% at ${portrait ? "20% 100%" : "8% 100%"}, #e08a5b1c, transparent 70%), ${C.bg}` }}>
    {children}
  </div>;
}

function Paper({ children, w, h }: { children: ReactNode; w: number; h: number }) {
  return <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: `radial-gradient(ellipse 70% 60% at 85% 0%, #ffffff80, transparent 70%), ${C.paper}` }}>{children}</div>;
}

const display = (size: number): CSSProperties => ({ fontFamily: DISPLAY, fontWeight: 450, letterSpacing: "-0.045em", lineHeight: 1.04, color: C.text, margin: 0, fontSize: size, textWrap: "balance" });
const italic = (size: number, color = C.steel): CSSProperties => ({ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.05, color, margin: 0, fontSize: size });
const body = (size: number, color = C.muted): CSSProperties => ({ fontFamily: SANS, fontSize: size, lineHeight: 1.45, color, margin: 0, textWrap: "pretty" });

/** Layout shared by every dark composition: text block, a device image, footer. */
function DeviceLayout({ size, text, image, imageNote }: { size: SizeId; text: ReactNode; image?: string; imageNote?: ReactNode }) {
  const { w, h } = SIZES[size];
  const portrait = h > w;
  const s = size === "og" ? 0.62 : size === "gbp" ? 0.8 : 1;
  const pad = portrait ? 84 : 64 * (size === "og" ? 0.9 : 1);
  const story = size === "story";
  return <Stage w={w} h={h} portrait={portrait}>
    <div style={{ position: "absolute", inset: pad, top: story ? 220 : pad, bottom: story ? 230 : pad, display: "flex", flexDirection: "column", gap: 24 * s }}>
      <Wordmark scale={s} />
      {portrait ? <>
        <div style={{ marginTop: story ? 70 : 44, display: "flex", flexDirection: "column", gap: 22 }}>{text}</div>
        <div style={{ position: "relative", flex: 1, margin: `0 -${pad - 10}px` }}>
          {image && <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", filter: "drop-shadow(0 40px 50px #000c)" }} />}
          {imageNote}
        </div>
        <Footer scale={s} />
      </> : <>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 20 * s, minHeight: 0 }}>
          <div style={{ width: "48%", display: "flex", flexDirection: "column", gap: 18 * s }}>{text}</div>
          <div style={{ position: "relative", alignSelf: "stretch", flex: 1, marginRight: -pad + 6 }}>
            {image && <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 30px 40px #000c)" }} />}
            {imageNote}
          </div>
        </div>
        <Footer scale={s} />
      </>}
    </div>
  </Stage>;
}

function Chip({ children, scale, tone = "steel" }: { children: ReactNode; scale: number; tone?: "steel" | "copper" | "muted" }) {
  const color = tone === "copper" ? C.warm : tone === "muted" ? C.muted : C.steel;
  const big = tone === "copper";
  return <span style={{ display: "inline-flex", alignItems: "center", padding: `${(big ? 12 : 8) * scale}px ${(big ? 22 : 16) * scale}px`, border: `1px solid ${color}66`, borderRadius: 999, fontFamily: SANS, fontSize: (big ? 30 : 22) * scale, fontWeight: big ? 500 : 400, color, whiteSpace: "nowrap" }}>{children}</span>;
}

export default function SocialGraphic({ graphic, size }: { graphic: Graphic; size: SizeId }) {
  const { w, h } = SIZES[size];
  const portrait = h > w;
  const s = size === "og" ? 0.62 : size === "gbp" ? 0.8 : 1;
  const head = (portrait ? 84 : 72) * s;

  if (graphic.kind === "hero") {
    return <DeviceLayout size={size} image="/mockups/hero-site.webp" text={<>
      <h1 style={display(head)}>Strony, sklepy, aplikacje i programy</h1>
      <p style={italic(head * 1.05)}>dla Twojej firmy.</p>
      <p style={{ ...body(24 * s), letterSpacing: "0.12em", marginTop: 10 * s }}>PROJEKT · KOD · BAZA DANYCH · WDROŻENIE</p>
    </>} />;
  }

  if (graphic.kind === "service") {
    const path = servicePaths[graphic.path];
    return <DeviceLayout size={size} image={`/mockups/usluga-${slugOf(path.href)}.webp`} text={<>
      <h1 style={display(head * 0.86)}>{path.problem}</h1>
      <p style={italic(head * 0.82)}>{path.title}</p>
      <div style={{ display: "flex", gap: 12 * s, flexWrap: "wrap", marginTop: 6 * s }}><Chip scale={s} tone="copper">{formatPriceFrom(path.priceFrom)}</Chip></div>
    </>} />;
  }

  if (graphic.kind === "case") {
    return <DeviceLayout size={size} image={graphic.mockup} text={<>
      <div style={{ display: "flex", gap: 12 * s, flexWrap: "wrap" }}>
        <Chip scale={s}>{graphic.slug ? `Realizacja · ${graphic.type}` : graphic.type}</Chip>
        {graphic.status && <Chip scale={s} tone="muted">{graphic.status}</Chip>}
      </div>
      <h1 style={display(head)}>{graphic.title}</h1>
      <p style={body(30 * s, C.muted)}>{graphic.line}</p>
    </>} />;
  }

  if (graphic.kind === "backoffice") {
    // Exploded layers in CSS: the real panel on top, roles, API and database below.
    const layers = 4;
    const stack = <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", perspective: 1600 * s }}>
      <div style={{ position: "relative", width: 600 * s, height: 338 * s, transform: `translateY(${70 * s}px) rotateX(54deg) rotateZ(-30deg)`, transformStyle: "preserve-3d" }}>
        {Array.from({ length: layers }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${(layers - 1 - i) * 86 * s}px)`, borderRadius: 16 * s, border: `1px solid ${i === 0 ? "#ffffff30" : "#acd1e84d"}`, background: i === 0 ? `url(/projects/sklep-internetowy-demo/panel-produktow.webp) top center / cover, #11161a` : i === layers - 1 ? "#10151a" : "#151b20e6", boxShadow: `0 ${30 * s}px ${50 * s}px -${20 * s}px #000c, inset 0 0 0 1px #acd1e81a` }} />)}
      </div>
    </div>;
    return <DeviceLayout size={size} imageNote={stack} text={<>
      <h1 style={display(head)}>Za stroną jest zaplecze.</h1>
      <p style={italic(head)}>Zarządzasz nim sam.</p>
      <div style={{ display: "flex", gap: 10 * s, flexWrap: "wrap", marginTop: 8 * s }}>{["Panel administratora", "Role i logowanie", "API i integracje", "Baza danych"].map(label => <Chip key={label} scale={s}>{label}</Chip>)}</div>
    </>} />;
  }

  if (graphic.kind === "quote") {
    const q = (portrait ? 84 : 66) * s;
    return <Paper w={w} h={h}>
      <div style={{ position: "absolute", inset: portrait ? 84 : 72 * s, top: size === "story" ? 220 : undefined, bottom: size === "story" ? 230 : undefined, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Wordmark dark={false} scale={s} />
        <div>
          <p style={{ ...italic(q, C.ink), lineHeight: 1.14, textWrap: "balance" }}><span style={{ color: C.deepSteel }}>„</span>Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze.<span style={{ color: C.deepSteel }}>”</span></p>
          <div style={{ display: "flex", alignItems: "center", gap: 18 * s, marginTop: 48 * s }}>
            <span style={{ width: 48 * s, height: 2, background: C.deepSteel }} />
            <span style={{ fontFamily: SANS, fontSize: 30 * s, fontWeight: 600, color: C.ink }}>Joanna Michno</span>
            <span style={{ fontFamily: SANS, fontSize: 28 * s, color: C.inkMuted }}>Zielona Baza, Rzeszów</span>
          </div>
        </div>
        <Footer scale={s} dark={false} />
      </div>
    </Paper>;
  }

  if (graphic.kind === "guide") {
    const q = (portrait ? 92 : 70) * s;
    return <Paper w={w} h={h}>
      <div style={{ position: "absolute", inset: portrait ? 84 : 72 * s, top: size === "story" ? 220 : undefined, bottom: size === "story" ? 230 : undefined, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Wordmark dark={false} scale={s} />
        <div>
          <p style={{ ...body(26 * s, C.deepSteel), letterSpacing: "0.12em", marginBottom: 28 * s }}>PORADNIK</p>
          <h1 style={{ ...display(q), color: C.ink }}>{graphic.title}</h1>
          <p style={{ ...body(34 * s, C.inkMuted), marginTop: 28 * s, maxWidth: 820 * s }}>{graphic.line}</p>
        </div>
        <Footer scale={s} dark={false} cta={false} />
      </div>
    </Paper>;
  }

  if (graphic.kind === "process") {
    const steps = [["Rozmowa", "Opowiadasz, czym się zajmujesz i co chcesz usprawnić."], ["Zakres i wycena", "Dostajesz propozycję, cenę i termin. Decydujesz, czy zaczynamy."], ["Projekt i realizacja", "Widzisz projekt i wersję testową. Mówisz, co dopracować."], ["Wdrożenie", "Uruchamiam projekt i pokazuję, jak z niego korzystać."]];
    return <Paper w={w} h={h}>
      <div style={{ position: "absolute", inset: portrait ? 84 : 64 * s, top: size === "story" ? 220 : undefined, bottom: size === "story" ? 230 : undefined, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 * s }}>
        <Wordmark dark={false} scale={s} />
        <div>
          <h1 style={{ ...display((portrait ? 78 : 56) * s), color: C.ink }}>Jak wygląda współpraca?</h1>
          <p style={{ ...italic((portrait ? 64 : 46) * s, C.deepSteel), marginTop: 6 * s }}>Cztery kroki, bez niespodzianek.</p>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: portrait ? "1fr" : "1fr 1fr", gap: (portrait ? 26 : 18) * s }}>
          {steps.map(([title, text], i) => <li key={title} style={{ display: "flex", gap: 22 * s, padding: `${(portrait ? 26 : 18) * s}px ${26 * s}px`, borderRadius: 14 * s, background: C.card, boxShadow: `0 1px 0 #fff inset, 0 ${18 * s}px ${36 * s}px -${26 * s}px #3d2f1c66` }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 44 * s, lineHeight: 1, color: C.copper, fontWeight: 600 }}>{i + 1}</span>
            <span><strong style={{ display: "block", fontFamily: SANS, fontSize: 30 * s, color: C.ink, fontWeight: 600 }}>{title}</strong><span style={{ ...body(25 * s, C.inkMuted), display: "block", marginTop: 6 * s }}>{text}</span></span>
          </li>)}
        </ol>
        <Footer scale={s} dark={false} />
      </div>
    </Paper>;
  }

  // about
  const photo = (portrait ? 300 : 230) * s;
  return <Stage w={w} h={h} portrait={portrait}>
    <div style={{ position: "absolute", inset: portrait ? 84 : 64 * s, top: size === "story" ? 220 : undefined, bottom: size === "story" ? 230 : undefined, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Wordmark scale={s} />
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", alignItems: portrait ? "flex-start" : "center", gap: 48 * s }}>
        <img src="/emanuel_wloch.jpg" alt="" width={photo} height={photo} style={{ width: photo, height: photo, borderRadius: "50%", objectFit: "cover", objectPosition: "center 28%", boxShadow: "0 30px 60px -24px #000c, 0 0 0 1px #ffffff1f" }} />
        <div>
          <h1 style={display((portrait ? 92 : 66) * s)}>Emanuel Włoch</h1>
          <p style={{ ...italic((portrait ? 64 : 46) * s), marginTop: 14 * s, maxWidth: 900 * s }}>Od pierwszej rozmowy do wdrożenia pracujesz ze mną.</p>
          <p style={{ ...body(28 * s), marginTop: 24 * s }}>Strony, sklepy, aplikacje i programy dla firm · Jarosław i cała Polska</p>
        </div>
      </div>
      <Footer scale={s} />
    </div>
  </Stage>;
}
