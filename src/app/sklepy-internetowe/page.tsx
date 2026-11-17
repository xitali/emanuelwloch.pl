import SeoServicePage, { createServiceMetadata } from "@/components/portfolio/SeoServicePage";
import { getServicePage } from "@/lib/content/service-pages";

const data = getServicePage("sklepy-internetowe")!;

export const metadata = createServiceMetadata(data);

export default function EcommercePage() {
  return <SeoServicePage data={data} />;
}
