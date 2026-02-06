import { Metadata } from "next";
import { TeacherForm } from "@/components/admin/tpa/TeacherForm";

export const metadata: Metadata = {
  title: "Tambah Pengajar",
  description: "Form tambah data pengajar baru",
};

export default function NewTeacherPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Pengajar Baru</h1>
        <p className="text-muted-foreground">
          Masukkan data lengkap untuk asatidz baru
        </p>
      </div>
      <TeacherForm />
    </div>
  );
}
