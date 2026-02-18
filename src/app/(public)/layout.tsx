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

  const fullAddress = [
    settings.address,
    settings.village,
    settings.district,
    settings.city,
    settings.province,
    settings.postalCode,
  ].filter(Boolean).join(", ");

  return (
    <SessionProvider session={session}>
      <div className="relative flex min-h-screen flex-col">
        <AnnouncementBanner announcements={announcements} />
        <Header logoUrl={settings.logoUrl} mosqueName={settings.mosqueName} />
        <main className="flex-1">{children}</main>
        <Footer 
          logoUrl={settings.logoUrl} 
          mosqueName={settings.mosqueName}
          address={fullAddress || settings.address}
          phone={settings.phone}
          whatsapp={settings.whatsapp}
          email={settings.email}
          contacts={settings.contacts as Array<{ label: string; phone: string; link?: string }> | null}
        />
      </div>
    </SessionProvider>
  );
}
