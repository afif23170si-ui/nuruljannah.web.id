import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { StudentForm } from "@/components/admin/tpa/StudentForm";
import { getClasses } from "@/actions/tpa";

interface EditStudentPageProps {
  params: {
    id: string;
  };
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const [student, classes] = await Promise.all([
    prisma.tpaStudent.findUnique({
      where: { id: params.id },
    }),
    getClasses(),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Data Santri</h1>
        <p className="text-muted-foreground">
          Perbarui informasi santri
        </p>
      </div>
      <StudentForm initialData={student} classes={classes} isEditing />
    </div>
  );
}
