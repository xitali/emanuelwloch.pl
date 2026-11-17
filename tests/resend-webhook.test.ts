import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { verifyResendWebhook } from "../src/lib/email/resend-webhook";

// A known secret in Resend's (Svix) format: "whsec_" + base64 key.
const key = Buffer.from("test-signing-key-0123456789abcdef");
const secret = `whsec_${key.toString("base64")}`;
const body = JSON.stringify({ type: "email.delivered", data: { email_id: "e1" } });
const sign = (id: string, timestamp: number, payload: string) =>
  `v1,${createHmac("sha256", key).update(`${id}.${timestamp}.${payload}`).digest("base64")}`;

describe("weryfikacja webhooka Resend", () => {
  const now = 1_800_000_000;
  const headers = (signature: string, timestamp = now) => ({ "svix-id": "msg_1", "svix-timestamp": String(timestamp), "svix-signature": signature });

  it("przyjmuje poprawnie podpisane zdarzenie i zwraca jego treść", () => {
    expect(verifyResendWebhook(secret, headers(sign("msg_1", now, body)), body, now)).toEqual({ type: "email.delivered", data: { email_id: "e1" } });
  });

  it("przyjmuje podpis, gdy w nagłówku jest kilka wersji klucza", () => {
    expect(verifyResendWebhook(secret, headers(`v1,AAAA ${sign("msg_1", now, body)}`), body, now)).not.toBeNull();
  });

  it("odrzuca zmienioną treść", () => {
    expect(verifyResendWebhook(secret, headers(sign("msg_1", now, body)), body.replace("e1", "e2"), now)).toBeNull();
  });

  it("odrzuca zdarzenie starsze niż 5 minut (powtórzone)", () => {
    const old = now - 6 * 60;
    expect(verifyResendWebhook(secret, headers(sign("msg_1", old, body), old), body, now)).toBeNull();
  });

  it("odrzuca brak nagłówków i brak sekretu", () => {
    expect(verifyResendWebhook(secret, {}, body, now)).toBeNull();
    expect(verifyResendWebhook("", headers(sign("msg_1", now, body)), body, now)).toBeNull();
  });
});
