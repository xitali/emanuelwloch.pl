import { CanvasTexture, SRGBColorSpace } from "three";

const cache = new Map<string, CanvasTexture>();

/**
 * A small mono label drawn on a canvas, for tags that float next to 3D parts.
 * Width/height are the plane's aspect; the text is drawn at 2× for sharpness.
 */
export function labelTexture(text: string, { accent = false, aspect = 4 }: { accent?: boolean; aspect?: number } = {}) {
  const key = `${text}|${accent}|${aspect}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const height = 96;
  const width = Math.round(height * aspect);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const r = height / 2 - 4;
  ctx.beginPath();
  ctx.roundRect(2, 2, width - 4, height - 4, r);
  ctx.fillStyle = "rgba(11,13,15,0.88)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = accent ? "rgba(172,209,232,0.85)" : "rgba(255,255,255,0.22)";
  ctx.stroke();
  ctx.fillStyle = accent ? "#acd1e8" : "#dbe4ea";
  ctx.font = `500 ${Math.round(height * 0.38)}px ui-monospace, "Geist Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2 + 2, width - 40);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);
  return texture;
}
