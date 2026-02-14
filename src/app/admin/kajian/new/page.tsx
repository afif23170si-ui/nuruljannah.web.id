import { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = {
  title: "Tambah Agenda",
  description: "Tambah agenda kegiatan masjid baru",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Agenda</h1>
        <p className="text-muted-foreground">
          Buat agenda kegiatan masjid baru
        </p>
      </div>
      <EventForm />
    </div>
  );
}
