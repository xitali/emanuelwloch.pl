import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { readFile } from "node:fs/promises";
const state = vi.hoisted(() => ({ db: null as Client | null, fetch: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/turso", () => ({ turso: { execute: (...args: Parameters<Client["execute"]>) => state.db!.execute(...args) } }));
import { messageStatusChanged, requestReview } from "../src/lib/lead-automation";

async function setup(status = "replied") {
  state.db = createClient({ url: "file::memory:" });
  for (const file of ["000_baseline.sql", "007_email_outbox.sql", "011_email_delivery.sql"]) await state.db.executeMultiple(await readFile(`migrations/${file}`, "utf8"));
  await state.db.execute({ sql: "INSERT INTO contact_messages (id,name,email,subject,message,status) VALUES ('lead-1','Anna Nowak','anna@example.com','Sklep','Treść',?)", args: [status] });
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("LEAD_NOTIFY_TO", "owner@example.com");
  state.fetch.mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", state.fetch);
}
afterEach(() => { state.db?.close(); state.db = null; vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
const sentEvents = () => state.fetch.mock.calls.filter(c => String(c[0]).endsWith("/events/send")).map(c => JSON.parse(c[1].body));

describe("przypomnienie o zapytaniu", () => {
  it("zmiana statusu z „Nowa” zatrzymuje przypomnienie tego zapytania", async () => {
    await setup();
    await messageStatusChanged("lead-1", "in-progress");
    expect(sentEvents()).toEqual([{ event: "lead.answered", email: "owner@example.com", payload: { message_id: "lead-1" } }]);
  });

  it("powrót do „Nowa” niczego nie wysyła", async () => {
    await setup();
    await messageStatusChanged("lead-1", "unread");
    expect(sentEvents()).toEqual([]);
  });
});

describe("prośba o opinię", () => {
  it("startuje automatyzację dla klienta, z samym imieniem", async () => {
    await setup("closed");
    expect(await requestReview("lead-1")).toEqual({ success: true });
    expect(sentEvents()).toEqual([{ event: "review.requested", email: "anna@example.com", payload: { message_id: "lead-1", CLIENT_NAME: "Anna" } }]);
  });

  it("nie wysyła drugi raz do tego samego klienta", async () => {
    await setup("closed");
    await requestReview("lead-1");
    expect(await requestReview("lead-1")).toEqual({ success: false, error: "Prośba o opinię dla tego zapytania została już zaplanowana." });
    expect(sentEvents()).toHaveLength(1);
  });

  it("nie wysyła do zapytania, na które jeszcze nie odpowiedziano", async () => {
    await setup("unread");
    expect(await requestReview("lead-1")).toMatchObject({ success: false });
    expect(sentEvents()).toEqual([]);
  });

  it("gdy Resend odrzuci zdarzenie, można spróbować ponownie", async () => {
    await setup("closed");
    vi.spyOn(console, "error").mockImplementation(() => {});
    state.fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    expect(await requestReview("lead-1")).toMatchObject({ success: false });
    expect(await requestReview("lead-1")).toEqual({ success: true });
  });
});
