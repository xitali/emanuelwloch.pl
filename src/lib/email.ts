import "server-only";
import { turso } from "@/lib/turso";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.LEAD_NOTIFY_TO);
}

async function sendEmail(key: string, message: Record<string, string>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, ...message }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
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
    const result = await turso.execute({ sql: "SELECT name,email,subject,message FROM contact_messages WHERE id = ?", args: [row.message_id] });
    const lead = result.rows[0];
    if (!lead) { await turso.execute({ sql: "DELETE FROM email_outbox WHERE message_id = ?", args: [row.message_id] }); continue; }
    try {
      if (!row.owner_sent) {
        await sendEmail(`lead/${row.message_id}/owner`, { to: process.env.LEAD_NOTIFY_TO!, reply_to: String(lead.email), subject: `Nowe zapytanie: ${String(lead.subject).replace(/[\r\n]/g, " ")}`, text: `${lead.name} <${lead.email}>\n\n${lead.message}` });
        await turso.execute({ sql: "UPDATE email_outbox SET owner_sent = 1 WHERE message_id = ?", args: [row.message_id] });
      }
      if (!row.sender_sent) {
        await sendEmail(`lead/${row.message_id}/sender`, { to: String(lead.email), reply_to: process.env.LEAD_NOTIFY_TO!, subject: "Dziękuję za wiadomość — Emanuel Włoch", text: "Dziękuję za kontakt. Wiadomość została zapisana. Zapoznam się z opisem i odpowiem na podany adres.\n\nEmanuel Włoch\nhttps://emanuelwloch.pl" });
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
