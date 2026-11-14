"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import DeskComposition from "./DeskComposition";
import Studio from "./Studio";
import { prepareScreenTexture } from "./ScreenMaterial";
import type { ChromeKind } from "./chrome";

export interface MockupJob { laptop: string; monitor: string; out: string; chrome: ChromeKind }

/** Development-only renderer: draws each job's two screens on the desk and saves a still. */
function Desk({ job, onReady }: { job: MockupJob; onReady: () => void }) {
  const [laptopTexture, monitorTexture] = useTexture([job.laptop, job.monitor], textures => textures.forEach(prepareScreenTexture));
  const advance = useThree(state => state.advance);
  useEffect(() => {
    // Manual frames: environment, shadows and screens settle without relying on requestAnimationFrame.
    let frames = 0;
    let id = 0;
    const tick = () => { advance(performance.now()); if (++frames < 16) id = window.setTimeout(tick, 40); else onReady(); };
    id = window.setTimeout(tick, 40);
    return () => window.clearTimeout(id);
  }, [advance, onReady]);
  return <DeskComposition chrome={job.chrome} screens={{ laptopA: laptopTexture, monitorA: monitorTexture }} />;
}

export default function MockupStage({ jobs }: { jobs: MockupJob[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const job = jobs[index];
  const save = useCallback(async () => {
    if (!canvas.current || !job) return;
    const data = canvas.current.toDataURL("image/png");
    const response = await fetch("/api/dev/mockup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ out: job.out, data }) });
    setLog(current => [...current, `${response.ok ? "OK" : `BŁĄD ${response.status}`} ${job.out}`]);
    setIndex(current => current + 1);
  }, [job]);
  return <div style={{ width: 1600, height: 1000 }}>
    <Canvas ref={canvas} dpr={1} frameloop="never" camera={{ position: [3.4, 3.4, 8.6], fov: 32 }} gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0.05, 1.3, -0.35)}>
      <Suspense fallback={null}>
        <Studio />
        {job && <Desk key={job.out} job={job} onReady={save} />}
      </Suspense>
    </Canvas>
    <pre id="mockup-status" data-done={index >= jobs.length} style={{ position: "fixed", left: 8, bottom: 8, color: "#fff", font: "12px monospace" }}>{log.join("\n")}{index >= jobs.length ? "\nGOTOWE" : ""}</pre>
  </div>;
}
