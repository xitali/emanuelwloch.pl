/** Service prices and the public site settings. */
import "server-only";
import { safeParseJsonArray } from "@/lib/data/rows";
import { projectDatabaseKey, turso } from "@/lib/server/turso";
import type { Service, PublicSiteSettings } from "@/types";
import { unstable_cache, revalidatePath } from "next/cache";

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

export async function updateServicePrice(id: string, priceFrom: number) {
  const updatedAt = new Date().toISOString();
  await turso.execute({
    sql: "UPDATE services SET price_from = ?, updated_at = ? WHERE id = ?",
    args: [priceFrom, updatedAt, id],
  });
  revalidatePath("/");
  return { success: true };
}

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
