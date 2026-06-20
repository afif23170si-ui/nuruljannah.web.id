"use client";

import { useState, useEffect } from "react";
import { Moon, Star, Sparkles, Sun } from "lucide-react";

// ============================================================
// Islamic Events (Hijri Calendar)
// Each event has a fixed Hijri month + day.
// We compute the next occurrence's Gregorian date at runtime.
// ============================================================

interface IslamicEvent {
  name: string;
  hijriMonth: number; // 1-indexed (1=Muharram … 12=Dzulhijjah)
  hijriDay: number;
  icon: React.ElementType;
  label: string; // Short label shown above the countdown
}

const EVENTS: IslamicEvent[] = [
  { name: "Tahun Baru Hijriah",  hijriMonth: 1,  hijriDay: 1,  icon: Sparkles, label: "Tahun Baru Islam" },
  { name: "Maulid Nabi Muhammad", hijriMonth: 3,  hijriDay: 12, icon: Star,     label: "Maulid Nabi" },
  { name: "Isra Mi'raj",          hijriMonth: 7,  hijriDay: 27, icon: Moon,     label: "Isra Mi'raj" },
  { name: "Ramadhan",             hijriMonth: 9,  hijriDay: 1,  icon: Moon,     label: "Ramadhan" },
  { name: "Idul Fitri",           hijriMonth: 10, hijriDay: 1,  icon: Sparkles, label: "Idul Fitri" },
  { name: "Idul Adha",            hijriMonth: 12, hijriDay: 10, icon: Sun,      label: "Idul Adha" },
];

// ============================================================
// Helper: convert a Gregorian Date → Hijri {day, month, year}
// Uses the browser's built-in Intl API with islamic-umalqura calendar
// ============================================================

function toHijri(date: Date): { day: number; month: number; year: number } {
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = fmt.formatToParts(date);
    return {
      day: parseInt(parts.find((p) => p.type === "day")?.value || "1"),
      month: parseInt(parts.find((p) => p.type === "month")?.value || "1"),
      year: parseInt(parts.find((p) => p.type === "year")?.value || "1446"),
    };
  } catch {
    return { day: 1, month: 1, year: 1446 };
  }
}

// ============================================================
// Find the Gregorian date of a given Hijri month/day.
// Strategy: Starting from roughly today, scan forward day-by-day
// until we find the target Hijri date (within the next ~400 days).
// 
// IMPORTANT: The browser's islamic-umalqura calendar is typically
// 1 day ahead of the official Kemenag calendar (sidang isbat).
// We apply adj=+1 day to the result to compensate (equivalent to 
// myQuran API's adj=-1 parameter).
// ============================================================

function findGregorianDate(hijriMonth: number, hijriDay: number, afterDate: Date): Date | null {
  const startDate = new Date(afterDate);
  startDate.setHours(0, 0, 0, 0);

  // Scan up to 400 days ahead (covers a full Hijri year + buffer)
  for (let i = 0; i <= 400; i++) {
    const candidate = new Date(startDate);
    candidate.setDate(candidate.getDate() + i);
    const h = toHijri(candidate);
    if (h.month === hijriMonth && h.day === hijriDay) {
      // Adjust +1 day to match sidang isbat (adj=-1)
      candidate.setDate(candidate.getDate() + 1);
      return candidate;
    }
  }
  return null;
}

// ============================================================
// Determine the next upcoming Islamic event
// ============================================================

interface UpcomingEvent {
  event: IslamicEvent;
  targetDate: Date;
  hijriYear: number;
}

function getNextEvent(now: Date): UpcomingEvent | null {
  let closest: UpcomingEvent | null = null;

  for (const ev of EVENTS) {
    const target = findGregorianDate(ev.hijriMonth, ev.hijriDay, now);
    if (!target) continue;

    const diff = target.getTime() - now.getTime();
    if (diff < 0) continue; // already passed today

    if (!closest || target.getTime() < closest.targetDate.getTime()) {
      const h = toHijri(target);
      closest = { event: ev, targetDate: target, hijriYear: h.year };
    }
  }

  return closest;
}

// ============================================================
// Component
// ============================================================

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcCountdown(target: Date, now: Date): CountdownValues {
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function IslamicCountdown() {
  const [upcoming, setUpcoming] = useState<UpcomingEvent | null>(null);
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const [mounted, setMounted] = useState(false);

  // Find the next event once on mount
  useEffect(() => {
    const now = new Date();
    const next = getNextEvent(now);
    setUpcoming(next);
    setMounted(true);
  }, []);

  // Tick every second
  useEffect(() => {
    if (!upcoming) return;
    const tick = () => setCountdown(calcCountdown(upcoming.targetDate, new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [upcoming]);

  // Don't render until client-side hydration
  if (!mounted || !upcoming || !countdown) return null;

  const Icon = upcoming.event.icon;
  const isToday = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;

  return (
    <div className="w-full md:w-[280px] flex flex-col items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 overflow-hidden">
      {/* Row 1: Label & Event Name */}
      <div className="flex flex-row items-center justify-center text-center bg-emerald-600 w-full py-3 px-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] relative z-10 border-b border-emerald-500/50 text-white">
        <span className="text-[11px] uppercase tracking-[0.2em] font-medium mr-1.5 text-emerald-50">
          Menuju
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
          {upcoming.event.label}
        </span>
      </div>

      {/* Row 2: Countdown Digits */}
      <div className="w-full p-4 pt-3 flex flex-col items-center justify-center relative z-0">
        {isToday ? (
          <span className="text-sm font-bold text-emerald-400 py-1">
            Hari Ini!
          </span>
        ) : (
          <div className="flex items-center justify-center gap-3 w-full py-1">
            <CountdownUnit value={countdown.days} label="Hari" />
            <span className="text-white/20 text-lg font-extralight mb-4.5">:</span>
            <CountdownUnit value={countdown.hours} label="Jam" />
            <span className="text-white/20 text-lg font-extralight mb-4.5">:</span>
            <CountdownUnit value={countdown.minutes} label="Mnt" />
            <span className="text-white/20 text-lg font-extralight mb-4.5 hidden sm:inline">:</span>
            <div className="hidden sm:block">
              <CountdownUnit value={countdown.seconds} label="Dtk" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[36px]">
      <span className="text-2xl sm:text-3xl font-mono font-medium tabular-nums leading-none text-white/90">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[8px] uppercase tracking-widest text-emerald-100/50 mt-1.5 font-medium">
        {label}
      </span>
    </div>
  );
}

export default IslamicCountdown;
