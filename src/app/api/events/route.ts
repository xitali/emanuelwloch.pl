import { z } from "zod";
import { turso } from "@/lib/server/turso";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";

const schema = z.object({ event: z.enum(["contact_cta", "live_project", "project_view"]), path: z.string().regex(/^\/[a-z0-9/_-]*$/i).max(160) });
export async function POST(request: Request) {
  if (/bot|crawl|spider|headless|lighthouse/i.test(request.headers.get("user-agent") || "")) return new Response(null, { status: 204 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get("content-length")) > 2048) return new Response(null, { status: 413 });
  try {
    const data = schema.safeParse(await request.json());
    if (!data.success) return new Response(null, { status: 400 });
    const limit = await checkRateLimit({ namespace: "events", identifier: getClientIp(request.headers), limit: 30, windowMs: 60000 });
    if (!limit.allowed) return new Response(null, { status: 429 });
    await turso.execute({ sql: `INSERT INTO daily_events VALUES (?, ?, ?, 1) ON CONFLICT(event_date,event_name,page_path) DO UPDATE SET event_count = event_count + 1`, args: [new Date().toISOString().slice(0, 10), data.data.event, data.data.path] });
    return new Response(null, { status: 204 });
  } catch { return new Response(null, { status: 400 }); }
}
