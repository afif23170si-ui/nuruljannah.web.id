// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import UserForm from "@/components/admin/UserForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
          title="Tambah User Baru" 
          description="Buat akun pengguna baru dengan role yang sesuai"
          breadcrumbs={[
              { label: "Dashboard", href: "/admin" },
              { label: "Users", href: "/admin/users" },
              { label: "Buat Baru" }
          ]}
        />
      <UserForm />
    </div>
  );
}
