import SeoServicePage, { createServiceMetadata } from "@/components/SeoServicePage";
import { getServicePage } from "@/lib/service-pages";

const data = getServicePage("bazy-danych-i-panele")!;

export const metadata = createServiceMetadata(data);

export default function DatabasesPage() {
  return <SeoServicePage data={data} />;
}
