import { slugify } from "@/lib/seo";
import { caseTextFields, caseListFields } from "@/lib/project-case-fields";
import "server-only";

import { createClient } from "@libsql/client";
import {
  Project,
  Service,
  ContactMessage,
  Testimonial,
  PublicSiteSettings,
  PushSubscriptionRecord,
  AndroidDeviceRecord,
} from "@/types";
import { unstable_cache, revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireServerEnv } from "@/lib/env";
import { createHash } from "node:crypto";

// A local demo and the live catalogue must never reuse each other's cached data.
const projectDatabaseKey = createHash("sha256").update(requireServerEnv("TURSO_DATABASE_URL")).digest("hex").slice(0, 16);

export const turso = createClient({
  url: requireServerEnv("TURSO_DATABASE_URL"),
  authToken: requireServerEnv("TURSO_AUTH_TOKEN"),
});

// Utility helper to safely parse JSON arrays from DB text columns
function safeParseJsonArray(jsonStr: unknown): string[] {
  if (!jsonStr || typeof jsonStr !== 'string') return [];
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.flatMap(item => {
        if (typeof item === 'string' && item.startsWith('[')) {
          try {
            const inner = JSON.parse(item);
            return Array.isArray(inner) ? inner : [item];
          } catch {
            return item;
          }
        }
        return item;
      });
    }
    return [];
  } catch {
    return [];
  }
}

// ---------------- CACHED DATA FETCHERS ---------------- //

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const result = await turso.execute(
        "SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC, featured DESC, created_at DESC",
      );
      return result.rows.map((row) => ({
        id: String(row.id || ''),
        slug: row.slug ? String(row.slug) : undefined,
        is_published: Number(row.is_published) === 1,
        sort_order: Number(row.sort_order || 0),
        title: String(row.title || ''),
        short_description: String(row.short_description || ''),
        detailed_description: String(row.detailed_description || ''),
        technologies: safeParseJsonArray(row.technologies),
        frontend_technologies: safeParseJsonArray(row.frontend_technologies),
        backend_technologies: safeParseJsonArray(row.backend_technologies),
        tools_and_services: safeParseJsonArray(row.tools_and_services),
        images: safeParseJsonArray(row.images),
        image_alts: safeParseJsonArray(row.image_alts),
        preview_video: row.preview_video ? String(row.preview_video) : undefined,
        preview_poster: row.preview_poster ? String(row.preview_poster) : undefined,
        category: row.category ? String(row.category) : undefined,
        project_type: row.project_type ? String(row.project_type) : undefined,
        featured: row.featured === "1" || row.featured === 1,
        project_status: row.project_status ? String(row.project_status) : undefined,
        completion_date: row.completion_date ? String(row.completion_date) : undefined,
        hosting_platform: row.hosting_platform ? String(row.hosting_platform) : undefined,
        key_features: safeParseJsonArray(row.key_features),
        design_style: row.design_style ? String(row.design_style) : undefined,
        color_palette: safeParseJsonArray(row.color_palette),
        target_audience: row.target_audience ? String(row.target_audience) : undefined,
        is_responsive: row.is_responsive === "1" || row.is_responsive === 1,
        accessibility_features: row.accessibility_features ? String(row.accessibility_features) : undefined,
        main_challenge: row.main_challenge ? String(row.main_challenge) : undefined,
        innovation: row.innovation ? String(row.innovation) : undefined,
        project_result: row.project_result ? String(row.project_result) : undefined,
        performance_metrics: safeParseJsonArray(row.performance_metrics),
        success_metrics: safeParseJsonArray(row.success_metrics),
        user_feedback: safeParseJsonArray(row.user_feedback),
        technical_metrics: safeParseJsonArray(row.technical_metrics),
        created_at: row.created_at ? String(row.created_at) : undefined,
        updated_at: row.updated_at ? String(row.updated_at) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching projects from Turso:", error);
      return [];
    }
  },
  ["projects-list", "public-catalog-v4", projectDatabaseKey],
  { revalidate: 60, tags: ["projects"] }
);

