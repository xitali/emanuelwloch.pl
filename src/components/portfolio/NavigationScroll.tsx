"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createNavigationScroll } from "@/lib/motion/navigation-scroll";

export default function NavigationScroll() {
  const pathname = usePathname();
  const controller = useRef<ReturnType<typeof createNavigationScroll> | null>(null);
  useEffect(() => {
    controller.current = createNavigationScroll();
    return () => { controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => { controller.current?.ready(); }, [pathname]);
  return null;
}
