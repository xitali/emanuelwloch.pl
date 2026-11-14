import SeoServicePage, { createServiceMetadata } from "@/components/SeoServicePage";
import { getServicePage } from "@/lib/service-pages";

const data = getServicePage("programy-na-windows")!;

export const metadata = createServiceMetadata(data);

export default function WindowsProgramsPage() {
  return <SeoServicePage data={data} />;
}
