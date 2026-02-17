export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import {
  getAllPrayerOfficers,
  getKhutbahList,
  getPrayerTimeSettings,
  getFullWeeklySchedule,
} from "@/actions/ibadah";
import { IbadahAdminClient } from "./IbadahAdminClient";

export const metadata: Metadata = {
  title: "Kelola Ibadah - Admin",
  description: "Kelola petugas shalat, jadwal, dan khutbah Jumat",
};

export default async function IbadahAdminPage() {
  const [officers, khutbahList, prayerSettings, weeklySchedule] = await Promise.all([
    getAllPrayerOfficers(),
    getKhutbahList(),
    getPrayerTimeSettings(),
    getFullWeeklySchedule(),
  ]);

  return (
    <div className="animate-fade-in">
      <AdminPageHeader
        title="Ibadah"
        description="Kelola petugas shalat, khutbah Jumat, dan pengaturan waktu shalat"
      />

      <IbadahAdminClient
        officers={officers}
        khutbahList={khutbahList}
        prayerSettings={prayerSettings}
        weeklySchedule={weeklySchedule}
      />
    </div>
  );
}
