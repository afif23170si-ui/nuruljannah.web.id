import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar, AdminHeader } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect ke login jika belum login
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect jika role JAMAAH (bukan pengurus)
  if (session.user.role === "JAMAAH") {
    redirect("/");
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-muted/30">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="lg:pl-64 transition-all duration-300">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
