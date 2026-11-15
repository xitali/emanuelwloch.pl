/** Film timeline in seconds. Cuts sit on bar lines of the 120.19 BPM track (beat ≈ 0.499 s). */
export const FPS = 30;
export const DURATION = 25;
export const POSTER = 23.6;
const BEAT = 60 / 120.19;
const bar = (n: number) => 3.0186 + n * 4 * BEAT;

export const CUT = {
  reveal: bar(0), // 3.02 — the groove lands
  offer: bar(1), // 5.02
  office: bar(6), // 15.01
  proof: bar(7.5), // 18.01
  outro: bar(9.25), // 21.51
};
/** Each offer path holds one bar. */
export const PATH = 4 * BEAT;

export type SceneId = "hero" | "offer" | "office" | null;
export function sceneAt(t: number): SceneId {
  if (t < CUT.offer) return "hero";
  if (t < CUT.office) return "offer";
  if (t < CUT.proof) return "office";
  return null;
}
export const pathAt = (t: number) => Math.max(0, Math.min(4, Math.floor((t - CUT.offer) / PATH)));

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Exponential ease-out: fast start, long soft landing. */
export const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 4);
export const easeIn = (v: number) => Math.pow(clamp01(v), 3);
/** 0→1 over [start, start + length]. */
export const span = (t: number, start: number, length: number) => clamp01((t - start) / length);
