import ConversionTracker from "@/components/ConversionTracker";
import type { ReactNode } from "react";
import PortfolioNav from "./PortfolioNav";
import Footer from "@/components/Footer";
import MotionLayer from "./motion/MotionLayer";
import { WorldProvider } from "@/components/world/World";
import SmoothScroll from "@/components/motion/SmoothScroll";

export default function PublicPageShell({ children }: { children: ReactNode }) {
  return <div className="portfolio-site dark"><ConversionTracker /><MotionLayer /><SmoothScroll /><PortfolioNav home={false} /><WorldProvider>{children}</WorldProvider><Footer /></div>;
}
