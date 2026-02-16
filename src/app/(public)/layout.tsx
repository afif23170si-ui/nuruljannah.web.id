import { Header, Footer } from "@/components/layout";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { getActiveAnnouncements } from "@/actions/announcement";
import { getSiteSettings } from "@/actions/settings";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [announcements, session, settings] = await Promise.all([
    getActiveAnnouncements(),
    auth(),
    getSiteSettings(),
  ]);

  return (
    <SessionProvider session={session}>
      <div className="relative flex min-h-screen flex-col">
        <AnnouncementBanner announcements={announcements} />
        <Header logoUrl={settings.mosqueLogo} mosqueName={settings.mosqueName} />
        <main className="flex-1">{children}</main>
        <Footer logoUrl={settings.mosqueLogo} mosqueName={settings.mosqueName} />
      </div>
    </SessionProvider>
  );
}
