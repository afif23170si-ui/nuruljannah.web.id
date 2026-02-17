export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { getAllDkmMembers } from "@/actions/dkm";
import { DkmAdminClient } from "./DkmAdminClient";

export const metadata: Metadata = {
  title: "Struktur DKM - Admin",
  description: "Kelola susunan pengurus Dewan Kemakmuran Masjid",
};

export default async function DkmAdminPage() {
  const members = await getAllDkmMembers();

  return (
    <div className="animate-fade-in">
      <AdminPageHeader
        title="Struktur DKM"
        description="Kelola susunan pengurus Dewan Kemakmuran Masjid"
      />
      <DkmAdminClient members={members} />
    </div>
  );
}
