import ConversionSummary from "@/components/admin/ConversionSummary";
import EmailStatus from "@/components/admin/EmailStatus";
import AdminAppManager from "@/components/admin/AdminAppManager";
import AdminDashboard, { type AdminTab } from "@/components/admin/AdminDashboard";
import { verifyAdminSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { deliveriesFor } from "@/lib/email/deliveries";
import { getContactMessages } from "@/lib/data/messages";
import { getPageVisitsCount, getPageVisitsStats } from "@/lib/data/visits";
import { getAdminProjects } from "@/lib/data/projects";
import { getServices } from "@/lib/data/services";
import { getTestimonials } from "@/lib/data/testimonials";

export const revalidate = 0; // Dynamic route for admin panel

const TABS: AdminTab[] = ["overview", "messages", "projects", "services", "testimonials", "analytics", "contracts"];

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

  const [rawMessages, visitsCount, projects, services, testimonials, analytics] = await Promise.all([
    getContactMessages(),
    getPageVisitsCount(),
    getAdminProjects(),
    getServices(),
    getTestimonials(),
    getPageVisitsStats(),
  ]);

  // Delivery status from Resend webhooks; the table may not exist before migration 011.
  const deliveries = await deliveriesFor(rawMessages.map(m => m.id)).catch(() => ({} as Awaited<ReturnType<typeof deliveriesFor>>));
  const messages = rawMessages.map(m => ({ ...m, delivery: deliveries[m.id] }));

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
