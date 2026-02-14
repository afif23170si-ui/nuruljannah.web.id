import { Metadata } from "next";
import { getActiveEvents } from "@/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  RefreshCw,
  Star,
  Heart,
  Shield,
  CalendarDays,
  CalendarCheck,
  Repeat,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda Masjid",
  description:
    "Agenda kegiatan Masjid Nurul Jannah — kajian rutin, kegiatan sosial, agenda Ramadhan, rapat takmir, dan lainnya.",
};

const DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const DAY_COLORS: Record<number, string> = {
  0: "bg-red-500/10 text-red-600 border-red-200",
  1: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  2: "bg-pink-500/10 text-pink-600 border-pink-200",
  3: "bg-green-500/10 text-green-600 border-green-200",
  4: "bg-blue-500/10 text-blue-600 border-blue-200",
  5: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  6: "bg-purple-500/10 text-purple-600 border-purple-200",
};

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: typeof BookOpen; color: string; bgColor: string }
> = {
  KAJIAN_RUTIN: {
    label: "Kajian Rutin",
    icon: BookOpen,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  PROGRAM_RUTIN: {
    label: "Program Rutin",
    icon: RefreshCw,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  EVENT_BESAR: {
    label: "Event Besar",
    icon: Star,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  SOSIAL: {
    label: "Sosial",
    icon: Heart,
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-200",
  },
  INTERNAL_DKM: {
    label: "Internal DKM",
    icon: Shield,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
  },
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  KAJIAN_RUTIN: "border-l-emerald-500",
  PROGRAM_RUTIN: "border-l-blue-500",
  EVENT_BESAR: "border-l-amber-500",
  SOSIAL: "border-l-rose-500",
  INTERNAL_DKM: "border-l-indigo-500",
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = typeof params.kategori === "string" ? params.kategori : undefined;
  const events = await getActiveEvents(activeCategory);

  // Separate recurring and one-time events
  const recurringEvents = events.filter((e) => e.isRecurring);
  const oneTimeEvents = events.filter((e) => !e.isRecurring);

  // Group recurring events by day
  const recurringByDay = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    events: recurringEvents.filter((e) => e.dayOfWeek === index),
  })).filter((d) => d.events.length > 0);

  const categories = Object.entries(CATEGORY_CONFIG);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 py-16 md:py-20">
        <div className="absolute inset-0 pattern-overlay opacity-20" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <CalendarCheck className="h-3 w-3" />
            Agenda Masjid
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-emerald-950">
            Agenda Masjid
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jadwal kajian, kegiatan sosial, agenda Ramadhan, dan seluruh
            kegiatan Masjid Nurul Jannah
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-xl border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
            <Link href="/agenda">
              <Badge
                variant={!activeCategory ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all ${
                  !activeCategory
                    ? "bg-emerald-900 text-white hover:bg-emerald-800"
                    : "hover:bg-emerald-50"
                }`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Semua
              </Badge>
            </Link>
            {categories.map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeCategory === key;
              return (
                <Link key={key} href={`/agenda?kategori=${key}`}>
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-emerald-900 text-white hover:bg-emerald-800"
                        : "hover:bg-emerald-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mr-1.5" />
                    {config.label}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Belum ada agenda yang tersedia.</p>
            {activeCategory && (
              <Link href="/agenda">
                <Badge variant="outline" className="mt-4 cursor-pointer">
                  Lihat semua agenda
                </Badge>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Recurring Events Section */}
            {recurringByDay.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Repeat className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Agenda Rutin</h2>
                  </div>
                  <div className="flex-1 h-px bg-emerald-100" />
                </div>

                <div className="space-y-8">
                  {recurringByDay.map(({ day, dayIndex, events: dayEvents }) => (
                    <div key={day}>
                      {/* Day Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          variant="outline"
                          className={`text-sm px-3 py-1 ${DAY_COLORS[dayIndex]}`}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {day}
                        </Badge>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      {/* Event Cards */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dayEvents.map((event) => {
                          const catConfig = CATEGORY_CONFIG[event.category];
                          const CatIcon = catConfig?.icon || CalendarDays;
                          return (
                            <Card
                              key={event.id}
                              className={`border-l-4 ${
                                CATEGORY_BORDER_COLORS[event.category] ||
                                "border-l-gray-300"
                              } hover:shadow-md transition-shadow`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-lg">
                                    {event.title}
                                  </CardTitle>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs shrink-0 ${catConfig?.bgColor}`}
                                  >
                                    <CatIcon className="h-3 w-3 mr-1" />
                                    {catConfig?.label}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {/* Speaker */}
                                {event.speaker && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">
                                      {event.speaker}
                                    </span>
                                  </div>
                                )}

                                {/* Description */}
                                {event.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {event.description}
                                  </p>
                                )}

                                {/* Time & Location */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                  <Badge variant="secondary" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    {event.time}
                                    {event.endTime
                                      ? ` - ${event.endTime}`
                                      : ""}{" "}
                                    WIB
                                  </Badge>
                                  {event.location && (
                                    <Badge variant="outline" className="gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* One-time Events Section */}
            {oneTimeEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CalendarDays className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Agenda Mendatang</h2>
                  </div>
                  <div className="flex-1 h-px bg-emerald-100" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {oneTimeEvents.map((event) => {
                    const catConfig = CATEGORY_CONFIG[event.category];
                    const CatIcon = catConfig?.icon || CalendarDays;
                    return (
                      <Card
                        key={event.id}
                        className={`border-l-4 ${
                          CATEGORY_BORDER_COLORS[event.category] ||
                          "border-l-gray-300"
                        } hover:shadow-md transition-shadow`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg">
                              {event.title}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`text-xs shrink-0 ${catConfig?.bgColor}`}
                            >
                              <CatIcon className="h-3 w-3 mr-1" />
                              {catConfig?.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Speaker */}
                          {event.speaker && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium">
                                {event.speaker}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          {/* Date, Time & Location */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {event.date && (
                              <Badge variant="outline" className="gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                              {event.endTime
                                ? ` - ${event.endTime}`
                                : ""}{" "}
                              WIB
                            </Badge>
                            {event.location && (
                              <Badge variant="outline" className="gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        <Card className="mt-12 max-w-2xl mx-auto border-emerald-200/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Catatan:</strong> Agenda dapat berubah sewaktu-waktu.
              Untuk informasi terbaru, silakan hubungi pengurus masjid atau
              pantau pengumuman di masjid.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
