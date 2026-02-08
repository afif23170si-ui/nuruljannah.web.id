// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ClassForm } from "@/components/admin/tpa/ClassForm";
import { getTeachers } from "@/actions/tpa";

interface EditClassPageProps {
  params: {
    id: string;
  };
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const [cls, teachers] = await Promise.all([
    prisma.tpaClass.findUnique({
      where: { id: params.id },
    }),
    getTeachers(),
  ]);

  if (!cls) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Data Kelas</h1>
        <p className="text-muted-foreground">
          Perbarui informasi kelas dan jadwal
        </p>
      </div>
      <ClassForm initialData={cls} teachers={teachers} isEditing />
    </div>
  );
}
