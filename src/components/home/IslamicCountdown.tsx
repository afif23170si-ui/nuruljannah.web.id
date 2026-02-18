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
  emoji: string;
}

const EVENTS: IslamicEvent[] = [
  { name: "Tahun Baru Hijriah",  hijriMonth: 1,  hijriDay: 1,  icon: Sparkles, label: "Tahun Baru Islam", emoji: "🌙" },
  { name: "Maulid Nabi Muhammad", hijriMonth: 3,  hijriDay: 12, icon: Star,     label: "Maulid Nabi",     emoji: "⭐" },
  { name: "Isra Mi'raj",          hijriMonth: 7,  hijriDay: 27, icon: Moon,     label: "Isra Mi'raj",     emoji: "✨" },
  { name: "Ramadhan",             hijriMonth: 9,  hijriDay: 1,  icon: Moon,     label: "Ramadhan",        emoji: "🌙" },
  { name: "Idul Fitri",           hijriMonth: 10, hijriDay: 1,  icon: Sparkles, label: "Idul Fitri",      emoji: "🎉" },
  { name: "Idul Adha",            hijriMonth: 12, hijriDay: 10, icon: Sun,      label: "Idul Adha",       emoji: "🐪" },
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
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
      {/* Icon + Emoji */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{upcoming.event.emoji}</span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium leading-tight">
            Menuju
          </span>
          <span className="text-sm font-semibold text-white leading-tight">
            {upcoming.event.label}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-white/20" />

      {/* Countdown Digits */}
      {isToday ? (
        <span className="text-sm font-bold text-emerald-300">
          🎉 Hari Ini!
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <CountdownUnit value={countdown.days} label="Hari" />
          <span className="text-white/40 text-lg font-light">:</span>
          <CountdownUnit value={countdown.hours} label="Jam" />
          <span className="text-white/40 text-lg font-light">:</span>
          <CountdownUnit value={countdown.minutes} label="Mnt" />
          <span className="text-white/40 text-lg font-light hidden sm:block">:</span>
          <div className="hidden sm:block">
            <CountdownUnit value={countdown.seconds} label="Dtk" />
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[32px]">
      <span className="text-xl sm:text-2xl font-bold tabular-nums leading-none text-white">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default IslamicCountdown;
