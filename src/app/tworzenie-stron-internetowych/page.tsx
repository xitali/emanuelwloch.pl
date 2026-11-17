import SeoServicePage, { createServiceMetadata } from "@/components/portfolio/SeoServicePage";
import { getServicePage } from "@/lib/content/service-pages";

const data = getServicePage("tworzenie-stron-internetowych")!;

export const metadata = createServiceMetadata(data);

export default function WebsitesPage() {
  return <SeoServicePage data={data} />;
}
