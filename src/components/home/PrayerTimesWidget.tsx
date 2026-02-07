"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Loader2 } from "lucide-react";

// Masjid Nurul Jannah coordinates (Dumai Timur, Riau)
const MASJID_COORDINATES = {
  latitude: 1.6637656782492023,
  longitude: 101.46989980345897,
};

// Calculation method: 20 = Kementerian Agama Indonesia
const CALCULATION_METHOD = 20;

// Fallback prayer times (used if API fails)
const fallbackPrayerTimes = [
  { name: "Shubuh", time: "04:30" },
  { name: "Dzuhur", time: "12:00" },
  { name: "Ashar", time: "15:15" },
  { name: "Maghrib", time: "18:00" },
  { name: "Isya", time: "19:15" },
];

interface PrayerTime {
  name: string;
  time: string;
}

interface PrayerInfo {
  name: string;
  time: string;
  timeInMinutes: number;
}

interface PrayerTimesWidgetProps {
  location?: string;
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getCurrentSeconds(): number {
  return new Date().getSeconds();
}

// Format time from API (remove seconds if present, e.g., "04:30 (WIB)" -> "04:30")
function formatApiTime(time: string): string {
  // Extract just HH:MM from the time string
  const match = time.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : time;
}

export function PrayerTimesWidget({ location = "Dumai, Riau" }: PrayerTimesWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState<PrayerInfo | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(fallbackPrayerTimes);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchDate, setLastFetchDate] = useState<string>("");

  // Fetch prayer times from Aladhan API
  const fetchPrayerTimes = useCallback(async () => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];

    // Only fetch once per day
    if (dateString === lastFetchDate) {
      return;
    }

    try {
      setIsLoading(true);
      const { latitude, longitude } = MASJID_COORDINATES;
      const url = `https://api.aladhan.com/v1/timings/${Math.floor(today.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=${CALCULATION_METHOD}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch prayer times");
      }

      const data = await response.json();
      const timings = data.data.timings;

      const newPrayerTimes: PrayerTime[] = [
        { name: "Shubuh", time: formatApiTime(timings.Fajr) },
        { name: "Dzuhur", time: formatApiTime(timings.Dhuhr) },
        { name: "Ashar", time: formatApiTime(timings.Asr) },
        { name: "Maghrib", time: formatApiTime(timings.Maghrib) },
        { name: "Isya", time: formatApiTime(timings.Isha) },
      ];

      setPrayerTimes(newPrayerTimes);
      setLastFetchDate(dateString);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      // Keep using fallback times if fetch fails
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchDate]);

  // Calculate next prayer and countdown
  const calculatePrayerStates = useCallback(() => {
    const nowMinutes = getCurrentTimeInMinutes();
    const nowSeconds = getCurrentSeconds();

    // Convert prayer times to minutes for comparison
    const prayers: PrayerInfo[] = prayerTimes.map((p) => ({
      ...p,
      timeInMinutes: parseTimeToMinutes(p.time),
    }));

    // Find next prayer
    let next = prayers[0]; // Default to Shubuh (next day)
    let foundNext = false;
    for (let i = 0; i < prayers.length; i++) {
      if (nowMinutes < prayers[i].timeInMinutes) {
        next = prayers[i];
        foundNext = true;
        break;
      }
    }

    // Calculate countdown in seconds
    let diffMinutes: number;
    if (foundNext) {
      diffMinutes = next.timeInMinutes - nowMinutes;
    } else {
      // Next prayer is Shubuh tomorrow
      diffMinutes = 24 * 60 - nowMinutes + next.timeInMinutes;
    }

    // Convert to seconds and subtract current seconds
    const totalSeconds = Math.max(0, diffMinutes * 60 - nowSeconds);

    setNextPrayer(next);
    setCountdown(formatCountdown(totalSeconds));
  }, [prayerTimes]);

  // Update current time display
  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    const timeStr = now
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\./g, ":");

    const dateStr = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    setCurrentTime(`${timeStr} | ${dateStr}`);
  }, []);

  // Initial fetch and setup intervals
  useEffect(() => {
    setMounted(true);
    fetchPrayerTimes();
    calculatePrayerStates();
    updateCurrentTime();

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      calculatePrayerStates();
      updateCurrentTime();
    }, 1000);

    // Check for new day every minute to refetch prayer times
    const fetchInterval = setInterval(() => {
      fetchPrayerTimes();
    }, 60000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(fetchInterval);
    };
  }, [fetchPrayerTimes, calculatePrayerStates, updateCurrentTime]);

  if (!mounted) return null;

  return (
    <div className="w-full md:w-auto">
      {/* Crystal Clear Box Container - Solid White to Match Notch */}
      <div className="relative bg-white rounded-[15px] p-4 md:p-6 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/50 w-full md:w-[320px] flex flex-col gap-4 md:gap-6">
        
        {/* Header: Location & Date */}
        <div className="flex items-start justify-between border-b border-emerald-900/10 pb-3 md:pb-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-1.5 text-emerald-800/80">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-bold tracking-wider uppercase">Lokasi</span>
             </div>
             <span className="text-sm font-medium text-emerald-950 tracking-tight">{location}</span>
          </div>
          <div className="text-right">
             <span className="block text-xs font-bold text-emerald-800/60 uppercase tracking-wide">
              {currentTime.split("|")[1]}
            </span>
             <span className="block text-lg font-mono font-medium tracking-tight text-emerald-950 tabular-nums leading-none mt-1">
              {currentTime.split("|")[0]}
            </span>
          </div>
        </div>

        {/* Main: Countdown */}
        <div className="flex flex-col items-center justify-center py-1 md:py-2">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-800/60 mb-1 md:mb-2">
              Menuju {nextPrayer?.name}
            </span>
            <span className="text-4xl md:text-5xl font-mono font-medium tracking-tighter text-emerald-950 tabular-nums drop-shadow-sm">
              {countdown}
            </span>
        </div>

        {/* Footer: Prayer Grid */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-4 text-emerald-800/60 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Memuat...</span>
            </div>
          ) : (
            prayerTimes.map((prayer) => {
              const isNext = prayer.name === nextPrayer?.name;
              return (
                <div
                  key={prayer.name}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300",
                    isNext
                      ? "bg-emerald-600 shadow-md shadow-emerald-900/10"
                      : "bg-emerald-50/50 hover:bg-emerald-100/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider mb-0.5",
                      isNext ? "text-white/90" : "text-emerald-900/40"
                    )}
                  >
                    {prayer.name}
                  </span>
                  <span className={cn("text-sm font-semibold", isNext ? "text-white" : "text-emerald-950")}>
                    {prayer.time}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
