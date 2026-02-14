import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/actions/admin";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Agenda",
  description: "Edit agenda kegiatan masjid",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Agenda</h1>
        <p className="text-muted-foreground">
          Perbarui agenda kegiatan masjid
        </p>
      </div>
      <EventForm initialData={event} />
    </div>
  );
}
