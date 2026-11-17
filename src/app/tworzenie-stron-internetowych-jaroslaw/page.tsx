import SeoServicePage, { createServiceMetadata } from "@/components/portfolio/SeoServicePage";
import { getServicePage } from "@/lib/content/service-pages";

const data = getServicePage("tworzenie-stron-internetowych-jaroslaw")!;

export const metadata = createServiceMetadata(data);

export default function JaroslawWebsitesPage() {
  return <SeoServicePage data={data} />;
}
