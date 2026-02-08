"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Loader2, Clock } from "lucide-react";

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
      day: "numeric",
      month: "short",
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
    <div className="w-full md:w-[280px]">
      {/* Modern Compact Card */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20 w-full flex flex-col gap-5">
        
        {/* Header: Next Prayer Highlight */}
        <div className="flex flex-col items-center justify-center pt-2">
            <div className="flex items-center gap-1.5 text-emerald-600/80 mb-2">
               <Clock className="w-3 h-3" />
               <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                 Menuju {nextPrayer?.name}
               </span>
            </div>
            
            <div className="relative">
              <span className="text-5xl font-mono font-medium tracking-tighter text-zinc-900 tabular-nums leading-none">
                {countdown}
              </span>
            </div>
            
            {/* Location & Real-time (Subtle) */}
            <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-400 font-medium">
               <span className="flex items-center gap-1">
                 <MapPin className="w-2.5 h-2.5" />
                 {location}
               </span>
               <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
               <span className="font-mono">{currentTime.split("|")[0]}</span>
            </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />

        {/* Footer: Compact Prayer List */}
        <div className="flex flex-col gap-0.5">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-zinc-400 gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs">Memuat...</span>
            </div>
          ) : (
            prayerTimes.map((prayer) => {
              const isNext = prayer.name === nextPrayer?.name;
              return (
                <div
                  key={prayer.name}
                  className={cn(
                    "flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-300",
                    isNext
                      ? "bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-100"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isNext ? "text-emerald-700" : "text-zinc-400"
                    )}
                  >
                    {prayer.name}
                  </span>
                  <span className={cn("text-xs font-mono font-medium", isNext ? "text-emerald-900" : "text-zinc-600")}>
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