export async function getAdminProjects(): Promise<Project[]> {
  const result = await turso.execute(
    "SELECT * FROM projects ORDER BY sort_order ASC, featured DESC, created_at DESC",
  );

  return result.rows.map((row) => ({
    ...Object.fromEntries(caseTextFields.map(field => [field, String(row[field] || "")])),
    ...Object.fromEntries(caseListFields.map(field => [field, safeParseJsonArray(row[field])])),
    id: String(row.id || ""),
    slug: row.slug ? String(row.slug) : undefined,
    is_published: Number(row.is_published) === 1,
    sort_order: Number(row.sort_order || 0),
    title: String(row.title || ""),
    short_description: String(row.short_description || ""),
    detailed_description: String(row.detailed_description || ""),
    technologies: safeParseJsonArray(row.technologies),
    images: safeParseJsonArray(row.images),
    project_url: row.project_url ? String(row.project_url) : undefined,
    repository_url: row.repository_url
      ? String(row.repository_url)
      : undefined,
    category: row.category ? String(row.category) : undefined,
    project_type: row.project_type ? String(row.project_type) : undefined,
    featured: row.featured === "1" || row.featured === 1,
    project_status: row.project_status
      ? String(row.project_status)
      : "active",
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  }));
}

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    try {
      const result = await turso.execute(
        "SELECT * FROM services WHERE COALESCE(active, 1) = 1 ORDER BY CAST(COALESCE(order_index, 0) AS INTEGER) ASC",
      );
      return result.rows.map((row) => ({
        id: String(row.id || ''),
        name: String(row.title || row.name || ''),
        full_description: String(row.description || row.full_description || ''),
        short_description: String(row.short_description || ''),
        icon_name: String(row.icon || row.icon_name || 'Code'),
        included_features: safeParseJsonArray(row.features || row.included_features),
        starting_price: Number(row.price_from || row.starting_price || 0),
        currency: String(row.price_currency || row.currency || 'PLN'),
        is_active: row.active === 1 || row.active === "1" || row.is_active === 1 || row.is_active === "1",
        display_order: Number(row.order_index || row.display_order || 0),
        created_at: row.created_at ? String(row.created_at) : undefined,
        updated_at: row.updated_at ? String(row.updated_at) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching services from Turso:", error);
      return [];
    }
  },
  ["services-list", "content-review-v3-2026-11-07", projectDatabaseKey],
  { revalidate: 60, tags: ["services"] }
);

const PUBLIC_SETTING_KEYS = [
  "personal_email",
  "personal_phone",
  "social_facebook",
  "social_github",
  "social_instagram",
  "social_linkedin",
] as const;

export const getPublicSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    try {
      const placeholders = PUBLIC_SETTING_KEYS.map(() => "?").join(", ");
      const result = await turso.execute({
        sql: `SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (${placeholders})`,
        args: [...PUBLIC_SETTING_KEYS],
      });
      const settings: PublicSiteSettings = {};
      for (const row of result.rows) {
        if (row.setting_key && row.setting_value) {
          const key = String(row.setting_key) as keyof PublicSiteSettings;
          if (PUBLIC_SETTING_KEYS.includes(key)) {
            settings[key] = String(row.setting_value);
          }
        }
      }
      return settings;
    } catch (error) {
      console.error("Error fetching site settings from Turso:", error);
      return {};
    }
  },
  ["site-settings"],
  { revalidate: 3600 }
);

// ---------------- NON-CACHED MUTATIONS & MESSAGES ---------------- //

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

export async function recordPageVisit(pagePath: string) {
  try {
    const viewDate = new Date().toISOString().slice(0, 10);
    await turso.execute({
      sql: `INSERT INTO daily_page_views (view_date, page_path, view_count)
            VALUES (?, ?, 1)
            ON CONFLICT(view_date, page_path)
            DO UPDATE SET view_count = view_count + 1`,
      args: [viewDate, pagePath],
    });
  } catch (err) {
    console.error("Error recording page visit:", err);
  }
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
    }));
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    return [];
  }
}

