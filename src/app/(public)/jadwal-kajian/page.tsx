import { Metadata } from "next";
import { getKajianSchedules } from "@/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Jadwal Kajian",
  description: "Jadwal kajian rutin, majelis ilmu, dan kegiatan keagamaan di Masjid Nurul Jannah.",
};

const DAYS = [
  "Ahad",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const DAY_COLORS: Record<number, string> = {
  0: "bg-red-500/10 text-red-600 border-red-200",
  1: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  2: "bg-pink-500/10 text-pink-600 border-pink-200",
  3: "bg-green-500/10 text-green-600 border-green-200",
  4: "bg-blue-500/10 text-blue-600 border-blue-200",
  5: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  6: "bg-purple-500/10 text-purple-600 border-purple-200",
};

export default async function JadwalKajianPage() {
  const schedules = await getKajianSchedules();

  // Group by day
  const schedulesByDay = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    schedules: schedules.filter((s) => s.dayOfWeek === index),
  })).filter((d) => d.schedules.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <BookOpen className="h-3 w-3 mr-1" />
            Majelis Ilmu
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Jadwal Kajian</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jadwal kajian rutin dan kegiatan keagamaan di Masjid Nurul Jannah
          </p>
        </div>
      </section>

      {/* Schedule Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {schedules.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada jadwal kajian yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {schedulesByDay.map(({ day, dayIndex, schedules }) => (
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

                {/* Schedule Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {schedules.map((schedule) => (
                    <Card key={schedule.id} className="card-hover border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{schedule.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Speaker */}
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">{schedule.speaker}</span>
                        </div>

                        {/* Topic */}
                        {schedule.topic && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{schedule.topic}</span>
                          </div>
                        )}

                        {/* Time & Location */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.time} WIB
                          </Badge>
                          {schedule.location && (
                            <Badge variant="outline" className="gap-1">
                              <MapPin className="h-3 w-3" />
                              {schedule.location}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        <Card className="mt-12 max-w-2xl mx-auto border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Catatan:</strong> Jadwal dapat berubah sewaktu-waktu.
              Untuk informasi terbaru, silakan hubungi pengurus masjid atau
              pantau pengumuman di masjid.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
