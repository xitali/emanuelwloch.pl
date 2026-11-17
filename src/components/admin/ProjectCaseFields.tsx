import ProjectVideoUpload from "@/components/admin/ProjectVideoUpload";
import type { Project } from "@/types";
import { caseTextFields, caseListFields } from "@/lib/projects/case-fields";

const labels: Record<string, string> = {
  image_alts: "Opisy obrazów — jeden wiersz na obraz, w tej samej kolejności", preview_video: "Adres filmu MP4/WebM (wgraj poniżej)", preview_poster: "Obraz podglądu filmu (URL)",
  main_challenge: "Problem i wyzwanie", innovation: "Rozwiązanie", project_result: "Rezultat", target_audience: "Odbiorcy", hosting_platform: "Hosting", accessibility_features: "Dostępność",
  key_features: "Funkcjonalności", performance_metrics: "Wydajność — wynik, źródło i data", success_metrics: "Wyniki biznesowe — wynik, źródło i data", user_feedback: "Opinie o projekcie — autor i firma", technical_metrics: "Pozostałe pomiary", frontend_technologies: "Technologie interfejsu", backend_technologies: "Technologie zaplecza", tools_and_services: "Narzędzia i usługi",
};

export default function ProjectCaseFields({ project }: { project?: Project }) {
  return <fieldset className="space-y-4 border-t border-[var(--p-border)] pt-5"><legend className="font-semibold">Opis realizacji i dowody</legend><p className="text-sm">Uzupełniaj wyłącznie potwierdzone informacje. W listach wpisuj jeden element w wierszu. Bez pomiarów pozostaw pola puste.</p>
    <input type="hidden" name="publishing_fields" value="1" />
    <label className="flex gap-3"><input type="checkbox" name="is_published" defaultChecked={project ? Boolean(project.is_published) : false} />Opublikuj projekt (wyłączone = szkic)</label>
    <label className="block">Kolejność — mniejsza liczba pojawia się wcześniej<input type="number" name="sort_order" min={0} max={10000} defaultValue={project?.sort_order || 0} className="block w-full p-3 rounded-xl bg-[var(--p-surface)] " /></label>
    {project?.slug && <p className="text-sm">Stały adres: /projekty/{project.slug}</p>}
    <details className="admin-case-details"><summary>Opis realizacji, film i dodatkowe informacje</summary>
    <ProjectVideoUpload />
    {[...caseTextFields, ...caseListFields].map(name => <div key={name}><label className="block text-sm mb-1" htmlFor={`case-${name}-${project?.id || "new"}`}>{labels[name]}</label><textarea id={`case-${name}-${project?.id || "new"}`} name={name} rows={3} maxLength={5000} defaultValue={Array.isArray(project?.[name]) ? (project[name] as string[]).join("\n") : project?.[name] as string || ""} className="w-full p-3 rounded-xl bg-[var(--p-surface)]  border border-[var(--p-border)]  text-[var(--p-text)] " /></div>)}
    </details>
  </fieldset>;
}
