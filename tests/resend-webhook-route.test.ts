import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
const state = vi.hoisted(() => ({ db: null as Client | null }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/turso", () => ({ turso: { execute: (...args: Parameters<Client["execute"]>) => state.db!.execute(...args) } }));
import { POST } from "../src/app/api/webhooks/resend/route";

const key = Buffer.from("route-signing-key-0123456789abcd");
const secret = `whsec_${key.toString("base64")}`;
let counter = 0;
function event(type: string, tags: unknown = { message_id: "lead-1", kind: "sender" }, emailId = "re_1") {
  const body = JSON.stringify({ type, created_at: "2026-11-15T12:00:00Z", data: { email_id: emailId, tags } });
  const id = `msg_${++counter}`, ts = Math.floor(Date.now() / 1000);
  const signature = `v1,${createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64")}`;
  return new Request("https://emanuelwloch.pl/api/webhooks/resend", { method: "POST", body, headers: { "svix-id": id, "svix-timestamp": String(ts), "svix-signature": signature } });
}
const statusOf = async () => (await state.db!.execute("SELECT status, kind, message_id FROM email_deliveries WHERE resend_id = 're_1'")).rows[0];

async function setup() {
  state.db = createClient({ url: "file::memory:" });
  for (const file of ["000_baseline.sql", "007_email_outbox.sql", "011_email_delivery.sql"]) await state.db.executeMultiple(await readFile(`migrations/${file}`, "utf8"));
  await state.db.execute("INSERT INTO contact_messages (id,name,email,subject,message) VALUES ('lead-1','Jan','jan@example.com','Projekt','Treść')");
  vi.stubEnv("RESEND_WEBHOOK_SECRET", secret);
}
afterEach(() => { state.db?.close(); state.db = null; vi.unstubAllEnvs(); });

describe("webhook statusu dostarczenia", () => {
  it("zapisuje doręczenie maila do klienta", async () => {
    await setup();
    expect((await POST(event("email.delivered"))).status).toBe(200);
    expect(await statusOf()).toMatchObject({ status: "delivered", kind: "sender", message_id: "lead-1" });
  });

  it("nie cofa statusu, gdy spóźnione „wysłano” przyjdzie po doręczeniu", async () => {
    await setup();
    await POST(event("email.delivered"));
    await POST(event("email.sent"));
    expect(await statusOf()).toMatchObject({ status: "delivered" });
  });

  it("odbicie po doręczeniu nadpisuje status", async () => {
    await setup();
    await POST(event("email.delivered"));
    await POST(event("email.bounced"));
    expect(await statusOf()).toMatchObject({ status: "bounced" });
  });

  it("czyta tagi także w formie listy name/value", async () => {
    await setup();
    await POST(event("email.delivered", [{ name: "message_id", value: "lead-1" }, { name: "kind", value: "owner" }]));
    expect(await statusOf()).toMatchObject({ status: "delivered", kind: "owner" });
  });

  it("pomija maile bez tagów zapytania (np. z automatyzacji)", async () => {
    await setup();
    expect((await POST(event("email.delivered", null))).status).toBe(200);
    expect(await statusOf()).toBeUndefined();
  });

  it("odrzuca niepodpisane zdarzenie i niczego nie zapisuje", async () => {
    await setup();
    const forged = new Request("https://emanuelwloch.pl/api/webhooks/resend", { method: "POST", body: JSON.stringify({ type: "email.delivered", data: { email_id: "re_1", tags: { message_id: "lead-1", kind: "sender" } } }) });
    expect((await POST(forged)).status).toBe(401);
    expect(await statusOf()).toBeUndefined();
  });
});
