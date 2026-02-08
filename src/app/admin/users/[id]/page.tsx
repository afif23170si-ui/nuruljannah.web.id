// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getUserById } from "@/actions/users";
import UserForm from "@/components/admin/UserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground mt-1">
          Perbarui informasi user: {user.name}
        </p>
      </div>
      <UserForm user={user} />
    </div>
  );
}
