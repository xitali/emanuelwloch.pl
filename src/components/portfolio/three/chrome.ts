import { CanvasTexture, SRGBColorSpace } from "three";

export type ChromeKind = "browser" | "window";

/** Share of the screen height taken by the window chrome. The page below it shows its top part. */
export const CHROME_HEIGHT: Record<ChromeKind, number> = { browser: 0.115, window: 0.055 };

const cache = new Map<ChromeKind, CanvasTexture>();

/**
 * Neutral browser or Windows title bar drawn once into a canvas: tabs, address field and
 * controls, without invented addresses or titles.
 */
export function chromeTexture(kind: ChromeKind) {
  const cached = cache.get(kind);
  if (cached) return cached;
  const width = 1600;
  const height = Math.round(width / (16 / 9) * CHROME_HEIGHT[kind]);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const c = canvas.getContext("2d")!;
  const box = (x: number, y: number, w: number, h: number, r: number, fill: string) => { c.fillStyle = fill; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };

  if (kind === "browser") {
    c.fillStyle = "#1b1f23"; c.fillRect(0, 0, width, height);
    ["#ec6a5e", "#f4bf4f", "#61c554"].forEach((color, i) => { c.fillStyle = color; c.beginPath(); c.arc(28 + i * 26, 26, 8, 0, Math.PI * 2); c.fill(); });
    // Active tab, merging into the toolbar.
    box(110, 8, 300, 44, 12, "#2a3036");
    box(126, 22, 18, 18, 4, "#acd1e8");
    box(156, 26, 170, 10, 5, "#8d989f");
    box(420, 22, 150, 10, 5, "#4a545b");
    c.fillStyle = "#2a3036"; c.fillRect(0, 50, width, height - 50);
    // Navigation arrows and address field.
    c.strokeStyle = "#8d989f"; c.lineWidth = 3; c.lineCap = "round";
    for (const [x, dir] of [[34, -1], [72, 1]] as const) { c.beginPath(); c.moveTo(x + 6 * dir, 62); c.lineTo(x - 2 * dir, 72); c.lineTo(x + 6 * dir, 82); c.stroke(); }
    box(110, 56, width - 230, 32, 16, "#1b1f23");
    c.strokeStyle = "#8d989f"; c.lineWidth = 2.5; c.beginPath(); c.roundRect(130, 66, 12, 10, 2); c.stroke(); c.beginPath(); c.arc(136, 66, 5, Math.PI, 0); c.stroke();
    box(156, 67, 240, 10, 5, "#6c777e");
    box(width - 100, 60, 24, 24, 12, "#3a434a");
    box(width - 60, 60, 24, 24, 12, "#3a434a");
  } else {
    c.fillStyle = "#1f2a33"; c.fillRect(0, 0, width, height);
    box(18, height / 2 - 10, 20, 20, 4, "#8de5ce");
    box(52, height / 2 - 6, 220, 12, 6, "#7b8a94");
    c.strokeStyle = "#a7b3ba"; c.lineWidth = 2;
    const y = height / 2;
    c.beginPath(); c.moveTo(width - 150, y); c.lineTo(width - 134, y); c.stroke();
    c.strokeRect(width - 96, y - 8, 16, 16);
    c.beginPath(); c.moveTo(width - 44, y - 8); c.lineTo(width - 28, y + 8); c.moveTo(width - 28, y - 8); c.lineTo(width - 44, y + 8); c.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  cache.set(kind, texture);
  return texture;
}
