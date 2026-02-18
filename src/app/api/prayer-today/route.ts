import { NextResponse } from "next/server";
import { getTodayPrayerTimesFromDB } from "@/lib/prayer-sync";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [prayerTime, settings] = await Promise.all([
      getTodayPrayerTimesFromDB(),
      prisma.prayerTimeSetting.findFirst(),
    ]);

    if (!prayerTime) {
      return NextResponse.json(
        {
          success: false,
          error: "Prayer times not available",
          fallback: true,
          data: null,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          date: prayerTime.date,
          imsak: prayerTime.imsak,
          subuh: prayerTime.subuh,
          terbit: prayerTime.terbit,
          dhuha: prayerTime.dhuha,
          dzuhur: prayerTime.dzuhur,
          ashar: prayerTime.ashar,
          maghrib: prayerTime.maghrib,
          isya: prayerTime.isya,
          hijri: prayerTime.hijriFullDate
            ? {
                day: prayerTime.hijriDay,
                month: prayerTime.hijriMonth,
                monthName: prayerTime.hijriMonthName,
                year: prayerTime.hijriYear,
                dayName: prayerTime.hijriDayName,
                fullDate: prayerTime.hijriFullDate,
              }
            : null,
          location: settings?.cityName ?? "KOTA DUMAI",
          iqamahOffsets: settings
            ? {
                fajr: settings.fajrOffset,
                dhuhr: settings.dhuhrOffset,
                asr: settings.asrOffset,
                maghrib: settings.maghribOffset,
                isha: settings.ishaOffset,
              }
            : null,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
