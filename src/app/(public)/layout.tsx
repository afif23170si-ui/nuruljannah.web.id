import { Header, Footer } from "@/components/layout";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { getActiveAnnouncements } from "@/actions/announcement";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcements = await getActiveAnnouncements();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnnouncementBanner announcements={announcements} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
