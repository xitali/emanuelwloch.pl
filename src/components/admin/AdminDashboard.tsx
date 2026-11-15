"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { logoutAdminAction } from "@/app/actions/admin";
import { BrandMark } from "@/components/portfolio/icons";
import { isOpenMessage } from "@/lib/message-status";
import type { ContactMessage, Project, Service, Testimonial } from "@/types";
import { AdminProvider, useAdmin } from "./AdminContext";
import AnalyticsView from "./AnalyticsView";
import ContractsView from "./ContractsView";
import MessagesView from "./MessagesView";
import OverviewView from "./OverviewView";
import ProjectsView from "./ProjectsView";
import ServicesView from "./ServicesView";
import TestimonialsView from "./TestimonialsView";

export type AdminTab = "overview" | "messages" | "projects" | "services" | "testimonials" | "analytics" | "contracts";

export interface AdminDashboardProps {
  messages: ContactMessage[];
  visitsCount: number;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  analytics: { date: string; visits: number }[];
  initialTab?: AdminTab;
  initialMessageId?: string;
  /** Server-rendered status blocks (email, conversions) — owner panel only. */
  summary?: ReactNode;
  /** Extra tools such as the Android app manager — owner panel only. */
  tools?: ReactNode;
  demo?: boolean;
  /** Fixed "now" for the demo, so relative dates stay stable. */
  now?: number;
}

function Dashboard({ messages, visitsCount, projects, services, testimonials, analytics, initialTab = "overview", initialMessageId, summary, tools, now }: AdminDashboardProps) {
  const { demo, status } = useAdmin();
  const [tab, setTab] = useState<AdminTab>(initialTab);
  const [focusId, setFocusId] = useState(initialMessageId);
  const open = messages.filter(m => isOpenMessage(m.status)).length;
  const tabs: Array<{ id: AdminTab; label: string; count?: number }> = [
    { id: "overview", label: "Przegląd" },
    { id: "messages", label: "Wiadomości", count: open },
    { id: "projects", label: "Realizacje", count: projects.length },
    { id: "services", label: "Ceny usług" },
    { id: "testimonials", label: "Opinie", count: testimonials.length },
    { id: "analytics", label: "Ruch" },
    // Owner tool only: contract template with the 2026 limits.
    ...(demo ? [] : [{ id: "contracts" as const, label: "Umowy" }]),
  ];
  const openTab = (next: AdminTab, messageId?: string) => { setTab(next); setFocusId(messageId); };

  return <main className="admin-dashboard">
    <header className="admin-top">
      <Link href="/" className="admin-brand" aria-label="Emanuel Włoch — strona główna"><BrandMark size={24} />ew <span>/</span><small>{demo ? "Demo panelu" : "Panel"}</small></Link>
      <div className="admin-top-actions">
        <Link href={demo ? "/bazy-danych-i-panele" : "/"} className="admin-back"><ArrowLeft size={15} /> {demo ? "Wróć do oferty" : "Zobacz stronę"}</Link>
        {demo ? <Link href="/#kontakt" className="admin-primary">Chcę taki panel</Link> : <form action={logoutAdminAction}><button type="submit" className="admin-secondary">Wyloguj się</button></form>}
      </div>
    </header>

    {demo && <p className="admin-demo-note" role="note"><strong>Wersja demonstracyjna.</strong> Realizacje, ceny i opinie pochodzą ze strony. Wiadomości i statystyki są przykładowe. Możesz klikać wszystko — zmiany nie są zapisywane.</p>}

    <nav aria-label="Sekcje panelu" className="admin-tabs">{tabs.map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => openTab(item.id)}>{item.label}{item.count !== undefined && <span>{item.count}</span>}</button>)}</nav>

    {status && <div role="status" aria-live="polite" className="admin-toast"><CheckCircle className="w-4 h-4" /> {status}</div>}

    {tab === "overview" && <>
      <OverviewView messages={messages} projects={projects} testimonials={testimonials} analytics={analytics} onOpen={openTab} now={now} />
      {summary}
      {tools}
    </>}
    {tab === "messages" && <MessagesView messages={messages} focusId={focusId} />}
    {tab === "projects" && <ProjectsView projects={projects} />}
    {tab === "services" && <ServicesView services={services} />}
    {tab === "testimonials" && <TestimonialsView testimonials={testimonials} />}
    {tab === "analytics" && <AnalyticsView analytics={analytics} total={visitsCount} />}
    {tab === "contracts" && !demo && <ContractsView />}
  </main>;
}

export default function AdminDashboard(props: AdminDashboardProps) {
  return <AdminProvider demo={props.demo}><Dashboard {...props} /></AdminProvider>;
}
