import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function hasValidSignature(buffer: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => buffer[index] === byte,
    );
  }
  if (type === "image/webp") {
    const decoder = new TextDecoder();
    return (
      decoder.decode(buffer.slice(0, 4)) === "RIFF" &&
      decoder.decode(buffer.slice(8, 12)) === "WEBP"
    );
  }
  if (type === "image/avif") {
    const header = new TextDecoder().decode(buffer.slice(4, 16));
    return header.includes("ftyp") && header.includes("avif");
  }
  return false;
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FILE_SIZE + 64_000) {
    return NextResponse.json(
      { error: "Plik jest za duży. Maksymalny rozmiar to 4 MB." },
      { status: 413 },
    );
  }

  const rateLimit = await checkRateLimit({
    namespace: "upload",
    identifier: getClientIp(request.headers),
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Zbyt wiele plików. Spróbuj ponownie później." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nie przesłano pliku." },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension || file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Dozwolone są obrazy JPG, PNG, WebP i AVIF do 4 MB." },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasValidSignature(bytes, file.type)) {
      return NextResponse.json(
        { error: "Zawartość pliku nie pasuje do jego typu." },
        { status: 400 },
      );
    }

    const blob = await put(
      `projects/${crypto.randomUUID()}.${extension}`,
      file,
      {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      },
    );

    return NextResponse.json(
      { success: true, url: blob.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Nie udało się przesłać obrazu:", error);
    return NextResponse.json(
      { error: "Nie udało się przesłać obrazu." },
      { status: 500 },
    );
  }
}
