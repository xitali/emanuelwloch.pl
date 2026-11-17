import { verifyAdminSession } from "@/lib/server/auth";
import { turso } from "@/lib/server/turso";
import { deliverLeadEmails, emailConfigured } from "@/lib/email/send";
import { revalidatePath } from "next/cache";

async function retry() {
  "use server";
  if (!(await verifyAdminSession())) throw new Error("Brak uprawnień.");
  await turso.execute({ sql: "UPDATE email_outbox SET attempts = 0, next_attempt_at = 0 WHERE (owner_sent = 0 OR sender_sent = 0) AND lease_until <= ?", args: [Date.now()] });
  await deliverLeadEmails();
  revalidatePath("/admin");
}

export default async function EmailStatus() {
  const result = await turso.execute("SELECT COUNT(*) AS count FROM email_outbox WHERE owner_sent = 0 OR sender_sent = 0");
  return <aside className="p-5 bg-[var(--p-surface)] text-white border-b border-[var(--p-border)]"><p>Poczta: {emailConfigured() ? "Resend skonfigurowany — status dostarczenia sprawdzisz w Resend" : "nieaktywna — ustaw RESEND_API_KEY, EMAIL_FROM i LEAD_NOTIFY_TO w Vercel oraz zweryfikuj domenę w Resend"}.</p><p>Oczekujące powiadomienia: {String(result.rows[0].count)}. Zapytania są dostępne w panelu niezależnie od poczty.</p><form action={retry}><button className="mt-3 border rounded px-4 py-2" disabled={!emailConfigured()}>Wyślij oczekujące powiadomienia</button></form></aside>;
}
