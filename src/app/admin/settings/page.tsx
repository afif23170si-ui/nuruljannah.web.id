// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { getSiteSettings } from "@/actions/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-emerald-600" />
          Pengaturan
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi masjid, kontak, dan rekening donasi
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm settings={settings} />
    </div>
  );
}
