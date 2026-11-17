import { timingSafeEqual } from "node:crypto";
import { deliverLeadEmails } from "@/lib/email/send";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const received = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!secret || received.length !== expected.length || !timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return new Response(null, { status: 401 });
  return Response.json(await deliverLeadEmails());
}
