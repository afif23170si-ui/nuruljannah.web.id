"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

interface MonthPickerProps {
  currentMonth: number; // 1-12
  currentYear: number;
  basePath: string; // e.g. "/infaq" or "/keuangan"
  variant?: "default" | "glass";
}

export function MonthPicker({
  currentMonth,
  currentYear,
  basePath,
  variant = "default",
}: MonthPickerProps) {
  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayYear = now.getFullYear();
  const isCurrentMonth = currentMonth === todayMonth && currentYear === todayYear;

  // Previous month
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Next month
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  // Don't allow navigating to future months
  const isFutureMonth =
    nextYear > todayYear || (nextYear === todayYear && nextMonth > todayMonth);

  function buildUrl(month: number, year: number) {
    if (month === todayMonth && year === todayYear) {
      return basePath;
    }
    return `${basePath}?month=${month}&year=${year}`;
  }

  // Styles based on variant
  const isGlass = variant === "glass";
  const buttonBase = "h-9 w-9 rounded-full flex items-center justify-center transition-all active:scale-95 border";
  
  const buttonStyles = isGlass
    ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40"
    : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300";

  const disabledStyles = isGlass
    ? "border-white/10 text-white/20 cursor-not-allowed"
    : "border-gray-100 text-gray-200 cursor-not-allowed";

  const labelStyles = isGlass
    ? "text-white drop-shadow-sm font-bold tracking-widest"
    : "text-gray-700 font-semibold tracking-wider";

  const resetStyles = isGlass
    ? "border-white/20 bg-white/10 text-emerald-100 hover:bg-white/20 hover:text-white"
    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {/* Previous */}
      <Link
        href={buildUrl(prevMonth, prevYear)}
        className={`${buttonBase} ${buttonStyles}`}
        aria-label="Bulan sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Month Label */}
      <span className={`min-w-[160px] text-center text-sm uppercase ${labelStyles}`}>
        {MONTH_NAMES[currentMonth - 1]} {currentYear}
      </span>

      {/* Next */}
      {isFutureMonth ? (
        <span className={`${buttonBase} ${disabledStyles}`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link
          href={buildUrl(nextMonth, nextYear)}
          className={`${buttonBase} ${buttonStyles}`}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {/* Reset to current month */}
      {!isCurrentMonth && (
        <Link
          href={basePath}
          className={`ml-1 h-9 px-3 rounded-full border flex items-center gap-1.5 text-xs font-medium transition-all active:scale-95 ${resetStyles}`}
        >
          <RotateCcw className="h-3 w-3" />
          Hari Ini
        </Link>
      )}
    </div>
  );
}
