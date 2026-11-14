"use client";
import { useCallback, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/app/actions/admin";
import { projectLabel } from "@/lib/project-labels";
import type { Project } from "@/types";
import { useAdmin } from "./AdminContext";
import ProjectDialog from "./ProjectDialog";

const STATUS: Record<string, string> = { active: "Aktywny", "in-development": "W budowie", archived: "Archiwalny" };

export default function ProjectsView({ projects }: { projects: Project[] }) {
  const { run } = useAdmin();
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const close = useCallback(() => setEditing(null), []);

  async function remove(project: Project) {
    if (!confirm(`Usunąć realizację „${project.title}”?`)) return;
    await run(() => deleteProjectAction(project.id), "Usunięto realizację.");
  }

  return <section className="admin-view" aria-labelledby="projects-title">
    <header className="admin-view-head">
      <div><h2 id="projects-title">Realizacje</h2><p>To, co widzą odwiedzający w katalogu i na stronie głównej.</p></div>
      <button type="button" className="admin-primary" onClick={() => setEditing("new")}><Plus className="w-4 h-4" /> Dodaj realizację</button>
    </header>
    <div className="admin-table" role="table" aria-label="Lista realizacji">
      <div className="admin-row admin-row--head" role="row"><span role="columnheader">Nazwa</span><span role="columnheader">Rodzaj</span><span role="columnheader">Status</span><span role="columnheader">Widoczność</span><span role="columnheader"><span className="sr-only">Akcje</span></span></div>
      {projects.map(project => <div key={project.id} className="admin-row" role="row">
        <span role="cell" className="admin-row-title"><strong>{project.title}</strong><small>{project.short_description}</small></span>
        <span role="cell">{projectLabel(project.project_type || project.category)}</span>
        <span role="cell"><span className={`admin-badge${project.project_status === "in-development" ? " admin-badge--warn" : ""}`}>{STATUS[project.project_status ?? "active"] ?? "Aktywny"}</span></span>
        <span role="cell">{project.is_published === false ? "Ukryta" : project.featured ? "Wyróżniona" : "Opublikowana"}</span>
        <span role="cell" className="admin-row-actions">
          <button type="button" aria-label={`Edytuj realizację: ${project.title}`} onClick={() => setEditing(project)}><Edit3 className="w-4 h-4" /></button>
          <button type="button" aria-label={`Usuń realizację: ${project.title}`} className="admin-danger" onClick={() => remove(project)}><Trash2 className="w-4 h-4" /></button>
        </span>
      </div>)}
    </div>
    {editing && <ProjectDialog project={editing === "new" ? undefined : editing} onClose={close} />}
  </section>;
}
