"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { messageStatusSchema } from "@/lib/contact/message-status";
import { deleteContactMessage, updateContactMessageStatus } from "@/lib/data/messages";
import { messageStatusChanged, requestReview } from "@/lib/email/lead-automation";
import { leadAnsweredEvent } from "@/lib/email/send";
import { requireAdmin } from "@/lib/server/auth";
import { idSchema } from "@/lib/validation";

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  const messageId = idSchema.parse(id);
  await deleteContactMessage(messageId);
  after(() => leadAnsweredEvent(messageId));
  revalidatePath("/admin");
  return { success: true };
}

export async function updateMessageStatusAction(id: string, status: string) {
  await requireAdmin();
  const messageId = idSchema.parse(id);
  const nextStatus = messageStatusSchema.parse(status);
  await updateContactMessageStatus(messageId, nextStatus);
  after(() => messageStatusChanged(messageId, nextStatus));
  revalidatePath("/admin");
  return { success: true };
}

/** Schedules the Resend automation that asks the client for a review 7 days from now. */
export async function requestReviewAction(id: string) {
  await requireAdmin();
  const result = await requestReview(idSchema.parse(id));
  if (result.success) revalidatePath("/admin");
  return result;
}
