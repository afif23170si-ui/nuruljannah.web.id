"use server";

import prisma from "@/lib/prisma";

const MYQURAN_BASE = "https://api.myquran.com/v3";

interface MyQuranJadwalResponse {
  status: boolean;
  data: {
    id: string;
    kabko: string;
    prov: string;
    jadwal: Record<
      string,
      {
        tanggal: string;
        imsak: string;
        subuh: string;
        terbit: string;
        dhuha: string;
        dzuhur: string;
        ashar: string;
        maghrib: string;
        isya: string;
      }
    >;
  };
}

interface MyQuranCalResponse {
  status: boolean;
  data: {
    method: string;
    adjustment: number;
    ce: {
      today: string;
      day: number;
      dayName: string;
      month: number;
      monthName: string;
      year: number;
    };
    hijr: {
      today: string;
      day: number;
      dayName: string;
      month: number;
      monthName: string;
      year: number;
    };
  };
}

/**
 * Format date to YYYY-MM-DD string in Asia/Jakarta timezone
 */
function formatDateString(date: Date): string {
  return date
    .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    .split("T")[0]; // en-CA gives YYYY-MM-DD format
}

/**
 * Fetch prayer times from myQuran API for a specific date
 */
async function fetchJadwalSholat(
  cityCode: string,
  dateStr: string
): Promise<MyQuranJadwalResponse> {
  const url = `${MYQURAN_BASE}/sholat/jadwal/${cityCode}/${dateStr}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`myQuran Sholat API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.status) {
    throw new Error(`myQuran Sholat API returned error: ${data.message}`);
  }

  return data;
}

/**
 * Fetch Hijriah calendar from myQuran API for a specific date
 */
async function fetchHijriCalendar(
  dateStr: string
): Promise<MyQuranCalResponse> {
  const url = `${MYQURAN_BASE}/cal/hijr/${dateStr}?adj=-1`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`myQuran Calendar API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.status) {
    throw new Error(`myQuran Calendar API returned error: ${data.message}`);
  }

  return data;
}

/**
 * Sync prayer times for a specific date.
 * Fetches from myQuran (jadwal sholat + kalender hijriah) and upserts to DB.
 */
export async function syncPrayerTimesForDate(dateStr: string) {
  // Get city code from settings
  const settings = await prisma.prayerTimeSetting.findFirst();
  const cityCode =
    settings?.cityCode ?? "93db85ed909c13838ff95ccfa94cebd9";

  // Fetch both APIs in parallel
  const [jadwalRes, calRes] = await Promise.allSettled([
    fetchJadwalSholat(cityCode, dateStr),
    fetchHijriCalendar(dateStr),
  ]);

  if (jadwalRes.status === "rejected") {
    throw new Error(
      `Failed to fetch jadwal sholat: ${jadwalRes.reason}`
    );
  }

  const jadwalData = jadwalRes.value;
  const jadwal = jadwalData.data.jadwal[dateStr];

  if (!jadwal) {
    throw new Error(
      `No jadwal data found for date: ${dateStr}`
    );
  }

  // Hijriah calendar (optional — don't fail if unavailable)
  let hijriData: MyQuranCalResponse["data"]["hijr"] | null = null;
  if (calRes.status === "fulfilled") {
    hijriData = calRes.value.data.hijr;
  }

  // Parse the date string to a Date object for DB storage
  const dateObj = new Date(dateStr + "T00:00:00.000Z");

  // Upsert into database
  const result = await prisma.dailyPrayerTime.upsert({
    where: { date: dateObj },
    update: {
      imsak: jadwal.imsak,
      subuh: jadwal.subuh,
      terbit: jadwal.terbit,
      dhuha: jadwal.dhuha,
      dzuhur: jadwal.dzuhur,
      ashar: jadwal.ashar,
      maghrib: jadwal.maghrib,
      isya: jadwal.isya,
      hijriDay: hijriData?.day ?? null,
      hijriMonth: hijriData?.month ?? null,
      hijriMonthName: hijriData?.monthName ?? null,
      hijriYear: hijriData?.year ?? null,
      hijriDayName: hijriData?.dayName ?? null,
      hijriFullDate: hijriData
        ? `${hijriData.day} ${hijriData.monthName} ${hijriData.year} H`
        : null,
      fetchedAt: new Date(),
    },
    create: {
      date: dateObj,
      imsak: jadwal.imsak,
      subuh: jadwal.subuh,
      terbit: jadwal.terbit,
      dhuha: jadwal.dhuha,
      dzuhur: jadwal.dzuhur,
      ashar: jadwal.ashar,
      maghrib: jadwal.maghrib,
      isya: jadwal.isya,
      hijriDay: hijriData?.day ?? null,
      hijriMonth: hijriData?.month ?? null,
      hijriMonthName: hijriData?.monthName ?? null,
      hijriYear: hijriData?.year ?? null,
      hijriDayName: hijriData?.dayName ?? null,
      hijriFullDate: hijriData
        ? `${hijriData.day} ${hijriData.monthName} ${hijriData.year} H`
        : null,
    },
  });

  return result;
}

/**
 * Main sync function — syncs today's prayer times.
 * Called by the cron job endpoint.
 */
export async function syncPrayerTimes() {
  const today = formatDateString(new Date());
  return syncPrayerTimesForDate(today);
}

/**
 * Get today's prayer times from the database.
 * If not found, triggers an on-demand sync as fallback.
 */
export async function getTodayPrayerTimesFromDB() {
  const today = formatDateString(new Date());
  const dateObj = new Date(today + "T00:00:00.000Z");

  let prayerTime = await prisma.dailyPrayerTime.findUnique({
    where: { date: dateObj },
  });

  // On-demand sync if not found in DB
  if (!prayerTime) {
    try {
      prayerTime = await syncPrayerTimesForDate(today);
    } catch (error) {
      console.error("On-demand prayer sync failed:", error);
      return null;
    }
  }

  return prayerTime;
}
