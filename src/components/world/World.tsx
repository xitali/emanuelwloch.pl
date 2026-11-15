"use client";
import dynamic from "next/dynamic";
import { createContext, useContext, type ReactNode } from "react";
import { useWorldQuality, type WorldQuality } from "./quality";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });

const QualityContext = createContext<WorldQuality>("static");

/** Provides the 3D quality tier to the page and mounts the shared canvas when 3D is on. */
export function WorldProvider({ children }: { children: ReactNode }) {
  const quality = useWorldQuality();
  return <QualityContext.Provider value={quality}>
    {children}
    {quality !== "static" && <WorldCanvas quality={quality} />}
  </QualityContext.Provider>;
}

export function useQuality() {
  return useContext(QualityContext);
}
