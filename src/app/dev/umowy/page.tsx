import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../admin/admin.css";
import ContractsPreview from "./ContractsPreview";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Development-only: the admin "Umowy" tab without logging in (no data is read or saved). */
export default function ContractsDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <div className="admin-site"><main className="admin-dashboard"><ContractsPreview /></main></div>;
}
