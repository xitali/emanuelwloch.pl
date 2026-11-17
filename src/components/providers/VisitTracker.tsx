"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Non-blocking visit logging in background
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return null;
}
