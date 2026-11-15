"use client";
import { AdminProvider } from "@/components/admin/AdminContext";
import ContractsView from "@/components/admin/ContractsView";

export default function ContractsPreview() {
  return <AdminProvider><ContractsView /></AdminProvider>;
}
