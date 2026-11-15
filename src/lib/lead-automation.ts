import "server-only";
import { turso } from "@/lib/turso";
import { leadAnsweredEvent, reviewRequestedEvent } from "@/lib/email";
import { normalizeMessageStatus } from "@/lib/message-status";

/** Any status other than "new" means the owner is on it: the 24 h reminder for it stops. */
export async function messageStatusChanged(messageId: string, status: string) {
  if (normalizeMessageStatus(status) !== "unread") await leadAnsweredEvent(messageId);
}

/**
 * Schedules the review request (Resend sends it 7 days later). Only for enquiries the owner
 * has answered, and only once per enquiry; a refused event clears the mark so it can be retried.
 */
export async function requestReview(messageId: string): Promise<{ success: true } | { success: false; error: string }> {
  const found = (await turso.execute({ sql: "SELECT id, name, email, status, review_requested_at FROM contact_messages WHERE id = ?", args: [messageId] })).rows[0];
  if (!found) return { success: false, error: "Nie znaleziono zapytania." };
  if (!["replied", "closed"].includes(normalizeMessageStatus(String(found.status)))) return { success: false, error: "Poproś o opinię po odpowiedzi klientowi (status „Odpowiedziano” lub „Zamknięta”)." };
  const claimed = await turso.execute({ sql: "UPDATE contact_messages SET review_requested_at = ? WHERE id = ? AND review_requested_at IS NULL", args: [new Date().toISOString(), messageId] });
  if (claimed.rowsAffected !== 1) return { success: false, error: "Prośba o opinię dla tego zapytania została już zaplanowana." };
  const accepted = await reviewRequestedEvent({ id: String(found.id), name: String(found.name), email: String(found.email) });
  if (!accepted) {
    await turso.execute({ sql: "UPDATE contact_messages SET review_requested_at = NULL WHERE id = ?", args: [messageId] });
    return { success: false, error: "Resend nie przyjął zdarzenia. Sprawdź klucz API (pełny dostęp) i spróbuj ponownie." };
  }
  return { success: true };
}
