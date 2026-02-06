import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TeacherForm } from "@/components/admin/tpa/TeacherForm";

interface EditTeacherPageProps {
  params: {
    id: string;
  };
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  const teacher = await prisma.tpaTeacher.findUnique({
    where: { id: params.id },
  });

  if (!teacher) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Data Pengajar</h1>
        <p className="text-muted-foreground">
          Perbarui informasi asatidz
        </p>
      </div>
      <TeacherForm initialData={teacher} isEditing />
    </div>
  );
}
