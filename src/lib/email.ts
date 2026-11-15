import "server-only";
import { turso } from "@/lib/turso";
import { recordDelivery, type DeliveryKind } from "@/lib/email-deliveries";
import { leadOwnerEmail, leadSenderEmail, RESEND_EVENTS, SITE_URL, templateValue, type Lead } from "@/lib/email-templates";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.LEAD_NOTIFY_TO);
}

const headers = (key?: string) => ({ Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", ...(key ? { "Idempotency-Key": key } : {}) });

/** Sends one enquiry email, tagged so Resend's delivery webhooks can be matched back to it. */
async function sendEmail(lead: Lead, kind: DeliveryKind, message: { to: string; reply_to: string; subject: string; html: string; text: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: headers(`lead/${lead.id}/${kind}`),
    body: JSON.stringify({ from: process.env.EMAIL_FROM, ...message, tags: [{ name: "message_id", value: lead.id }, { name: "kind", value: kind }] }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
  const id = typeof response.json === "function" ? await response.json().then((body: { id?: string }) => body?.id, () => undefined) : undefined;
  if (id) await recordDelivery(id, lead.id, kind, "sent");
}

export async function deliverLeadEmails() {
  if (!emailConfigured()) return { configured: false, delivered: 0 };
  const rows = await turso.execute({
    sql: `UPDATE email_outbox SET lease_until = ? WHERE message_id IN (
      SELECT message_id FROM email_outbox WHERE (owner_sent = 0 OR sender_sent = 0)
      AND attempts < 8 AND next_attempt_at <= ? AND lease_until <= ? LIMIT 5
    ) RETURNING *`, args: [Date.now() + 300000, Date.now(), Date.now()],
  });
  let delivered = 0;
  for (const row of rows.rows) {
    const result = await turso.execute({ sql: "SELECT id,name,email,subject,message FROM contact_messages WHERE id = ?", args: [row.message_id] });
    const found = result.rows[0];
    if (!found) { await turso.execute({ sql: "DELETE FROM email_outbox WHERE message_id = ?", args: [row.message_id] }); continue; }
    const lead: Lead = { id: String(found.id), name: String(found.name), email: String(found.email), subject: String(found.subject), message: String(found.message) };
    try {
      if (!row.owner_sent) {
        await sendEmail(lead, "owner", { to: process.env.LEAD_NOTIFY_TO!, reply_to: lead.email, ...leadOwnerEmail(lead) });
        await turso.execute({ sql: "UPDATE email_outbox SET owner_sent = 1 WHERE message_id = ?", args: [row.message_id] });
      }
      if (!row.sender_sent) {
        await sendEmail(lead, "sender", { to: lead.email, reply_to: process.env.LEAD_NOTIFY_TO!, ...leadSenderEmail(lead) });
        await turso.execute({ sql: "UPDATE email_outbox SET sender_sent = 1 WHERE message_id = ?", args: [row.message_id] });
      }
      await turso.execute({ sql: "UPDATE email_outbox SET lease_until = 0, last_error = NULL WHERE message_id = ?", args: [row.message_id] });
      delivered++;
    } catch {
      const attempts = Number(row.attempts) + 1;
      await turso.execute({ sql: "UPDATE email_outbox SET attempts = ?, next_attempt_at = ?, lease_until = 0, last_error = 'RESEND_SEND_FAILED' WHERE message_id = ?", args: [attempts, Date.now() + Math.min(86400000, 60000 * 2 ** attempts), row.message_id] });
      console.error("Nie udało się przekazać wiadomości do Resend. Wiadomość pozostaje w kolejce.");
    }
  }
  return { configured: true, delivered };
}

/**
 * Sends a custom event that starts or resumes a Resend Automation (reminders, review request).
 * Needs a full-access API key; failures are logged and never block the request that caused them.
 */
export async function sendResendEvent(event: (typeof RESEND_EVENTS)[keyof typeof RESEND_EVENTS], email: string, payload: Record<string, string>) {
  if (!process.env.RESEND_API_KEY || !email) return false;
  try {
    const response = await fetch("https://api.resend.com/events/send", {
      method: "POST", headers: headers(), body: JSON.stringify({ event, email, payload }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) console.error(`Resend nie przyjął zdarzenia ${event} (HTTP ${response.status}).`);
    return response.ok;
  } catch {
    console.error(`Nie udało się wysłać zdarzenia ${event} do Resend.`);
    return false;
  }
}

/** The owner gets reminded about this enquiry unless its status changes within 24 h. */
export const leadReceivedEvent = (lead: Pick<Lead, "id" | "name" | "subject">) => sendResendEvent(RESEND_EVENTS.leadReceived, process.env.LEAD_NOTIFY_TO ?? "", {
  message_id: lead.id, CLIENT_NAME: templateValue(lead.name, 80), SUBJECT: templateValue(lead.subject), ADMIN_URL: `${SITE_URL}/admin?tab=messages&message=${encodeURIComponent(lead.id)}`,
});

/** Stops the reminder for this enquiry. */
export const leadAnsweredEvent = (messageId: string) => sendResendEvent(RESEND_EVENTS.leadAnswered, process.env.LEAD_NOTIFY_TO ?? "", { message_id: messageId });

/** Starts the 7-day review request to the client. */
export const reviewRequestedEvent = (lead: Pick<Lead, "id" | "name" | "email">) => sendResendEvent(RESEND_EVENTS.reviewRequested, lead.email, {
  message_id: lead.id, CLIENT_NAME: templateValue(lead.name.trim().split(/\s+/)[0] ?? "", 40),
});
