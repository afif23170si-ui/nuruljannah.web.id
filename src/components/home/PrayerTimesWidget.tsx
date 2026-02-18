"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Loader2, Clock, ChevronDown, ChevronUp } from "lucide-react";

// Fallback prayer times (used if API fails)
const fallbackPrayerTimes = [
  { name: "Imsak", time: "04:20" },
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

interface PrayerApiResponse {
  success: boolean;
  data: {
    imsak: string;
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
    hijri: {
      fullDate: string;
    } | null;
    location: string;
  } | null;
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

export function PrayerTimesWidget() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState<PrayerInfo | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(fallbackPrayerTimes);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState("Kota Dumai");
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch prayer times from our own API (backed by database)
  const fetchPrayerTimes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/prayer-today");
      const result: PrayerApiResponse = await response.json();

      if (result.success && result.data) {
        const d = result.data;
        const newPrayerTimes: PrayerTime[] = [
          { name: "Imsak", time: d.imsak },
          { name: "Shubuh", time: d.subuh },
          { name: "Dzuhur", time: d.dzuhur },
          { name: "Ashar", time: d.ashar },
          { name: "Maghrib", time: d.maghrib },
          { name: "Isya", time: d.isya },
        ];

        setPrayerTimes(newPrayerTimes);
        setLocation(d.location);
        if (d.hijri?.fullDate) {
          setHijriDate(d.hijri.fullDate);
        }
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      // Keep using fallback times
    } finally {
      setIsLoading(false);
    }
  }, []);

  const prayerTimesRef = useRef(prayerTimes);
  prayerTimesRef.current = prayerTimes;

  // Calculate next prayer and countdown
  const calculatePrayerStates = useCallback(() => {
    const nowMinutes = getCurrentTimeInMinutes();
    const nowSeconds = getCurrentSeconds();

    const prayers: PrayerInfo[] = prayerTimesRef.current.map((p) => ({
      ...p,
      timeInMinutes: parseTimeToMinutes(p.time),
    }));

    let next = prayers[0]; // Default to first prayer (next day)
    let foundNext = false;
    for (let i = 0; i < prayers.length; i++) {
      if (nowMinutes < prayers[i].timeInMinutes) {
        next = prayers[i];
        foundNext = true;
        break;
      }
    }

    let diffMinutes: number;
    if (foundNext) {
      diffMinutes = next.timeInMinutes - nowMinutes;
    } else {
      diffMinutes = 24 * 60 - nowMinutes + next.timeInMinutes;
    }

    const totalSeconds = Math.max(0, diffMinutes * 60 - nowSeconds);

    setNextPrayer(next);
    setCountdown(formatCountdown(totalSeconds));
  }, []); // No prayerTimes dependency — uses ref

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

    setCurrentTime(timeStr);
  }, []);

  // Initial fetch — runs once on mount
  useEffect(() => {
    setMounted(true);
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Countdown interval — runs once on mount, uses refs for latest data
  useEffect(() => {
    calculatePrayerStates();
    updateCurrentTime();

    const countdownInterval = setInterval(() => {
      calculatePrayerStates();
      updateCurrentTime();
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [calculatePrayerStates, updateCurrentTime]);

  if (!mounted) return null;

  return (
    <div className="w-full md:w-[280px]">
      {/* Modern Compact Card - Transparent Glass Style */}
      <div 
        className={cn(
            "relative bg-white/20 backdrop-blur-md rounded-2xl md:p-5 p-4 shadow-2xl border border-white/10 w-full flex flex-col transition-all duration-500 ease-in-out overflow-hidden",
            isExpanded ? "gap-5" : "gap-2 md:gap-5"
        )}
      >
        
        {/* Header: Next Prayer Highlight */}
        <div className="flex flex-col items-center justify-center pt-2 relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-300/90 mb-2">
               <Clock className="w-3 h-3" />
               <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                 Menuju {nextPrayer?.name}
               </span>
            </div>
            
            <div className="relative">
              <span className="text-5xl font-mono font-medium tracking-tighter text-white tabular-nums leading-none drop-shadow-lg">
                {countdown}
              </span>
            </div>
            
            {/* Location & Real-time (Subtle) */}
            <div className="flex items-center gap-2 mt-3 text-[10px] text-emerald-100/60 font-medium">
               <span className="flex items-center gap-1">
                 <MapPin className="w-2.5 h-2.5" />
                 {location}
               </span>
               <span className="w-0.5 h-0.5 rounded-full bg-emerald-100/40" />
               <span className="font-mono">{currentTime}</span>
            </div>

            {/* Hijri Date */}
            {hijriDate && (
              <div className="mt-1.5 text-[9px] text-emerald-200/50 font-medium tracking-wide">
                {hijriDate}
              </div>
            )}
        </div>

        {/* Separator - Visible only when expanded on mobile, or always on desktop */}
        <div className={cn(
            "h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0 md:opacity-100 hidden md:block"
        )} />

        {/* Footer: Compact Prayer List - Collapsible on mobile */}
        <div 
            className={cn(
                "flex flex-col gap-0.5 transition-all duration-500 ease-in-out overflow-hidden",
                isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 md:max-h-[300px] md:opacity-100"
            )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-emerald-100/50 gap-2">
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
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50"
                      : "text-emerald-100/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isNext ? "text-white" : "text-emerald-100/40"
                    )}
                  >
                    {prayer.name}
                  </span>
                  <span className={cn("text-xs font-mono font-medium", isNext ? "text-white" : "opacity-80")}>
                    {prayer.time}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Expand/Collapse Button */}
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden w-full flex items-center justify-center py-1 mt-1 text-white/50 hover:text-white transition-colors focus:outline-none active:scale-95"
            aria-label={isExpanded ? "Collapse prayer times" : "Expand prayer times"}
        >
            {isExpanded ? (
                <ChevronUp className="w-5 h-5 animate-bounce" />
            ) : (
                <ChevronDown className="w-5 h-5 animate-bounce" />
            )}
        </button>

      </div>
    </div>
  );
}
