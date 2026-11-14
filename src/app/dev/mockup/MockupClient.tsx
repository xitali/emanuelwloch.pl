"use client";
import dynamic from "next/dynamic";
import type { MockupJob } from "@/components/portfolio/three/MockupStage";

const MockupStage = dynamic(() => import("@/components/portfolio/three/MockupStage"), { ssr: false });

export default function MockupClient({ jobs }: { jobs: MockupJob[] }) {
  return <MockupStage jobs={jobs} />;
}
