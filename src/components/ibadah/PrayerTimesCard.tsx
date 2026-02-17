"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Clock, MapPin, CalendarDays } from "lucide-react";

const CALCULATION_METHOD = 20;

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

interface PrayerTimesCardProps {
  location?: string;
  latitude?: number;
  longitude?: number;
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

function formatApiTime(time: string): string {
  const match = time.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : time;
}

export function PrayerTimesCard({ 
  location = "Tanjung Palas, Dumai Timur",
  latitude = 1.66395,
  longitude = 101.45298
}: PrayerTimesCardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [nextPrayer, setNextPrayer] = useState<PrayerInfo | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(fallbackPrayerTimes);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchDate, setLastFetchDate] = useState<string>("");

  const fetchPrayerTimes = useCallback(async () => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];

    if (dateString === lastFetchDate) return;

    try {
      setIsLoading(true);
      const url = `https://api.aladhan.com/v1/timings/${Math.floor(today.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=${CALCULATION_METHOD}&school=0&timezonestring=Asia/Jakarta`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch prayer times");

      const data = await response.json();
      const timings = data.data.timings;

      const newPrayerTimes: PrayerTime[] = [
        { name: "Imsak", time: formatApiTime(timings.Imsak) },
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
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchDate, latitude, longitude]);

  const calculatePrayerStates = useCallback(() => {
    const nowMinutes = getCurrentTimeInMinutes();
    const nowSeconds = getCurrentSeconds();

    // Only use actual prayer times for countdown (skip Imsak)
    const prayers: PrayerInfo[] = prayerTimes
      .filter((p) => p.name !== "Imsak")
      .map((p) => ({
        ...p,
        timeInMinutes: parseTimeToMinutes(p.time),
      }));

    let next = prayers[0];
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
  }, [prayerTimes]);

  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/\./g, ":")
    );
    
    setCurrentDate(
      now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long"
      })
    );
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchPrayerTimes();
    calculatePrayerStates();
    updateCurrentTime();

    const countdownInterval = setInterval(() => {
      calculatePrayerStates();
      updateCurrentTime();
    }, 1000);

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
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header Bar - Clean */}
      <div className="bg-gray-50/50 border-b border-gray-100 px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">Jadwal Shalat</h3>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-0.5">
               <MapPin className="w-3 h-3" />
               <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Countdown & Current Time */}
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Menuju {nextPrayer?.name}</p>
              <p className="font-mono text-xl font-bold text-emerald-600 leading-none tracking-tight">{countdown}</p>
           </div>
           <div className="h-8 w-px bg-gray-200 hidden md:block" />
           <div className="hidden md:block text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Waktu Sekarang</p>
              <p className="font-mono text-xl font-bold text-gray-900 leading-none tracking-tight">{currentTime}</p>
           </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="p-3 md:p-6 flex flex-wrap justify-center gap-2 md:gap-3">
        {isLoading ? (
          <div className="w-full flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          prayerTimes.map((prayer) => {
             const isNext = prayer.name === nextPrayer?.name;
             return (
               <div 
                 key={prayer.name}
                 className={cn(
                   "relative flex-1 min-w-[30%] md:min-w-0 flex flex-col items-center justify-center py-3 px-1 md:py-3.5 md:px-2 rounded-lg border transition-all duration-200 text-center",
                   isNext 
                     ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                     : "bg-white border-gray-100 hover:border-emerald-100"
                 )}
               >
                 {isNext && (
                   <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                     Selanjutnya
                   </span>
                 )}
                 <span className={cn(
                   "text-[10px] md:text-xs font-medium uppercase tracking-wider mb-0.5 md:mb-1",
                   isNext ? "text-emerald-700" : "text-gray-400"
                 )}>
                   {prayer.name}
                 </span>
                 <span className={cn(
                   "text-base md:text-xl font-bold font-mono tracking-tight",
                   isNext ? "text-emerald-900" : "text-gray-800"
                 )}>
                   {prayer.time}
                 </span>
               </div>
             );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50/30 px-5 py-3 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
         <div className="flex items-center gap-2 font-medium text-gray-500">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{currentDate}</span>
         </div>
         <div className="text-[10px] md:text-xs">
            Metode: Kemenag RI (20°)
         </div>
      </div>
    </div>
  );
}
