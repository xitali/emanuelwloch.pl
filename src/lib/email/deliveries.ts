import "server-only";
import { turso } from "@/lib/server/turso";

/** Delivery states of an enquiry email, in the order they can follow each other. */
const RANK: Record<string, number> = { sent: 1, delivery_delayed: 2, delivered: 3, failed: 4, bounced: 4, complained: 5 };
export type DeliveryStatus = keyof typeof RANK;
export type DeliveryKind = "owner" | "sender";

/** Records a status for one email, never moving back (e.g. a late "sent" after "delivered"). */
export async function recordDelivery(resendId: string, messageId: string, kind: DeliveryKind, status: DeliveryStatus, at = new Date().toISOString()) {
  const rank = RANK[status];
  if (!rank) return;
  await turso.execute({
    sql: `INSERT INTO email_deliveries (resend_id, message_id, kind, status, updated_at) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(resend_id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at
          WHERE CASE email_deliveries.status ${Object.entries(RANK).map(([s, r]) => `WHEN '${s}' THEN ${r}`).join(" ")} ELSE 0 END <= ?`,
    args: [resendId, messageId, kind, status, at, rank],
  });
}

/** Latest status of the owner notification and the client's confirmation, per enquiry. */
export async function deliveriesFor(messageIds: string[]) {
  const result: Record<string, Partial<Record<DeliveryKind, string>>> = {};
  if (!messageIds.length) return result;
  const rows = await turso.execute({
    sql: `SELECT message_id, kind, status FROM email_deliveries WHERE message_id IN (${messageIds.map(() => "?").join(",")}) ORDER BY updated_at`,
    args: messageIds,
  });
  for (const row of rows.rows) (result[String(row.message_id)] ??= {})[String(row.kind) as DeliveryKind] = String(row.status);
  return result;
}
