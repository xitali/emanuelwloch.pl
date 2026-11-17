"use client";
import { useEffect } from "react";

export default function ConversionTracker() {
  useEffect(() => {
    const send = (event: string, path: string) => { void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, path }), keepalive: true }).catch(() => {}); };
    const path = location.pathname;
    if (path.startsWith("/projekty/")) send("project_view", path);
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.includes("#kontakt") || href.startsWith("mailto:") || href.startsWith("tel:")) send("contact_cta", path);
      else if (anchor.hasAttribute("data-live-project")) send("live_project", path);
    };
    const contact = () => send("contact_cta", path);
    window.addEventListener("contact:cta", contact);
    document.addEventListener("click", click);
    return () => { document.removeEventListener("click", click); window.removeEventListener("contact:cta", contact); };
  }, []);
  return null;
}
