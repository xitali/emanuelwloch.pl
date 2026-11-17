/** Messages from the contact form. */
import "server-only";
import { turso } from "@/lib/server/turso";
import type { ContactMessage } from "@/types";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await turso.batch([
    { sql: `INSERT INTO contact_messages (id, name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'unread', ?)`, args: [id, data.name, data.email, data.subject, data.message, createdAt] },
    { sql: "INSERT INTO email_outbox (message_id,created_at) VALUES (?, ?)", args: [id, createdAt] },
  ], "write");
  return { id, success: true };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const result = await turso.execute("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return result.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      subject: String(row.subject),
      message: String(row.message),
      status: String(row.status || 'unread'),
      created_at: String(row.created_at || ''),
      review_requested_at: row.review_requested_at ? String(row.review_requested_at) : undefined,
    }));
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    return [];
  }
}

export async function updateContactMessageStatus(id: string, status: string) {
  await turso.execute({
    sql: "UPDATE contact_messages SET status = ? WHERE id = ?",
    args: [status, id],
  });
}

export async function deleteContactMessage(id: string) {
  await turso.execute({
    sql: "DELETE FROM contact_messages WHERE id = ?",
    args: [id],
  });
}
