/** Projects in the portfolio: the cached public catalogue, the admin list and edits. */
import "server-only";
import { safeParseJsonArray } from "@/lib/data/rows";
import { projectDatabaseKey, turso } from "@/lib/server/turso";
import type { Project } from "@/types";
import { unstable_cache, revalidatePath } from "next/cache";
import { slugify } from "@/lib/content/seo";
import { caseTextFields, caseListFields } from "@/lib/projects/case-fields";

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

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id || project.slug === id) ?? null;
}
