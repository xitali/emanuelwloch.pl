import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies a Resend webhook (Svix signature scheme) against the raw request body.
 * Returns the parsed event, or null when the signature, timestamp or secret is wrong.
 */
export function verifyResendWebhook(secret: string, headers: Record<string, string | null | undefined>, rawBody: string, nowSeconds = Math.floor(Date.now() / 1000)): unknown {
  const id = headers["svix-id"];
  const timestamp = headers["svix-timestamp"];
  const signatures = headers["svix-signature"];
  if (!secret.startsWith("whsec_") || !id || !timestamp || !signatures) return null;
  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(nowSeconds - sentAt) > TOLERANCE_SECONDS) return null;
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();
  const valid = signatures.split(" ").some(entry => {
    const [version, value] = entry.split(",");
    if (version !== "v1" || !value) return false;
    const received = Buffer.from(value, "base64");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
  if (!valid) return null;
  try { return JSON.parse(rawBody); } catch { return null; }
}
