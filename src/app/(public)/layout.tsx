import { Header, Footer } from "@/components/layout";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { getActiveAnnouncements } from "@/actions/announcement";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [announcements, session] = await Promise.all([
    getActiveAnnouncements(),
    auth(),
  ]);

  return (
    <SessionProvider session={session}>
      <div className="relative flex min-h-screen flex-col">
        <AnnouncementBanner announcements={announcements} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
