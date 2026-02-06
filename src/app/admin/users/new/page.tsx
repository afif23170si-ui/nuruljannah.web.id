import UserForm from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah User Baru</h1>
        <p className="text-muted-foreground mt-1">
          Buat akun pengguna baru dengan role yang sesuai
        </p>
      </div>
      <UserForm />
    </div>
  );
}
