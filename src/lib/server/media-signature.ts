export function validMediaSignature(bytes: Uint8Array, contentType: string) {
  const text = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end));
  if (contentType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (contentType === "image/webp") return text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  if (contentType === "image/avif") return text(4, 8) === "ftyp" && /avif|avis/.test(text(8, 32));
  if (contentType === "video/mp4") return text(4, 8) === "ftyp" && !/avif|avis/.test(text(8, 32));
  if (contentType === "video/webm") return [0x1a, 0x45, 0xdf, 0xa3].every((byte, index) => bytes[index] === byte);
  return false;
}
