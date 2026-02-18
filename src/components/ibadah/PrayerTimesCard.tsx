"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Clock, MapPin, CalendarDays } from "lucide-react";

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
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
    hijri: {
      fullDate: string;
      dayName: string;
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

export function PrayerTimesCard() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [location, setLocation] = useState("Tanjung Palas, Dumai Timur");
  const [nextPrayer, setNextPrayer] = useState<PrayerInfo | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(fallbackPrayerTimes);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const prayerTimesRef = useRef(prayerTimes);
  prayerTimesRef.current = prayerTimes;

  const calculatePrayerStates = useCallback(() => {
    const nowMinutes = getCurrentTimeInMinutes();
    const nowSeconds = getCurrentSeconds();

    // Only use actual prayer times for countdown (skip Imsak)
    const prayers: PrayerInfo[] = prayerTimesRef.current
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
  }, []); // No prayerTimes dependency — uses ref

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
            {hijriDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-emerald-600 font-semibold">{hijriDate}</span>
              </>
            )}
         </div>
         <div className="text-[10px] md:text-xs">
            Sumber: Kemenag RI
         </div>
      </div>
    </div>
  );
}
