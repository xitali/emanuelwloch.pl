import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { verifyAdminSession } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import { del } from "@vercel/blob";
import { validMediaSignature } from "@/lib/server/media-signature";

export async function POST(request: Request) {
  try {
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      request, body,
      onBeforeGenerateToken: async pathname => {
        if (!(await verifyAdminSession())) throw new Error("Brak uprawnień.");
        const limit = await checkRateLimit({ namespace: "direct-upload", identifier: getClientIp(request.headers), limit: 20, windowMs: 600000 });
        if (!limit.allowed) throw new Error("Zbyt wiele plików.");
        if (!/^projects\/[a-f0-9-]+\.(jpg|jpeg|png|webp|avif|mp4|webm)$/.test(pathname)) throw new Error("Nieprawidłowa ścieżka.");
        const video = /\.(mp4|webm)$/.test(pathname);
        return { allowedContentTypes: video ? ["video/mp4", "video/webm"] : ["image/jpeg", "image/png", "image/webp", "image/avif"], maximumSizeInBytes: (video ? 25 : 10) * 1024 * 1024, addRandomSuffix: true, validUntil: Date.now() + 300000 };
      },
      onUploadCompleted: async ({ blob }) => {
        const url = new URL(blob.url);
        if (!url.hostname.endsWith(".public.blob.vercel-storage.com") || url.protocol !== "https:") throw new Error("Nieprawidłowy host pliku.");
        const result = await fetch(url, { headers: { Range: "bytes=0-31" }, signal: AbortSignal.timeout(10000) });
        if (!result.ok) throw new Error("Nie udało się sprawdzić pliku.");
        const reader = result.body?.getReader();
        const header = new Uint8Array(32);
        let offset = 0;
        while (reader && offset < 32) {
          const chunk = await reader.read();
          if (chunk.done) break;
          const length = Math.min(chunk.value.length, 32 - offset);
          header.set(chunk.value.subarray(0, length), offset);
          offset += length;
        }
        await reader?.cancel();
        if (!validMediaSignature(header.subarray(0, offset), blob.contentType)) await del(blob.url);
      },
    });
    return Response.json(response);
  } catch {
    return Response.json({ error: "Nie udało się autoryzować lub zakończyć uploadu. Sprawdź sesję i konfigurację Blob." }, { status: 400 });
  }
}
