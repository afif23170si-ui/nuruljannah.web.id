// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { getSiteSettings } from "@/actions/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Pengaturan Website" 
        description="Kelola informasi masjid, kontak, sosmed, dan rekening donasi"
      />

      {/* Settings Form */}
      <SettingsForm settings={settings} />
    </div>
  );
}
