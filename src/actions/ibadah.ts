"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
import type { OfficerRole, PrayerTime } from "@prisma/client";

// ============================
// PRAYER TIME SETTINGS
// ============================

export async function getPrayerTimeSettings() {
  let settings = await prisma.prayerTimeSetting.findFirst();

  if (!settings) {
    // Get lat/lng from site settings as defaults
    const site = await prisma.siteSettings.findFirst();
    settings = await prisma.prayerTimeSetting.create({
      data: {
        latitude: site?.latitude ?? -6.2,
        longitude: site?.longitude ?? 106.816666,
      },
    });
  }

  return settings;
}

export async function updatePrayerTimeSettings(data: {
  method?: number;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  fajrOffset?: number;
  dhuhrOffset?: number;
  asrOffset?: number;
  maghribOffset?: number;
  ishaOffset?: number;
}) {
  const settings = await getPrayerTimeSettings();

  const updated = await prisma.prayerTimeSetting.update({
    where: { id: settings.id },
    data,
  });

  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  revalidatePath("/");
  return updated;
}

// Public cached version
export const getPrayerTimeSettingsPublic = unstable_cache(
  async () => {
    return getPrayerTimeSettings();
  },
  ["prayer-time-settings-public"],
  { revalidate: 3600 }
);

// ============================
// PRAYER OFFICERS
// ============================

export async function getPrayerOfficers(role?: OfficerRole) {
  return prisma.prayerOfficer.findMany({
    where: {
      ...(role ? { role } : {}),
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getAllPrayerOfficers() {
  return prisma.prayerOfficer.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function getPrayerOfficer(id: string) {
  return prisma.prayerOfficer.findUnique({ where: { id } });
}

export async function createPrayerOfficer(data: {
  name: string;
  phone?: string;
  role: OfficerRole;
  notes?: string;
}) {
  const officer = await prisma.prayerOfficer.create({ data });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  return officer;
}

export async function updatePrayerOfficer(
  id: string,
  data: {
    name?: string;
    phone?: string;
    role?: OfficerRole;
    isActive?: boolean;
    notes?: string;
  }
) {
  const officer = await prisma.prayerOfficer.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  return officer;
}

export async function deletePrayerOfficer(id: string) {
  await prisma.prayerOfficer.delete({ where: { id } });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
}

// ============================
// OFFICER SCHEDULES (Weekly)
// ============================

// Get all schedules for a specific day
export async function getSchedulesByDay(dayOfWeek: number) {
  return prisma.officerSchedule.findMany({
    where: { dayOfWeek },
    include: { officer: true },
    orderBy: { prayer: "asc" },
  });
}

// Get the full weekly schedule (all 7 days)
export async function getFullWeeklySchedule() {
  return prisma.officerSchedule.findMany({
    include: { officer: true },
    orderBy: [{ dayOfWeek: "asc" }, { prayer: "asc" }, { role: "asc" }],
  });
}

// Upsert a schedule slot (create or update)
export async function upsertOfficerSchedule(data: {
  dayOfWeek: number;
  prayer: PrayerTime;
  role: OfficerRole;
  officerId: string;
  notes?: string;
}) {
  const schedule = await prisma.officerSchedule.upsert({
    where: {
      dayOfWeek_prayer_role: {
        dayOfWeek: data.dayOfWeek,
        prayer: data.prayer,
        role: data.role,
      },
    },
    update: {
      officerId: data.officerId,
      notes: data.notes,
    },
    create: data,
    include: { officer: true },
  });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  return schedule;
}

export async function deleteOfficerSchedule(id: string) {
  await prisma.officerSchedule.delete({ where: { id } });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
}

// ============================
// KHUTBAH
// ============================

export async function getKhutbahList(options?: {
  limit?: number;
  offset?: number;
}) {
  return prisma.khutbah.findMany({
    orderBy: { date: "desc" },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
  });
}

export async function getKhutbah(id: string) {
  return prisma.khutbah.findUnique({ where: { id } });
}

export async function getUpcomingKhutbah() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.khutbah.findFirst({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
  });
}

export async function createKhutbah(data: {
  date: Date;
  khatib: string;
  muadzin?: string;
  title: string;
  theme?: string;
  summary?: string;
  audioUrl?: string;
}) {
  const khutbah = await prisma.khutbah.create({ data });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  return khutbah;
}

export async function updateKhutbah(
  id: string,
  data: {
    date?: Date;
    khatib?: string;
    muadzin?: string;
    title?: string;
    theme?: string;
    summary?: string;
    audioUrl?: string;
  }
) {
  const khutbah = await prisma.khutbah.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
  return khutbah;
}

export async function deleteKhutbah(id: string) {
  await prisma.khutbah.delete({ where: { id } });
  revalidatePath("/admin/ibadah");
  revalidatePath("/ibadah");
}

// ============================
// PUBLIC COMBINED FETCH
// ============================

export const getIbadahPublicData = unstable_cache(
  async () => {
    const [prayerSettings, officers, upcomingKhutbah, recentKhutbah, weeklySchedule] =
      await Promise.all([
        getPrayerTimeSettings(),
        prisma.prayerOfficer.findMany({
          where: { isActive: true },
          orderBy: [{ role: "asc" }, { name: "asc" }],
        }),
        getUpcomingKhutbah(),
        prisma.khutbah.findMany({
          orderBy: { date: "desc" },
          take: 5,
        }),
        prisma.officerSchedule.findMany({
          include: { officer: true },
          orderBy: [{ dayOfWeek: "asc" }, { prayer: "asc" }, { role: "asc" }],
        }),
      ]);

    return {
      prayerSettings,
      officers,
      upcomingKhutbah,
      recentKhutbah,
      weeklySchedule,
    };
  },
  ["ibadah-public-data"],
  { revalidate: 300 }
);

