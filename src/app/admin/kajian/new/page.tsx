import { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export const metadata: Metadata = {
  title: "Tambah Agenda",
  description: "Tambah agenda kegiatan masjid baru",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Tambah Agenda" 
        description="Buat agenda kegiatan masjid baru"
        breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Agenda", href: "/admin/kajian" },
            { label: "Buat Baru" }
        ]}
      />
      <EventForm />
    </div>
  );
}
