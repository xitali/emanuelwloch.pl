// Sets up everything the site uses in Resend. Safe to run again: it updates what exists.
//   npm run resend:setup
// Needs in .env.local: RESEND_API_KEY (full access), EMAIL_FROM, LEAD_NOTIFY_TO.
// Creates/updates: 2 templates, 3 custom events, 2 automations, 1 webhook.
// The webhook signing secret is written to .env.resend-webhook (git-ignored) and never printed.
import { writeFile } from "node:fs/promises";
import { automationTemplates, RESEND_EVENTS, SITE_URL } from "../src/lib/email-templates.ts";

const API = "https://api.resend.com";
const { RESEND_API_KEY: key, EMAIL_FROM, LEAD_NOTIFY_TO } = process.env;
if (!key || !EMAIL_FROM || !LEAD_NOTIFY_TO) {
  console.error("Brak konfiguracji. W pliku .env.local ustaw RESEND_API_KEY (klucz z pełnym dostępem), EMAIL_FROM i LEAD_NOTIFY_TO.");
  process.exit(1);
}
const from = EMAIL_FROM.includes("<") ? EMAIL_FROM : `Emanuel Włoch <${EMAIL_FROM}>`;

async function api(method, path, body) {
  const response = await fetch(`${API}${path}`, { method, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(`${method} ${path}: HTTP ${response.status} ${data?.message ?? ""}`.trim());
    error.status = response.status;
    throw error;
  }
  return data;
}
const ok = message => console.log(`  ✓ ${message}`);

// —— Templates ——
console.log("Szablony");
const templateIds = {};
for (const t of automationTemplates) {
  const body = { name: t.name, alias: t.alias, from, subject: t.subject, html: t.html, text: t.text, variables: t.variables };
  let id;
  try {
    id = (await api("GET", `/templates/${t.alias}`)).id;
    await api("PATCH", `/templates/${id}`, body);
  } catch (error) {
    if (error.status !== 404) throw error;
    id = (await api("POST", "/templates", body)).id;
  }
  await api("POST", `/templates/${id}/publish`);
  templateIds[t.alias] = id;
  ok(`${t.name} (${t.alias})`);
}

// —— Events ——
console.log("Zdarzenia");
const schemas = {
  [RESEND_EVENTS.leadReceived]: { message_id: "string", CLIENT_NAME: "string", SUBJECT: "string", ADMIN_URL: "string" },
  [RESEND_EVENTS.leadAnswered]: { message_id: "string" },
  [RESEND_EVENTS.reviewRequested]: { message_id: "string", CLIENT_NAME: "string" },
};
for (const [name, schema] of Object.entries(schemas)) {
  try { await api("POST", "/events", { name, schema }); ok(`${name} (utworzone)`); }
  catch (error) { if (![409, 422].includes(error.status)) throw error; ok(`${name} (już istnieje)`); }
}

// —— Automations ——
console.log("Automatyzacje");
const automations = [
  {
    name: "Przypomnienie: zapytanie bez odpowiedzi",
    steps: [
      { key: "start", type: "trigger", config: { event_name: RESEND_EVENTS.leadReceived } },
      { key: "wait_answer", type: "wait_for_event", config: { event_name: RESEND_EVENTS.leadAnswered, timeout: "24 hours", filter_rule: { type: "rule", field: "event.message_id", operator: "eq", value: { var: "event.message_id" } } } },
      { key: "remind", type: "send_email", config: { from, template: { id: templateIds["przypomnienie-o-zapytaniu"], variables: { CLIENT_NAME: { var: "event.CLIENT_NAME" }, SUBJECT: { var: "event.SUBJECT" }, ADMIN_URL: { var: "event.ADMIN_URL" } } } } },
    ],
    connections: [{ from: "start", to: "wait_answer", type: "default" }, { from: "wait_answer", to: "remind", type: "timeout" }],
  },
  {
    name: "Prośba o opinię po zakończonym projekcie",
    steps: [
      { key: "start", type: "trigger", config: { event_name: RESEND_EVENTS.reviewRequested } },
      { key: "wait_week", type: "delay", config: { duration: "7 days" } },
      { key: "ask", type: "send_email", config: { from, reply_to: LEAD_NOTIFY_TO, template: { id: templateIds["prosba-o-opinie"], variables: { CLIENT_NAME: { var: "event.CLIENT_NAME" } } } } },
    ],
    connections: [{ from: "start", to: "wait_week", type: "default" }, { from: "wait_week", to: "ask", type: "default" }],
  },
];
const existing = (await api("GET", "/automations")).data ?? [];
for (const automation of automations) {
  const found = existing.find(a => a.name === automation.name);
  if (found) {
    // A live automation can't be edited: switch it off, update, switch it back on.
    try { await api("PATCH", `/automations/${found.id}`, { ...automation, status: "enabled" }); }
    catch {
      await api("PATCH", `/automations/${found.id}`, { status: "disabled" });
      await api("PATCH", `/automations/${found.id}`, { ...automation, status: "disabled" });
      await api("PATCH", `/automations/${found.id}`, { status: "enabled" });
    }
  } else await api("POST", "/automations", { ...automation, status: "enabled" });
  ok(`${automation.name} (włączona)`);
}

// —— Webhook ——
console.log("Webhook statusu dostarczenia");
const endpoint = `${SITE_URL}/api/webhooks/resend`;
const events = ["email.sent", "email.delivered", "email.delivery_delayed", "email.bounced", "email.complained", "email.failed"];
const hooks = (await api("GET", "/webhooks")).data ?? [];
const hook = hooks.find(h => h.endpoint === endpoint);
if (hook) {
  ok(`${endpoint} (już istnieje; sekret bez zmian)`);
} else {
  const created = await api("POST", "/webhooks", { endpoint, events });
  await writeFile(".env.resend-webhook", `RESEND_WEBHOOK_SECRET=${created.signing_secret}\n`, { mode: 0o600 });
  ok(`${endpoint} (utworzony)`);
  console.log("\n  Sekret podpisu zapisany w pliku .env.resend-webhook.");
  console.log("  Skopiuj jego wartość do Vercel → Environment Variables → RESEND_WEBHOOK_SECRET (Production) i zrób Redeploy.");
}
console.log("\nGotowe.");
