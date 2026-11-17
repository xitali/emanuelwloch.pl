import { describe, expect, it } from "vitest";
import { validMediaSignature } from "../src/lib/server/media-signature";
describe("podpisy mediów", () => {
  it("odrzuca HTML i rozbieżny typ", () => {
    expect(validMediaSignature(new TextEncoder().encode("<html>test</html>"), "image/png")).toBe(false);
    expect(validMediaSignature(Uint8Array.from([137,80,78,71,13,10,26,10]), "video/webm")).toBe(false);
  });
  it("rozpoznaje obraz i kontenery filmów", () => {
    expect(validMediaSignature(Uint8Array.from([137,80,78,71,13,10,26,10]), "image/png")).toBe(true);
    expect(validMediaSignature(new TextEncoder().encode("0000ftypisom000000000"), "video/mp4")).toBe(true);
    expect(validMediaSignature(Uint8Array.from([0x1a,0x45,0xdf,0xa3]), "video/webm")).toBe(true);
    expect(validMediaSignature(new TextEncoder().encode("0000ftypavif000000000"), "video/mp4")).toBe(false);
  });
});
