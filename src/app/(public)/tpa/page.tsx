import { Metadata } from "next";
import { getTpaInfo } from "@/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Bell,
  GraduationCap,
  User,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "TPA / TPQ",
  description: "Informasi Taman Pendidikan Al-Quran (TPA/TPQ) Masjid Nurul Jannah.",
};

export default async function TpaPage() {
  const { classes, teachers, announcements } = await getTpaInfo();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <GraduationCap className="h-3 w-3 mr-1" />
            Pendidikan Islam
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TPA / TPQ</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Taman Pendidikan Al-Quran Masjid Nurul Jannah - Membentuk generasi
            Qurani yang berakhlakul karimah
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {classes.length}
              </div>
              <p className="text-muted-foreground text-sm">Kelas Aktif</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {teachers.length}
              </div>
              <p className="text-muted-foreground text-sm">Pengajar</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                50+
              </div>
              <p className="text-muted-foreground text-sm">Santri</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                5
              </div>
              <p className="text-muted-foreground text-sm">Hari/Minggu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-12">
          {/* Classes */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Kelas TPA/TPQ</h2>
            </div>

            {classes.length === 0 ? (
              <p className="text-muted-foreground">Belum ada data kelas.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {classes.map((cls) => (
                  <Card key={cls.id} className="card-hover">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cls.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {cls.description}
                        </p>
                      )}
                      {cls.schedule && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {cls.schedule}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Teachers */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Ustadz/Ustadzah Pengajar</h2>
            </div>

            {teachers.length === 0 ? (
              <p className="text-muted-foreground">Belum ada data pengajar.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teachers.map((teacher) => (
                  <Card key={teacher.id} className="card-hover">
                    <CardContent className="p-5 flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.photo || ""} alt={teacher.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{teacher.name}</h3>
                        {teacher.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {teacher.phone}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Announcements */}
          {announcements.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Pengumuman TPA</h2>
              </div>

              <div className="space-y-4 max-w-3xl">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">{announcement.title}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {announcement.content}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {format(new Date(announcement.publishedAt), "d MMM", {
                            locale: id,
                          })}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Registration Info */}
          <section>
            <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Pendaftaran Santri Baru</h3>
                <p className="text-muted-foreground mb-4">
                  Pendaftaran santri baru TPA/TPQ Masjid Nurul Jannah dibuka
                  sepanjang tahun. Untuk informasi lebih lanjut, silakan hubungi
                  pengurus TPA atau datang langsung ke masjid.
                </p>
                <Badge variant="secondary" className="text-sm">
                  Gratis Biaya Pendaftaran
                </Badge>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
