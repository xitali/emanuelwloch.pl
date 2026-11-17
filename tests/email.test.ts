import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { readFile } from "node:fs/promises";
const state = vi.hoisted(() => ({ db: null as Client | null, send: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/turso", () => ({ turso: { execute: (...args: Parameters<Client["execute"]>) => state.db!.execute(...args) } }));
import { deliverLeadEmails } from "../src/lib/email/send";

afterEach(() => { state.db?.close(); state.db = null; vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
async function setup(configured = true) {
  state.db = createClient({ url: "file::memory:" });
  await state.db.executeMultiple(await readFile("migrations/000_baseline.sql", "utf8"));
  await state.db.executeMultiple(await readFile("migrations/007_email_outbox.sql", "utf8"));
  await state.db.executeMultiple(await readFile("migrations/011_email_delivery.sql", "utf8"));
  await state.db.execute("INSERT INTO contact_messages (id,name,email,subject,message) VALUES ('test','Jan <b>Kowalski</b>','test@example.com','Projekt','Treść zapytania\n<script>alert(1)</script>')");
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
  it("wysyła maile HTML oznaczone zapytaniem i zapisuje je jako wysłane", async () => {
    await setup();
    state.send.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "re_owner" }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ id: "re_sender" }) });
    await deliverLeadEmails();
    const [owner, sender] = state.send.mock.calls.map(call => JSON.parse(call[1].body));
    expect(owner.tags).toEqual([{ name: "message_id", value: "test" }, { name: "kind", value: "owner" }]);
    expect(sender.tags).toEqual([{ name: "message_id", value: "test" }, { name: "kind", value: "sender" }]);
    expect(owner.html).toContain("Treść zapytania");
    expect(owner.text).toContain("Treść zapytania");
    const rows = (await state.db!.execute("SELECT resend_id, kind, status FROM email_deliveries ORDER BY kind")).rows;
    expect(rows.map(r => [r.resend_id, r.kind, r.status])).toEqual([["re_owner", "owner", "sent"], ["re_sender", "sender", "sent"]]);
  });

  it("treść z formularza nie wstrzykuje HTML do maili", async () => {
    await setup();
    state.send.mockResolvedValue({ ok: true, json: async () => ({ id: "re_x" }) });
    await deliverLeadEmails();
    for (const call of state.send.mock.calls) {
      const { html } = JSON.parse(call[1].body);
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("<b>Kowalski</b>");
    }
    expect(JSON.parse(state.send.mock.calls[0][1].body).html).toContain("&lt;script&gt;");
  });
});
