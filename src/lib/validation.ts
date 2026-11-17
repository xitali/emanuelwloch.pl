import { z } from "zod";
import { contactSources } from "@/lib/contact/sources";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .transform((value) => {
    if (!value) return "";
    if (value.startsWith("/")) return value;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  })
  .refine(
    (value) => {
      if (!value || value.startsWith("/")) return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Podaj prawidłowy adres URL." },
  );

export const contactSchema = z.object({
  from_project: z.union([z.uuid(), z.literal("")]).optional().default(""),
  source: z.enum(contactSources).optional().default(""),
  name: z.string().trim().min(2, "Imię musi mieć co najmniej 2 znaki.").max(100),
  email: z.email("Podaj prawidłowy adres e-mail.").max(254),
  subject: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .max(2000, "Wiadomość może mieć maksymalnie 2000 znaków.")
    .refine(
      (value) => value.trim().length >= 10,
      "Wiadomość musi mieć co najmniej 10 znaków.",
    ),
  website: z.string().max(0).optional().default(""),
});

const pushEndpointSchema = z
  .url("Nieprawidłowy adres subskrypcji.")
  .max(2048)
  .refine((value) => value.startsWith("https://"), {
    message: "Subskrypcja powiadomień musi używać HTTPS.",
  });

const pushKeySchema = z
  .string()
  .min(16)
  .max(512)
  .regex(/^[A-Za-z0-9_-]+$/, "Nieprawidłowy klucz subskrypcji.");

export const pushSubscriptionSchema = z.object({
  endpoint: pushEndpointSchema,
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: pushKeySchema,
    auth: pushKeySchema,
  }),
});

export const pushActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("subscribe"),
    subscription: pushSubscriptionSchema,
  }),
  z.object({
    action: z.literal("unsubscribe"),
    endpoint: pushEndpointSchema,
  }),
  z.object({
    action: z.literal("test"),
  }),
]);

export const mobileLoginSchema = z.object({
  password: z.string().min(1).max(256),
});

export const androidDeviceSchema = z.object({
  deviceId: z.uuid(),
  installationId: z
    .string()
    .trim()
    .min(20)
    .max(4096)
    .regex(/^[A-Za-z0-9_:\-]+$/, "Nieprawidłowy token urządzenia."),
});

export const mobileMessageDeleteSchema = z.object({
  id: z.uuid(),
});

export const projectSchema = z.object({
  image_alts: z.array(z.string().trim().min(1).max(500)).max(12).optional(),
  preview_video: optionalUrl.optional(),
  preview_poster: optionalUrl.optional(),
  is_published: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).max(10000).optional(),
  main_challenge: z.string().trim().max(5000).optional(),
  innovation: z.string().trim().max(5000).optional(),
  project_result: z.string().trim().max(5000).optional(),
  target_audience: z.string().trim().max(5000).optional(),
  hosting_platform: z.string().trim().max(5000).optional(),
  accessibility_features: z.string().trim().max(5000).optional(),
  key_features: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  performance_metrics: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  success_metrics: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  user_feedback: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  technical_metrics: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  frontend_technologies: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  backend_technologies: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  tools_and_services: z.array(z.string().trim().min(1).max(1000)).max(30).optional(),
  title: z.string().trim().min(2).max(120),
  short_description: z.string().trim().min(10).max(300),
  detailed_description: z.string().trim().max(5000).optional().default(""),
  technologies: z.array(z.string().trim().min(1).max(60)).max(30),
  images: z.array(optionalUrl).max(12),
  project_url: optionalUrl,
  repository_url: optionalUrl,
  category: z.string().trim().min(2).max(50).default("web"),
  project_type: z.string().trim().min(2).max(50).default("web-app"),
  project_status: z.enum(["active", "in-development", "archived"]).default("active"),
  featured: z.boolean().default(false),
}).superRefine((data, context) => {
  if (data.image_alts?.length && data.image_alts.length !== data.images.length) context.addIssue({ code: "custom", path: ["image_alts"], message: "Dodaj po jednym opisie dla każdego obrazu lub pozostaw listę opisów pustą." });
  if (Boolean(data.preview_video) !== Boolean(data.preview_poster)) context.addIssue({ code: "custom", path: ["preview_poster"], message: "Film wymaga obrazu podglądu. Uzupełnij oba adresy." });
  if (data.is_published && (!data.images.length || !data.project_result?.trim())) context.addIssue({ code: "custom", path: ["is_published"], message: "Przed publikacją dodaj okładkę i opis rzeczywistego rezultatu." });
});

export const testimonialSchema = z.object({
  client_name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().default(""),
  content: z.string().trim().min(10).max(1000),
  rating: z.coerce.number().int().min(1).max(5),
});

export const idSchema = z.string().uuid();

export const servicePriceSchema = z.object({
  id: idSchema,
  price: z.number().finite().min(0).max(1_000_000),
});

export function splitCommaSeparated(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
