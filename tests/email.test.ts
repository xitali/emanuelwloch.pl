import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { readFile } from "node:fs/promises";
const state = vi.hoisted(() => ({ db: null as Client | null, send: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/turso", () => ({ turso: { execute: (...args: Parameters<Client["execute"]>) => state.db!.execute(...args) } }));
import { deliverLeadEmails } from "../src/lib/email";

afterEach(() => { state.db?.close(); state.db = null; vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
async function setup(configured = true) {
  state.db = createClient({ url: "file::memory:" });
  await state.db.executeMultiple(await readFile("migrations/000_baseline.sql", "utf8"));
  await state.db.executeMultiple(await readFile("migrations/007_email_outbox.sql", "utf8"));
  await state.db.execute("INSERT INTO contact_messages (id,name,email,subject,message) VALUES ('test','Jan','test@example.com','Projekt','Treść zapytania')");
  await state.db.execute("INSERT INTO email_outbox (message_id,created_at) VALUES ('test','2026-11-02')");
  for (const key of ["RESEND_API_KEY", "EMAIL_FROM", "LEAD_NOTIFY_TO"]) vi.stubEnv(key, configured ? "test@example.com" : "");
  vi.stubGlobal("fetch", state.send);
}
describe("kolejka powiadomień", () => {
  it("nie udaje wysyłki bez konfiguracji", async () => {
    await setup(false);
    expect(await deliverLeadEmails()).toEqual({ configured: false, delivered: 0 });
    expect(state.send).not.toHaveBeenCalled();
    expect((await state.db!.execute("SELECT owner_sent FROM email_outbox")).rows[0].owner_sent).toBe(0);
  });
  it("ponawia tylko niedostarczoną część powiadomienia", async () => {
    await setup();
    state.send.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, status: 500 });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await deliverLeadEmails();
    expect((await state.db!.execute("SELECT owner_sent,sender_sent,attempts FROM email_outbox")).rows[0]).toMatchObject({ owner_sent: 1, sender_sent: 0, attempts: 1 });
    await state.db!.execute("UPDATE email_outbox SET next_attempt_at = 0");
    state.send.mockResolvedValueOnce({ ok: true });
    expect((await deliverLeadEmails()).delivered).toBe(1);
    expect(state.send).toHaveBeenCalledTimes(3);
    expect(state.send.mock.calls[0][1].headers["Idempotency-Key"]).toBe("lead/test/owner");
    expect(state.send.mock.calls[2][1].headers["Idempotency-Key"]).toBe("lead/test/sender");
    expect((await state.db!.execute("SELECT sender_sent FROM email_outbox")).rows[0].sender_sent).toBe(1);
    log.mockRestore();
  });
});
