import { Metadata } from "next";
import { ClassForm } from "@/components/admin/tpa/ClassForm";
import { getTeachers } from "@/actions/tpa";

export const metadata: Metadata = {
  title: "Tambah Kelas",
  description: "Form tambah data kelas baru",
};

export default async function NewClassPage() {
  const teachers = await getTeachers();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Kelas Baru</h1>
        <p className="text-muted-foreground">
          Atur kelas dan jadwal pembelajaran baru
        </p>
      </div>
      <ClassForm teachers={teachers} />
    </div>
  );
}