export async function deleteContactMessage(id: string) {
  await turso.execute({
    sql: "DELETE FROM contact_messages WHERE id = ?",
    args: [id],
  });
}

export async function upsertPushSubscription(
  subscription: PushSubscriptionRecord,
) {
  const now = new Date().toISOString();
  await turso.execute({
    sql: `INSERT INTO push_subscriptions (
            endpoint, p256dh, auth, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(endpoint) DO UPDATE SET
            p256dh = excluded.p256dh,
            auth = excluded.auth,
            updated_at = excluded.updated_at`,
    args: [
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      now,
      now,
    ],
  });
}

export async function getPushSubscriptions(): Promise<
  PushSubscriptionRecord[]
> {
  const result = await turso.execute(
    "SELECT endpoint, p256dh, auth, created_at, updated_at FROM push_subscriptions",
  );

  return result.rows.map((row) => ({
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
  }));
}

export async function deletePushSubscription(endpoint: string) {
  await turso.execute({
    sql: "DELETE FROM push_subscriptions WHERE endpoint = ?",
    args: [endpoint],
  });
}

export async function upsertAndroidDevice(device: AndroidDeviceRecord) {
  const now = new Date().toISOString();
  await turso.batch(
    [
      {
        sql: "DELETE FROM android_devices WHERE installation_id = ? AND device_id <> ?",
        args: [device.installation_id, device.device_id],
      },
      {
        sql: `INSERT INTO android_devices (
                device_id, installation_id, created_at, updated_at
              ) VALUES (?, ?, ?, ?)
              ON CONFLICT(device_id) DO UPDATE SET
                installation_id = excluded.installation_id,
                updated_at = excluded.updated_at`,
        args: [device.device_id, device.installation_id, now, now],
      },
    ],
    "write",
  );
}

export async function getAndroidDevices(): Promise<AndroidDeviceRecord[]> {
  const result = await turso.execute(
    "SELECT device_id, installation_id, created_at, updated_at FROM android_devices",
  );

  return result.rows.map((row) => ({
    device_id: String(row.device_id),
    installation_id: String(row.installation_id),
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
  }));
}

export async function deleteAndroidDevice(deviceId: string) {
  await turso.execute({
    sql: "DELETE FROM android_devices WHERE device_id = ?",
    args: [deviceId],
  });
}

export async function deleteAndroidDeviceByInstallationId(installationId: string) {
  await turso.execute({
    sql: "DELETE FROM android_devices WHERE installation_id = ?",
    args: [installationId],
  });
}

export async function getPageVisitsCount(): Promise<number> {
  try {
    const result = await turso.execute(
      "SELECT COALESCE(SUM(view_count), 0) as count FROM daily_page_views",
    );
    return Number(result.rows[0]?.count || 0);
  } catch {
    return 0;
  }
}

// ---------------- SERVICE UPDATE OPERATION ---------------- //

export async function updateServicePrice(id: string, priceFrom: number) {
  const updatedAt = new Date().toISOString();
  await turso.execute({
    sql: "UPDATE services SET price_from = ?, updated_at = ? WHERE id = ?",
    args: [priceFrom, updatedAt, id],
  });
  revalidatePath("/");
  return { success: true };
}

// ---------------- PROJECT CRUD OPERATIONS ---------------- //

function projectColumns(data: Partial<Project>) {
  const scalar = ["title", "short_description", "detailed_description", "project_url", "repository_url", "category", "project_type", "project_status", "completion_date", "sort_order", ...caseTextFields] as const;
  const lists = ["technologies", "images", ...caseListFields] as const;
  const values: Record<string, string | number> = {};
  for (const field of scalar) if (data[field] !== undefined) values[field] = data[field] as string | number;
  for (const field of lists) if (data[field] !== undefined) values[field] = JSON.stringify(data[field]);
  for (const field of ["featured", "is_published"] as const) if (data[field] !== undefined) values[field] = data[field] ? 1 : 0;
  return values;
}

