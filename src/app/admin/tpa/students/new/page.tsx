// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { StudentForm } from "@/components/admin/tpa/StudentForm";
import { getClasses } from "@/actions/tpa";

export const metadata: Metadata = {
  title: "Daftar Santri Baru",
  description: "Form pendaftaran santri baru TPA",
};

export default async function NewStudentPage() {
  const classes = await getClasses();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pendaftaran Santri Baru</h1>
        <p className="text-muted-foreground">
          Masukkan data lengkap calon santri
        </p>
      </div>
      <StudentForm classes={classes} />
    </div>
  );
}
