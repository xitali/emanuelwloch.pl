"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Morph from "@/components/motion/Morph";
import WorldView, { lazyScene } from "@/components/world/WorldView";
import type { CardPointer } from "@/components/world/scenes/CardScene";
import type { ChromeKind } from "./three/chrome";
import { Pause, Play, Plus } from "lucide-react";
import { useMotionPaused } from "@/lib/motion/preference";
import previewManifest from "../../lib/project-previews.json";

const subscribeMotion = (callback: () => void) => {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => true;
const CardScene = lazyScene<{ laptop: string; monitor: string; chrome: ChromeKind; pointer: { current: CardPointer } }>(() => import("@/components/world/scenes/CardScene"));
const previews: Record<string, { source: string; video: string; poster: string }> = previewManifest;

export default function ProjectMedia({ projectId, image, title, fallbackImage, onOpen, priority = false, alt, previewVideo, previewPoster, mockup, live }: {
  alt?: string; previewVideo?: string; previewPoster?: string;
  /** Rendered 3D mockup of the project; replaces the flat screenshot and its screen recording. */
  mockup?: string;
  /** The two screenshots on that mockup: with 3D on, the desk is drawn live over the still. */
  live?: { laptop: string; monitor: string; chrome: ChromeKind };
  projectId: string; image: string; title: string; fallbackImage?: string; onOpen?: () => void; priority?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<CardPointer>({ x: 0, y: 0, hover: false });
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [source, setSource] = useState(image);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, serverReducedMotion);
  const [motionPaused] = useMotionPaused();
  const entry = previews[projectId];
  const preview = previewVideo && previewPoster ? { source: image, video: previewVideo, poster: previewPoster } : entry?.source === image ? entry : undefined;
  const enabled = Boolean(preview && !mockup && !reduced && !motionPaused && !failed);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const update = () => {
      if (visible && !paused && !document.hidden) element.play().catch(() => setPaused(true));
      else element.pause();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => { document.removeEventListener("visibilitychange", update); element.pause(); };
  }, [visible, paused, enabled]);
  const visual = <>
    {mockup ? <Morph name={`project-${projectId}`} share="project-morph" default="none"><div className="project-mockup-frame">
      {live ? <WorldView className="project-mockup-world" scene={CardScene} sceneProps={{ ...live, pointer }} fallback={null} /> : null}
      <Image src={mockup} alt={alt || `Projekt ${title} na laptopie i monitorze`} fill priority={priority} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 90vw, 65vw" className="project-mockup" />
    </div></Morph> : <Image src={preview && !posterFailed ? preview.poster : source} alt={alt || `Podgląd projektu ${title}`} fill priority={priority} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 90vw, 65vw" className="object-contain" onError={() => { if (preview && !posterFailed) { setPosterFailed(true); return; } if (fallbackImage && source !== fallbackImage) setSource(fallbackImage); }} />}
    {enabled && visible && <video ref={video} src={preview!.video} poster={preview!.poster} muted loop playsInline preload="none" aria-hidden="true" onError={() => setFailed(true)} />}
    {onOpen && <span className="project-media-open"><Plus size={18} /></span>}
  </>;
  const track = (event: React.PointerEvent<HTMLDivElement>, hover: boolean) => {
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: ((event.clientX - box.left) / box.width) * 2 - 1, y: -(((event.clientY - box.top) / box.height) * 2 - 1), hover };
  };
  return <div ref={root} className={`project-media${mockup ? " project-media--mockup" : ""}${live ? " project-media--live" : ""}`} data-spotlight data-tilt={mockup && !live ? "" : undefined} onPointerMove={live ? event => track(event, true) : undefined} onPointerLeave={live ? event => track(event, false) : undefined}>
    {onOpen ? <button type="button" className="project-media-trigger" onClick={onOpen} aria-label={`Podgląd projektu: ${title}`}>{visual}</button> : visual}
    {enabled && <button type="button" className="project-media-control" onClick={() => setPaused(value => !value)} aria-label={`${paused ? "Odtwórz" : "Zatrzymaj"} animację: ${title}`} aria-pressed={paused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
  </div>;
}
