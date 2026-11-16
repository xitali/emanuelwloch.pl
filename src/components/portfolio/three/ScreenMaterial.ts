import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color, SRGBColorSpace, Texture, Vector2 } from "three";

/**
 * A lit display: shows texture A, wipes to texture B from top to bottom with a thin
 * accent scan line, and adds a soft panel falloff so the screen reads as glass, not a sticker.
 * Not tone mapped: screenshots keep their real colours.
 */
export const ScreenMaterialImpl = shaderMaterial(
  {
    uMapA: null as Texture | null,
    uMapB: null as Texture | null,
    uRepeatA: new Vector2(1, 1),
    uOffsetA: new Vector2(0, 0),
    uRepeatB: new Vector2(1, 1),
    uOffsetB: new Vector2(0, 0),
    uMix: 0,
    uPower: 1,
    /** 0 shows the top of the page, 1 the lowest part that fits; animating it scrolls the page. */
    uScroll: 0,
    uAccent: new Color("#acd1e8"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform sampler2D uMapA;
    uniform sampler2D uMapB;
    uniform vec2 uRepeatA;
    uniform vec2 uOffsetA;
    uniform vec2 uRepeatB;
    uniform vec2 uOffsetB;
    uniform float uMix;
    uniform float uPower;
    uniform float uScroll;
    uniform vec3 uAccent;
    varying vec2 vUv;

    void main() {
      vec4 a = texture2D(uMapA, vUv * uRepeatA + vec2(uOffsetA.x, uOffsetA.y * (1.0 - uScroll)));
      vec4 b = texture2D(uMapB, vUv * uRepeatB + vec2(uOffsetB.x, uOffsetB.y * (1.0 - uScroll)));
      // Wipe runs from the top edge (vUv.y = 1) down; 0.02 is the soft edge width.
      float edge = 1.04 - uMix * 1.08;
      float t = smoothstep(edge - 0.02, edge + 0.02, vUv.y);
      vec3 color = mix(a.rgb, b.rgb, t);
      float line = (1.0 - smoothstep(0.0, 0.006, abs(vUv.y - edge))) * step(0.001, uMix) * step(uMix, 0.999);
      color += uAccent * line * 0.9;
      // Gentle edge falloff of a backlit panel.
      vec2 c = vUv - 0.5;
      float vignette = 1.0 - dot(c, c) * 0.35;
      gl_FragColor = vec4(color * vignette * uPower, 1.0);
      #include <colorspace_fragment>
    }
  `,
);

export const ScreenMaterial = extend(ScreenMaterialImpl);
export type ScreenMaterialType = InstanceType<typeof ScreenMaterialImpl>;

/**
 * Fit a screenshot to the full width of its screen area, anchored to the top like a page in a
 * browser. Nothing is cut from the sides and nothing is stretched; a taller area shows less of
 * the page bottom, a shorter page continues with its last row.
 */
export function coverFit(texture: Texture, areaAspect: number) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  const textureAspect = image?.width && image?.height ? image.width / image.height : 16 / 9;
  const repeat = new Vector2(1, textureAspect / areaAspect);
  const offset = new Vector2(0, 1 - repeat.y);
  if (repeat.y > 1.15) {
    // Slightly short pages (a 16:9 shot on the 16:10 laptop) keep full width and continue with their last row.
    // A banner-like image shorter than the screen: fill the height and centre it instead of smearing the last row.
    repeat.set(areaAspect / textureAspect, 1);
    offset.set((1 - repeat.x) / 2, 0);
  }
  return { repeat, offset };
}

export function prepareScreenTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
