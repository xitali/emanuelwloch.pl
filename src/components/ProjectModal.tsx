"use client";

import { projectLabel } from "@/lib/project-labels";
import type { Project } from "@/types";
import Image from "next/image";
import ProjectMedia from "./portfolio/ProjectMedia";
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { getProjectPath } from "@/lib/seo";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  dark?: boolean;
}

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch { return value.split(",").map(item => item.trim()).filter(Boolean); }
}

export default function ProjectModal({ project, onClose, dark = false }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const imageTrigger = useRef<HTMLElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  useBodyScrollLock(Boolean(project));
  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => { previouslyFocused?.focus(); };
  }, [project, onClose]);
  if (!project || typeof document === "undefined") return null;
  const images = parseArray(project.images);
  const technologies = parseArray(project.technologies);
  const features = parseArray(project.key_features);
  const metrics = parseArray(project.technical_metrics);
  const openImage = (index: number) => {
    imageTrigger.current = document.activeElement as HTMLElement;
    setSelectedImage(index);
    dialogRef.current?.querySelector<HTMLButtonElement>(".project-dialog-close")?.focus();
  };
  const closeImage = () => {
    setSelectedImage(null);
    requestAnimationFrame(() => imageTrigger.current?.focus());
  };
  const dismiss = () => selectedImage === null ? onClose() : closeImage();
  const moveImage = (direction: number) => setSelectedImage(index => index === null ? null : (index + direction + images.length) % images.length);

  return createPortal(<div className={`portfolio-project-dialog${dark ? " dark" : ""}`} onMouseDown={event => { if (event.target === event.currentTarget) dismiss(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={selectedImage !== null ? `Galeria: ${project.title}` : undefined} aria-labelledby={selectedImage === null ? "project-dialog-title" : undefined} tabIndex={-1} className="project-dialog-panel" onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismiss(); return; }
      if (selectedImage !== null && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); moveImage(event.key === "ArrowRight" ? 1 : -1); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(element => !element.closest("[hidden]"));
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
      <div className="project-dialog-bar"><span className="portfolio-kicker">{selectedImage === null ? "EW / WYBRANA REALIZACJA" : "EW / GALERIA PROJEKTU"}</span><button type="button" onClick={dismiss} aria-label={selectedImage === null ? "Zamknij modal" : "Zamknij podgląd zdjęcia"} className="project-dialog-close"><X size={20} /></button></div>
      {selectedImage !== null && <div className="project-image-viewer">
        <div className="project-image-full"><Image src={images[selectedImage]} alt={project.image_alts?.[selectedImage] || `${project.title} — zdjęcie ${selectedImage + 1} z ${images.length}`} fill sizes="(max-width: 767px) 95vw, 960px" className="object-contain" /></div>
        <div className="project-image-controls">{images.length > 1 && <button className="project-dialog-close" onClick={() => moveImage(-1)} aria-label="Poprzednie zdjęcie"><ChevronLeft size={20} /></button>}<span aria-live="polite">Zdjęcie {selectedImage + 1} z {images.length}</span>{images.length > 1 && <button className="project-dialog-close" onClick={() => moveImage(1)} aria-label="Następne zdjęcie"><ChevronRight size={20} /></button>}<a className="portfolio-text-link" href={images[selectedImage]} target="_blank" rel="noopener noreferrer">Oryginał <ArrowUpRight size={16} /></a></div>
      </div>}
      <div className="project-dialog-body" hidden={selectedImage !== null}>
        <header className="project-dialog-heading">
          <div className="project-dialog-meta"><span>{projectLabel(project.project_type || project.category)}</span>{project.completion_date && <span>Ukończono {project.completion_date}</span>}</div>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p>{project.short_description}</p>
        </header>
        {images.length > 0 && <div className="project-dialog-gallery">{images.map((src, i) => <figure key={`${src}-${i}`}>{i === 0 ? <ProjectMedia alt={project.image_alts?.[0]} previewVideo={project.preview_video} previewPoster={project.preview_poster} projectId={project.id} image={src} title={project.title} onOpen={() => openImage(i)} /> : <button type="button" className="project-gallery-image" aria-label={`Powiększ zdjęcie ${i + 1}: ${project.title}`} onClick={() => openImage(i)}><Image src={src} alt={project.image_alts?.[i] || `${project.title} — ekran ${i + 1}`} fill sizes="(max-width: 767px) 90vw, 450px" className="object-contain" /><span className="project-gallery-zoom"><Maximize2 size={18} /></span></button>}</figure>)}</div>}
        <div className="project-dialog-actions">
          <Link className="portfolio-button" href={getProjectPath(project)}>Pełny opis realizacji<ArrowUpRight size={16} /></Link>
        </div>
        {project.detailed_description && <section className="project-dialog-section"><h3>O projekcie</h3><p>{project.detailed_description}</p></section>}
        {features.length > 0 && <section className="project-dialog-section"><h3>Funkcjonalności</h3><ul className="project-dialog-features">{features.map((feature, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{feature}</li>)}</ul></section>}
        {technologies.length > 0 && <section className="project-dialog-section"><h3>Technologie</h3><div className="portfolio-tags">{technologies.map((tech, i) => <span key={i}>{tech}</span>)}</div></section>}
        {(project.innovation || metrics.length > 0) && <section className="project-dialog-section"><h3>Rozwiązania i rezultaty</h3>{project.innovation && <p>{project.innovation}</p>}{metrics.length > 0 && <ul className="project-dialog-results">{metrics.map((metric, i) => <li key={i}>{metric}</li>)}</ul>}</section>}
      </div>
    </div>
  </div>, document.body);
}
