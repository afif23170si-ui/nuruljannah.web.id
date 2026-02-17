"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

// Types matching the Prisma return + logic used in page
export type ScheduleEntry = {
  id: string;
  dayOfWeek: number;
  prayer: string;
  role: string;
  officerId: string;
  notes: string | null;
  officer: { id: string; name: string; role: string };
};

const SCHEDULE_DAYS = [
  { num: 1, name: "Senin", short: "Sen" },
  { num: 2, name: "Selasa", short: "Sel" },
  { num: 3, name: "Rabu", short: "Rab" },
  { num: 4, name: "Kamis", short: "Kam" },
  { num: 5, name: "Jumat", short: "Jum" },
  { num: 6, name: "Sabtu", short: "Sab" },
  { num: 7, name: "Minggu", short: "Min" },
];

const SCHEDULE_PRAYERS = [
  { key: "FAJR", name: "Subuh", short: "Sub" },
  { key: "DHUHR", name: "Dzuhur", short: "Dzu" },
  { key: "ASR", name: "Ashar", short: "Ash" },
  { key: "MAGHRIB", name: "Maghrib", short: "Mag" },
  { key: "ISHA", name: "Isya", short: "Isy" },
];

function getTodayDayOfWeek(): number {
  // JS: 0=Sun, 1=Mon..6=Sat → Our: 1=Sen..7=Min
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

export function WeeklySchedule({ 
  schedule, 
  variant = 'light' 
}: { 
  schedule: ScheduleEntry[];
  variant?: 'light' | 'dark';
}) {
  const scheduleMap = new Map<string, ScheduleEntry>();
  schedule.forEach((s) => {
    scheduleMap.set(`${s.dayOfWeek}-${s.prayer}-${s.role}`, s);
  });

  const get = (day: number, prayer: string, role: string) => {
    return scheduleMap.get(`${day}-${prayer}-${role}`);
  };

  const today = getTodayDayOfWeek();
  const isDark = variant === 'dark';

  return (
    <>
      {/* Desktop: Table view - Clean & Flat */}
      <div className={`hidden md:block overflow-hidden rounded-xl border ${
        isDark ? "border-emerald-800/50 bg-emerald-900/20" : "border-gray-100 bg-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDark ? "border-emerald-800/50 bg-emerald-950/30" : "border-gray-100 bg-gray-50/50"
              }`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-24 ${
                  isDark ? "text-emerald-400" : "text-gray-500"
                }`}>
                  <div className="flex items-center gap-2">
                    <CalendarDays className={`h-3.5 w-3.5 ${isDark ? "text-emerald-500" : "text-gray-400"}`} />
                    Hari
                  </div>
                </th>
                {SCHEDULE_PRAYERS.map((p) => (
                  <th
                    key={p.key}
                    className={`px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-emerald-400" : "text-gray-500"
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-emerald-800/30" : "divide-gray-50"}`}>
              {SCHEDULE_DAYS.map((day) => (
                <tr
                  key={day.num}
                  className={`transition-all ${
                    day.num === today
                      ? isDark 
                        ? "bg-emerald-900/40 border-l-4 border-l-emerald-400 shadow-sm"
                        : "bg-emerald-50 border-l-4 border-l-emerald-500 shadow-sm"
                      : `hover:${isDark ? "bg-emerald-900/20" : "bg-gray-50/50"} border-l-4 border-l-transparent`
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          day.num === today
                            ? isDark ? "text-emerald-300" : "text-emerald-700"
                            : isDark ? "text-emerald-100/80" : "text-gray-700"
                        }`}
                      >
                        {day.name}
                      </span>
                      {day.num === today && (
                        <div className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-emerald-400" : "bg-emerald-500"}`} />
                      )}
                    </div>
                  </td>
                  {SCHEDULE_PRAYERS.map((prayer) => {
                    const imam = get(day.num, prayer.key, "IMAM");
                    const muadzin = get(day.num, prayer.key, "MUADZIN");
                    return (
                      <td key={prayer.key} className="px-3 py-3">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <div className="text-xs text-center">
                            <span className={`block leading-tight ${isDark ? "text-emerald-50" : "text-gray-900"}`}>
                              {imam ? imam.officer.name : "—"}
                            </span>
                            <span className={`text-[10px] ${isDark ? "text-emerald-500/70" : "text-gray-400"}`}>Imam</span>
                          </div>
                          
                          {(imam || muadzin) && <div className={`w-8 h-px ${isDark ? "bg-emerald-800/30" : "bg-gray-100"}`} />}
                          
                          <div className="text-xs text-center">
                            <span className={`block leading-tight ${isDark ? "text-emerald-50" : "text-gray-900"}`}>
                              {muadzin ? muadzin.officer.name : "—"}
                            </span>
                             <span className={`text-[10px] ${isDark ? "text-emerald-500/70" : "text-gray-400"}`}>Muadzin</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Clean List Card per day */}
      <div className="md:hidden space-y-4">
        {SCHEDULE_DAYS.map((day) => {
          const isToday = day.num === today;
          return (
            <div
              key={day.num}
              className={`rounded-xl border transition-all ${
                isToday
                  ? isDark 
                    ? "border-emerald-500/50 shadow-md bg-emerald-900/30 relative z-10"
                    : "border-emerald-500 shadow-md bg-emerald-50 relative z-10"
                  : isDark 
                    ? "border-emerald-800/30 bg-emerald-950/20"
                    : "border-gray-100 bg-white"
              } overflow-hidden`}
            >
              <div
                className={`px-4 py-3 flex items-center justify-between border-b ${
                  isToday
                    ? isDark ? "bg-emerald-900/50 border-emerald-800" : "bg-emerald-50 border-emerald-100"
                    : isDark ? "bg-emerald-950/40 border-emerald-800/30" : "bg-gray-50 border-gray-100"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isToday 
                      ? isDark ? "text-emerald-300" : "text-emerald-700" 
                      : isDark ? "text-emerald-100" : "text-gray-700"
                  }`}
                >
                  {day.name}
                </span>
                {isToday && (
                  <Badge variant="secondary" className={`${
                    isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  } text-[10px] h-5 px-1.5`}>
                    Hari ini
                  </Badge>
                )}
              </div>
              <div className={`divide-y ${isDark ? "divide-emerald-800/30" : "divide-gray-50"}`}>
                {SCHEDULE_PRAYERS.map((prayer) => {
                  const imam = get(day.num, prayer.key, "IMAM");
                  const muadzin = get(day.num, prayer.key, "MUADZIN");
                  
                  if (!imam && !muadzin) return null; 
                  
                  return (
                    <div
                      key={prayer.key}
                      className="px-4 py-2.5 flex items-start gap-3"
                    >
                      <span className={`w-12 shrink-0 text-xs font-medium uppercase pt-0.5 ${
                        isDark ? "text-emerald-500" : "text-gray-400"
                      }`}>
                        {prayer.short}
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="min-w-0">
                          <p className={`text-[10px] uppercase leading-none mb-0.5 ${
                            isDark ? "text-emerald-500/70" : "text-gray-400"
                          }`}>
                            Imam
                          </p>
                          <p className={`text-xs font-medium truncate ${
                            isDark ? "text-emerald-50" : "text-gray-900"
                          }`}>
                            {imam ? imam.officer.name : "—"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[10px] uppercase leading-none mb-0.5 ${
                            isDark ? "text-emerald-500/70" : "text-gray-400"
                          }`}>
                            Muadzin
                          </p>
                          <p className={`text-xs font-medium truncate ${
                            isDark ? "text-emerald-50" : "text-gray-900"
                          }`}>
                            {muadzin ? muadzin.officer.name : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
