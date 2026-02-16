import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { getSiteSettings } from "@/actions/settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([
    auth(),
    getSiteSettings(),
  ]);

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
      <AdminLayoutClient logoUrl={settings.logoUrl}>
        {children}
      </AdminLayoutClient>
    </SessionProvider>
  );
}
