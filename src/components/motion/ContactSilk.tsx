"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useQuality } from "@/components/world/World";

const Warp = dynamic(() => import("@paper-design/shaders-react").then(m => m.Warp), { ssr: false });

/**
 * Dark silk folds behind the contact section, in the site's steel blue. Only on the full
 * 3D tier; it stops moving while off screen. Everyone else gets the static gradient in CSS.
 */
export default function ContactSilk() {
  const quality = useQuality();
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (quality !== "full" || !box.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [quality]);
  return <div ref={box} className="contact-silk" aria-hidden="true">
    {quality === "full" && <Warp className="contact-silk-shader" colors={["#0b0d0f", "#16212a", "#2c4352", "#6d8fa3"]} proportion={0.42} softness={1} distortion={0.22} swirl={0.75} swirlIterations={8} shape="stripes" shapeScale={0.12} rotation={-12} speed={visible ? 0.35 : 0} />}
  </div>;
}
