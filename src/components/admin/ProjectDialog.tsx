"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import ProjectCaseFields from "@/components/ProjectCaseFields";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { createProjectAction, updateProjectAction } from "@/app/actions/admin";
import type { Project } from "@/types";
import { useAdmin } from "./AdminContext";

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const join = (value: string[] | string | undefined) => Array.isArray(value) ? value.join(", ") : (value || "");

/** One dialog for adding and editing a project. */
export default function ProjectDialog({ project, onClose }: { project?: Project; onClose: () => void }) {
  const { demo, busy, run, notify } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const prefix = project ? "edit" : "add";
  useBodyScrollLock(true);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = form.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]') || []).filter(el => el.getClientRects().length > 0);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const nodes = focusable(), first = nodes[0], last = nodes[nodes.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, [onClose]);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !form.current) return;
    if (demo) { notify("To wersja demo — zdjęcia nie są przesyłane."); return; }
    setUploading(true);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Obraz przekracza 10 MB.");
      const extension = IMAGE_TYPES[file.type];
      if (!extension) throw new Error("Wybierz JPG, PNG, WebP lub AVIF.");
      const { upload: uploadToBlob } = await import("@vercel/blob/client");
      const blob = await uploadToBlob(`projects/${crypto.randomUUID()}.${extension}`, file, { access: "public", handleUploadUrl: "/api/upload/direct", contentType: file.type });
      const input = form.current.querySelector<HTMLInputElement>('input[name="images"]');
      if (input) input.value = input.value.trim() ? `${input.value.trim()}, ${blob.url}` : blob.url;
      notify("Przesłano zdjęcie.");
    } catch (error) {
      console.error(error);
      notify(error instanceof Error ? error.message : "Nie udało się przesłać zdjęcia.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const saved = await run(() => project ? updateProjectAction(project.id, data) : createProjectAction(data), project ? "Zapisano zmiany realizacji." : "Dodano realizację.");
    if (saved || demo) onClose();
  }

  return <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-4">
    <form ref={form} onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby={`${prefix}-project-dialog-title`} className="admin-panel admin-dialog w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--p-border)] pb-3">
        <h3 id={`${prefix}-project-dialog-title`} className="text-lg">{project ? "Edytuj realizację" : "Dodaj realizację"}</h3>
        <button type="button" onClick={onClose} aria-label="Zamknij okno realizacji"><X className="w-5 h-5" /></button>
      </div>
      <div className="admin-form">
        <label htmlFor={`${prefix}-title`}>Nazwa realizacji *</label>
        <input id={`${prefix}-title`} name="title" required defaultValue={project?.title} placeholder="np. Strona firmy transportowej" />
        <label htmlFor={`${prefix}-short_description`}>Krótki opis *</label>
        <input id={`${prefix}-short_description`} name="short_description" required defaultValue={project?.short_description} />
        <label htmlFor={`${prefix}-detailed_description`}>Pełny opis</label>
        <textarea id={`${prefix}-detailed_description`} name="detailed_description" rows={3} defaultValue={project?.detailed_description} />
        <label htmlFor={`${prefix}-technologies`}>Technologie (oddzielone przecinkami)</label>
        <input id={`${prefix}-technologies`} name="technologies" defaultValue={join(project?.technologies)} placeholder="Next.js, TypeScript" />
        <label htmlFor={`${prefix}-images`}>Zdjęcia realizacji — adresy lub pliki</label>
        <div className="admin-upload-row">
          <input id={`${prefix}-images`} name="images" defaultValue={join(project?.images)} placeholder="/projects/img1.jpg lub https://..." />
          <label className="admin-secondary admin-upload"><Upload className="w-4 h-4" /><span>{uploading ? "Przesyłanie…" : "Dodaj zdjęcie"}</span><input type="file" accept="image/*" className="hidden" onChange={upload} /></label>
        </div>
        <ProjectCaseFields project={project} />
        <div className="admin-form-grid">
          <div><label htmlFor={`${prefix}-project_url`}>Adres działającej strony</label><input id={`${prefix}-project_url`} name="project_url" defaultValue={project?.project_url} placeholder="https://..." /></div>
          <div><label htmlFor={`${prefix}-repository_url`}>Adres repozytorium GitHub</label><input id={`${prefix}-repository_url`} name="repository_url" defaultValue={project?.repository_url} placeholder="https://github.com/..." /></div>
        </div>
        <div className="admin-form-grid admin-form-grid--3">
          <div><label htmlFor={`${prefix}-category`}>Kategoria</label><select id={`${prefix}-category`} name="category" defaultValue={project?.category || "web"}><option value="web">Strony i aplikacje webowe</option><option value="e-commerce">Sklepy</option><option value="apps">Programy na Windows i TV</option><option value="mobile">Aplikacje mobilne</option></select></div>
          <div><label htmlFor={`${prefix}-project-type`}>Typ projektu</label><input id={`${prefix}-project-type`} name="project_type" defaultValue={project?.project_type || "web-app"} /></div>
          <div><label htmlFor={`${prefix}-project-status`}>Status</label><select id={`${prefix}-project-status`} name="project_status" defaultValue={project?.project_status || "active"}><option value="active">Aktywny</option><option value="in-development">W budowie</option><option value="archived">Archiwalny</option></select></div>
        </div>
        <label className="admin-check"><input type="checkbox" name="featured" defaultChecked={Boolean(project?.featured)} /> Wyróżniony projekt</label>
      </div>
      <button type="submit" disabled={busy} className="admin-primary w-full">{busy ? "Zapisywanie…" : project ? "Zapisz zmiany" : "Zapisz realizację"}</button>
    </form>
  </div>;
}
