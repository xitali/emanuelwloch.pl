import SeoServicePage, { createServiceMetadata } from "@/components/portfolio/SeoServicePage";
import { getServicePage } from "@/lib/content/service-pages";

const data = getServicePage("programy-na-windows")!;

export const metadata = createServiceMetadata(data);

export default function WindowsProgramsPage() {
  return <SeoServicePage data={data} />;
}
