import { recordPageVisit } from "@/lib/server/turso";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import { NextResponse } from "next/server";
import { z } from "zod";

const visitSchema = z.object({
  path: z.string().startsWith("/").max(200),
});

export async function POST(request: Request) {
  if (/bot|crawl|spider|headless|lighthouse/i.test(request.headers.get("user-agent") || "")) return NextResponse.json({ success: true });
  try {
    const body = await request.json();
    const validation = visitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const rateLimit = await checkRateLimit({
      namespace: "visit",
      identifier: getClientIp(request.headers),
      limit: 30,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        },
      );
    }

    await recordPageVisit(validation.data.path);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
