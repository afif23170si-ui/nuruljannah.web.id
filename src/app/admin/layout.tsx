import { SessionProvider } from "next-auth/react";
import { AdminSidebar, AdminHeader } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
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
