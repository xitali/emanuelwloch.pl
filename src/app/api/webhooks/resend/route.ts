import { verifyResendWebhook } from "@/lib/resend-webhook";
import { recordDelivery, type DeliveryKind, type DeliveryStatus } from "@/lib/email-deliveries";

const STATUS: Record<string, DeliveryStatus> = {
  "email.sent": "sent", "email.delivered": "delivered", "email.delivery_delayed": "delivery_delayed",
  "email.bounced": "bounced", "email.complained": "complained", "email.failed": "failed",
};

/** Tags arrive as an object or as name/value pairs, depending on the event version. */
function readTags(tags: unknown): Record<string, string> {
  if (Array.isArray(tags)) return Object.fromEntries(tags.filter(t => t && typeof t.name === "string").map(t => [t.name, String(t.value)]));
  if (tags && typeof tags === "object") return Object.fromEntries(Object.entries(tags).map(([k, v]) => [k, String(v)]));
  return {};
}

/** Resend → site: delivery status of enquiry emails, shown next to each message in the admin panel. */
export async function POST(request: Request) {
  const body = await request.text();
  const event = verifyResendWebhook(process.env.RESEND_WEBHOOK_SECRET ?? "", {
    "svix-id": request.headers.get("svix-id"), "svix-timestamp": request.headers.get("svix-timestamp"), "svix-signature": request.headers.get("svix-signature"),
  }, body) as { type?: string; created_at?: string; data?: { email_id?: string; tags?: unknown } } | null;
  if (!event) return new Response(null, { status: 401 });
  const status = STATUS[event.type ?? ""];
  const tags = readTags(event.data?.tags);
  const kind = tags.kind as DeliveryKind;
  // Only the two enquiry emails carry these tags; automation emails are tracked in Resend itself.
  if (status && event.data?.email_id && tags.message_id && (kind === "owner" || kind === "sender")) {
    await recordDelivery(event.data.email_id, tags.message_id, kind, status, event.created_at);
  }
  return Response.json({ received: true });
}
