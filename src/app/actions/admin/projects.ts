"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createProject, deleteProject, updateProject } from "@/lib/data/projects";
import { caseListFields, caseTextFields } from "@/lib/projects/case-fields";
import { requireAdmin } from "@/lib/server/auth";
import { idSchema, projectSchema, splitCommaSeparated } from "@/lib/validation";

function projectFromFormData(formData: FormData) {
  return projectSchema.safeParse({
    is_published: formData.has("publishing_fields") ? formData.get("is_published") === "on" : undefined,
    sort_order: formData.has("publishing_fields") ? formData.get("sort_order") ?? 0 : undefined,
    ...Object.fromEntries(caseTextFields.filter(key => formData.has(key)).map(key => [key, formData.get(key)])),
    ...Object.fromEntries(caseListFields.filter(key => formData.has(key)).map(key => [key, String(formData.get(key) || "").split(/\r?\n/).map(value => value.trim()).filter(Boolean)])),
    title: formData.get("title"),
    short_description: formData.get("short_description"),
    detailed_description: formData.get("detailed_description"),
    technologies: splitCommaSeparated(formData.get("technologies")),
    images: splitCommaSeparated(formData.get("images")),
    project_url: formData.get("project_url") ?? "",
    repository_url: formData.get("repository_url") ?? "",
    category: formData.get("category") ?? "web",
    project_type: formData.get("project_type") ?? "web-app",
    project_status: formData.get("project_status") ?? "active",
    featured: formData.get("featured") === "on",
  });
}

/** Every page that lists or shows projects. */
function revalidateProjects() {
  updateTag("projects");
  revalidatePath("/realizacje");
  revalidatePath("/projekty/[id]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const validation = projectFromFormData(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message ?? "Nieprawidłowe dane projektu.",
    };
  }

  await createProject(validation.data);
  revalidateProjects();
  return { success: true };
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  const validId = idSchema.safeParse(id);
  const validation = projectFromFormData(formData);
  if (!validId.success || !validation.success) {
    return { success: false, error: !validation.success ? validation.error.issues[0]?.message || "Nieprawidłowe dane projektu." : "Nieprawidłowy identyfikator projektu." };
  }

  await updateProject(validId.data, validation.data);
  revalidateProjects();
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(idSchema.parse(id));
  revalidateProjects();
  return { success: true };
}
