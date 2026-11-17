import { z } from "zod";

/** Lifecycle of a client enquiry. `unread` is what the contact form stores. */
export const messageStatuses = [
  { id: "unread", label: "Nowa" },
  { id: "in-progress", label: "W toku" },
  { id: "replied", label: "Odpowiedziano" },
  { id: "closed", label: "Zamknięta" },
] as const;

export type MessageStatus = (typeof messageStatuses)[number]["id"];
export const messageStatusSchema = z.enum(messageStatuses.map(s => s.id) as [MessageStatus, ...MessageStatus[]]);

export function normalizeMessageStatus(value: string | undefined): MessageStatus {
  const parsed = messageStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "unread";
}

export const messageStatusLabel = (value: string | undefined) => messageStatuses.find(s => s.id === normalizeMessageStatus(value))!.label;

/** Messages still waiting for the owner: new or in progress. */
export const isOpenMessage = (value: string | undefined) => ["unread", "in-progress"].includes(normalizeMessageStatus(value));
