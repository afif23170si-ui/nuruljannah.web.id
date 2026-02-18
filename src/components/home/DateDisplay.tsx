"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

const GREGORIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

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
  const [hijriStr, setHijriStr] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    // Fetch Hijriah from our API (uses adj=-1, sesuai sidang isbat)
    fetch("/api/prayer-today")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.hijri?.fullDate) {
          setHijriStr(data.data.hijri.fullDate);
        }
      })
      .catch(() => {
        // Fallback: no Hijriah displayed
      });

    // Update Masehi date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!currentDate) return null;

  const gregorian = getGregorianDate(currentDate);

  if (variant === "notch") {
    return (
      <div className="inline-flex items-center gap-2 text-emerald-800 text-[11px] font-medium tracking-wide">
        <Calendar className="h-3 w-3 text-emerald-600 flex-shrink-0" />
        <span>{gregorian}</span>
        {hijriStr && (
          <>
            <span className="text-emerald-400">|</span>
            <span className="text-emerald-700">{hijriStr}</span>
          </>
        )}
      </div>
    );
  }

  // hero variant (mobile)
  return (
    <div className="inline-flex items-center gap-2 text-white/90 text-xs font-medium tracking-wide">
      <Calendar className="h-3.5 w-3.5 text-emerald-300 flex-shrink-0" />
      <span>{gregorian}</span>
      {hijriStr && (
        <>
          <span className="text-white/40">|</span>
          <span className="text-emerald-200">{hijriStr}</span>
        </>
      )}
    </div>
  );
}

export default DateDisplay;
