import SeoServicePage, { createServiceMetadata } from "@/components/portfolio/SeoServicePage";
import { getServicePage } from "@/lib/content/service-pages";

const data = getServicePage("nextjs-developer")!;

export const metadata = createServiceMetadata(data);

export default function NextDeveloperPage() {
  return <SeoServicePage data={data} />;
}