export async function createProject(projectData: Partial<Project>) {
  const id = crypto.randomUUID();
  const tx = await turso.transaction("write");
  try {
    const base = slugify(projectData.title || "projekt") || "projekt";
    let slug = base, suffix = 2;
    while ((await tx.execute({ sql: "SELECT 1 FROM projects WHERE slug = ?", args: [slug] })).rows.length) slug = `${base}-${suffix++}`;
    const now = new Date().toISOString();
    const values = { ...projectColumns(projectData), id, slug, created_at: now, updated_at: now };
    await tx.execute({ sql: `INSERT INTO projects (${Object.keys(values).join(", ")}) VALUES (${Object.keys(values).map(() => "?").join(", ")})`, args: Object.values(values) });
    await tx.commit();
  } catch (error) { await tx.rollback(); throw error; }
  finally { tx.close(); }
  revalidatePath("/");
  return { id, success: true };
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  const values = { ...projectColumns(projectData), updated_at: new Date().toISOString() };
  await turso.execute({ sql: `UPDATE projects SET ${Object.keys(values).map(field => `${field} = ?`).join(", ")} WHERE id = ?`, args: [...Object.values(values), id] });
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  await turso.execute({ sql: "DELETE FROM projects WHERE id = ?", args: [id] });
  revalidatePath("/");
  return { success: true };
}

// ---------------- ADMIN AUTHENTICATION ---------------- //

export interface AdminCredential { id: string; credentialVersion: number }

export async function authenticateAdmin(password: string): Promise<AdminCredential | null> {
  try {
    const result = await turso.execute("SELECT id, password_hash, credential_version FROM admin_users ORDER BY created_at, id");
    for (const row of result.rows) {
      if (await bcrypt.compare(password, String(row.password_hash))) {
        return { id: String(row.id), credentialVersion: Number(row.credential_version) };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function isAdminCredentialCurrent(id: string, version: number): Promise<boolean> {
  const result = await turso.execute({ sql: "SELECT credential_version FROM admin_users WHERE id = ?", args: [id] });
  return result.rows.length === 1 && Number(result.rows[0].credential_version) === version;
}

// ---------------- TESTIMONIALS ---------------- //

export const getTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    try {
      const result = await turso.execute("SELECT * FROM testimonials WHERE is_published = 1 ORDER BY created_at DESC");
      return result.rows.map((row) => ({
        id: String(row.id),
        client_name: String(row.client_name),
        company: row.company ? String(row.company) : undefined,
        content: String(row.content),
        rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
        is_published: row.is_published === 1 || row.is_published === "1",
        created_at: String(row.created_at || ''),
      }));
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      return [];
    }
  },
  ["testimonials-list"],
  { revalidate: 3600 }
);

export async function addTestimonial(data: Partial<Testimonial>) {
  const id = crypto.randomUUID();
  await turso.execute({
    sql: `INSERT INTO testimonials (id, client_name, company, content, rating, is_published)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.client_name || "Anonim",
      data.company || "",
      data.content || "",
      data.rating || 5,
      1
    ],
  });
  revalidatePath("/");
  return { id, success: true };
}

export async function deleteTestimonial(id: string) {
  await turso.execute({
    sql: "DELETE FROM testimonials WHERE id = ?",
    args: [id],
  });
  revalidatePath("/");
  return { success: true };
}

// ---------------- ANALYTICS ---------------- //

export async function getPageVisitsStats() {
  try {
    const result = await turso.execute(`
      SELECT view_date as date, SUM(view_count) as count
      FROM daily_page_views
      GROUP BY view_date
      ORDER BY view_date DESC
      LIMIT 30
    `);
    
    // Formatujemy dla Recharts (od najstarszej daty do najnowszej)
    const stats = result.rows.map(row => ({
      date: String(row.date),
      visits: Number(row.count)
    })).reverse();
    
    return stats;
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id || project.slug === id) ?? null;
}
