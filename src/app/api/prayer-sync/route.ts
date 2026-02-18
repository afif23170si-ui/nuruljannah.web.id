import { NextRequest, NextResponse } from "next/server";
import { syncPrayerTimes } from "@/lib/prayer-sync";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET environment variable not set");
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  const token = authHeader?.replace("Bearer ", "");
  if (token !== cronSecret) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await syncPrayerTimes();

    return NextResponse.json({
      success: true,
      message: "Prayer times synced successfully",
      data: {
        date: result.date,
        imsak: result.imsak,
        subuh: result.subuh,
        dzuhur: result.dzuhur,
        ashar: result.ashar,
        maghrib: result.maghrib,
        isya: result.isya,
        hijri: result.hijriFullDate,
        fetchedAt: result.fetchedAt,
      },
    });
  } catch (error) {
    console.error("Prayer sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
