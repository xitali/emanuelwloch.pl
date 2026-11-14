import ConversionSummary from "@/components/ConversionSummary";
import EmailStatus from "@/components/EmailStatus";
import AdminAppManager from "@/components/AdminAppManager";
import AdminDashboard, { type AdminTab } from "@/components/admin/AdminDashboard";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getContactMessages, getPageVisitsCount, getAdminProjects, getServices, getTestimonials, getPageVisitsStats } from "@/lib/turso";

export const revalidate = 0; // Dynamic route for admin panel

const TABS: AdminTab[] = ["overview", "messages", "projects", "services", "testimonials", "analytics"];

interface AdminPageProps {
  searchParams: Promise<{
    tab?: string;
    message?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    redirect("/admin/login");
  }
  const params = await searchParams;

  const [messages, visitsCount, projects, services, testimonials, analytics] = await Promise.all([
    getContactMessages(),
    getPageVisitsCount(),
    getAdminProjects(),
    getServices(),
    getTestimonials(),
    getPageVisitsStats(),
  ]);

  // Push notifications open a message with ?tab=messages&message=<id>.
  const initialTab = TABS.find(tab => tab === params.tab) ?? (params.message ? "messages" : "overview");

  return (
    <AdminDashboard
      summary={<div className="admin-status-grid"><EmailStatus /><ConversionSummary /></div>}
      tools={<AdminAppManager />}
      messages={messages}
      visitsCount={visitsCount}
      projects={projects}
      services={services}
      testimonials={testimonials}
      analytics={analytics}
      initialTab={initialTab}
      initialMessageId={params.message}
    />
  );
}
