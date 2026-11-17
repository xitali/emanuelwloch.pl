/** Client testimonials shown on the site. */
import "server-only";
import { turso } from "@/lib/server/turso";
import type { Testimonial } from "@/types";
import { unstable_cache, revalidatePath } from "next/cache";

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
