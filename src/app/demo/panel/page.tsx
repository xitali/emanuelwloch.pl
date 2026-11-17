import type { Metadata, Viewport } from "next";
import "@/app/admin/admin.css";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { DEMO_NOW, demoAnalytics, demoMessages, demoVisitsTotal } from "@/lib/admin/demo";
import { getProjects } from "@/lib/data/projects";
import { getServices } from "@/lib/data/services";
import { getTestimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Demo panelu administracyjnego",
  description: "Zobacz, jak wygląda panel do zarządzania stroną: realizacje, ceny, wiadomości od klientów i statystyki. Wersja demonstracyjna bez zapisu zmian.",
  alternates: { canonical: "/demo/panel" },
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#0b0d0f" };

/** Public, read-only demo of the owner panel. Uses only public data plus fictional messages and traffic. */
export default async function PanelDemoPage() {
  const [projects, services, testimonials] = await Promise.all([getProjects(), getServices(), getTestimonials()]);
  return <div className="admin-site">
    <AdminDashboard demo now={DEMO_NOW} messages={demoMessages} visitsCount={demoVisitsTotal} projects={projects} services={services} testimonials={testimonials} analytics={demoAnalytics} />
  </div>;
}
