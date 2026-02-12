"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

// Hijri month names in Indonesian transliteration
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqaidah", "Dzulhijjah"
];

const GREGORIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function getHijriDate(date: Date): { day: number; month: string; year: number } {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find(p => p.type === "day")?.value || "1");
    const monthNum = parseInt(parts.find(p => p.type === "month")?.value || "1");
    const year = parseInt(parts.find(p => p.type === "year")?.value || "1400");
    
    return {
      day,
      month: HIJRI_MONTHS[monthNum - 1] || HIJRI_MONTHS[0],
      year,
    };
  } catch {
    return { day: 1, month: "Muharram", year: 1447 };
  }
}

function getGregorianDate(date: Date): string {
  const day = date.getDate();
  const month = GREGORIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

interface DateDisplayProps {
  variant?: "hero" | "notch";
}

export function DateDisplay({ variant = "hero" }: DateDisplayProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    
    // Update every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!currentDate) return null;

  const gregorian = getGregorianDate(currentDate);
  const hijri = getHijriDate(currentDate);
  const hijriStr = `${hijri.day} ${hijri.month} ${hijri.year} H`;

  if (variant === "notch") {
    return (
      <div className="inline-flex items-center gap-2 text-emerald-800 text-[11px] font-medium tracking-wide">
        <Calendar className="h-3 w-3 text-emerald-600 flex-shrink-0" />
        <span>{gregorian}</span>
        <span className="text-emerald-400">|</span>
        <span className="text-emerald-700">{hijriStr}</span>
      </div>
    );
  }

  // hero variant (mobile)
  return (
    <div className="inline-flex items-center gap-2 text-white/90 text-xs font-medium tracking-wide">
      <Calendar className="h-3.5 w-3.5 text-emerald-300 flex-shrink-0" />
      <span>{gregorian}</span>
      <span className="text-white/40">|</span>
      <span className="text-emerald-200">{hijriStr}</span>
    </div>
  );
}

export default DateDisplay;
