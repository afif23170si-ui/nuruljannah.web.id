import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Info,
  Users,
  Mic2,
  AlarmClock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudMoon,
  BookOpen,
} from "lucide-react";
import { PrayerTimesWidget } from "@/components/home/PrayerTimesWidget";
import { getIbadahPublicData } from "@/actions/ibadah";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ibadah",
  description:
    "Jadwal shalat, adzan, iqomah, dan informasi ibadah di Masjid Nurul Jannah.",
};

const PRAYER_INFO = [
  {
    name: "Subuh",
    arabic: "الفجر",
    description:
      "Waktu shalat Subuh dimulai dari terbit fajar shadiq hingga terbit matahari.",
    rakaat: "2 rakaat",
    sunnah: "2 rakaat sebelum (Qabliyah)",
    icon: Sunrise,
    offsetKey: "fajrOffset" as const,
  },
  {
    name: "Dzuhur",
    arabic: "الظهر",
    description:
      "Waktu shalat Dzuhur dimulai setelah matahari tergelincir dari tengah langit.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum, 2 rakaat sesudah",
    icon: Sun,
    offsetKey: "dhuhrOffset" as const,
  },
  {
    name: "Ashar",
    arabic: "العصر",
    description:
      "Waktu shalat Ashar dimulai ketika bayangan benda sama panjang dengan bendanya.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum (tidak mu'akkad)",
    icon: CloudMoon,
    offsetKey: "asrOffset" as const,
  },
  {
    name: "Maghrib",
    arabic: "المغرب",
    description:
      "Waktu shalat Maghrib dimulai saat matahari terbenam hingga hilangnya mega merah.",
    rakaat: "3 rakaat",
    sunnah: "2 rakaat sesudah",
    icon: Sunset,
    offsetKey: "maghribOffset" as const,
  },
  {
    name: "Isya",
    arabic: "العشاء",
    description:
      "Waktu shalat Isya dimulai setelah hilangnya mega merah hingga pertengahan malam.",
    rakaat: "4 rakaat",
    sunnah: "2 rakaat sesudah",
    icon: Moon,
    offsetKey: "ishaOffset" as const,
  },
];

const ROLE_LABELS: Record<string, string> = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
  KHATIB: "Khatib",
};

export default async function IbadahPage() {
  const data = await getIbadahPublicData();

  const imams = data.officers.filter((o) => o.role === "IMAM");
  const muadzins = data.officers.filter((o) => o.role === "MUADZIN");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 py-16 md:py-20">
        <div className="absolute inset-0 pattern-overlay opacity-20" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Clock className="h-3 w-3" />
            Ibadah
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-emerald-950">
            Ibadah
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jadwal shalat, adzan & iqomah, dan informasi ibadah harian di Masjid
            Nurul Jannah
          </p>
        </div>
      </section>

      {/* Prayer Times Widget */}
      <section className="py-4">
        <PrayerTimesWidget />
      </section>

      {/* Adzan & Iqomah + Jumat */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Adzan & Iqomah - now data-driven */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlarmClock className="h-5 w-5 text-emerald-600" />
                  Jadwal Adzan & Iqomah
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Iqomah dilaksanakan setelah adzan dengan jeda waktu yang
                  bervariasi agar jamaah memiliki waktu untuk bersiap.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {PRAYER_INFO.map((prayer) => (
                    <div
                      key={prayer.name}
                      className="flex justify-between items-center rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">
                        {prayer.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        +{data.prayerSettings[prayer.offsetKey]} menit
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * Jeda iqomah dapat berubah sewaktu-waktu
                </p>
              </CardContent>
            </Card>

            {/* Shalat Jumat / Upcoming Khutbah */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic2 className="h-5 w-5 text-amber-600" />
                  Shalat Jumat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">
                      Adzan Pertama
                    </span>
                    <Badge variant="outline">11:30 WIB</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">
                      Adzan Kedua
                    </span>
                    <Badge variant="outline">12:00 WIB</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3 bg-amber-50/50">
                    <span className="text-sm font-medium">Khutbah Jumat</span>
                    <Badge className="bg-amber-600">12:05 WIB</Badge>
                  </div>
                </div>

                {/* Upcoming Khutbah Info */}
                {data.upcomingKhutbah && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Khutbah Jumat Mendatang
                    </p>
                    <div className="bg-amber-50/50 rounded-lg p-3 space-y-1">
                      <p className="font-semibold text-sm">
                        {data.upcomingKhutbah.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Khatib: {data.upcomingKhutbah.khatib}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(data.upcomingKhutbah.date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Jamaah diharapkan hadir sebelum adzan kedua. Disunnahkan
                  mandi, memakai pakaian terbaik, dan memperbanyak shalawat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Imam & Muadzin - now data-driven */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-950">
              Imam & Muadzin
            </h2>
            <p className="text-muted-foreground">
              Petugas ibadah harian Masjid Nurul Jannah
            </p>
          </div>

          {imams.length === 0 && muadzins.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Imam
                      </p>
                      <p className="font-semibold text-lg">
                        Sesuai jadwal petugas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Mic2 className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Muadzin
                      </p>
                      <p className="font-semibold text-lg">
                        Sesuai jadwal petugas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Imam List */}
              {imams.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-emerald-700" />
                      </div>
                      Imam
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {imams.map((imam) => (
                      <div
                        key={imam.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-700">
                          {imam.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">
                          {imam.name}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Muadzin List */}
              {muadzins.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Mic2 className="h-4 w-4 text-amber-700" />
                      </div>
                      Muadzin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {muadzins.map((muadzin) => (
                      <div
                        key={muadzin.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-sm font-bold text-amber-700">
                          {muadzin.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">
                          {muadzin.name}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recent Khutbah Archive */}
      {data.recentKhutbah.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-950">
                Arsip Khutbah Jumat
              </h2>
              <p className="text-muted-foreground">
                Catatan khutbah Jumat terbaru
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {data.recentKhutbah.map((k) => (
                <Card key={k.id} className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-none text-xs"
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Khutbah
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(k.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{k.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Khatib: {k.khatib}
                    </p>
                    {k.theme && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {k.theme}
                      </Badge>
                    )}
                    {k.summary && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {k.summary}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prayer Information */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-950">
              Informasi Waktu Shalat
            </h2>
            <p className="text-muted-foreground">
              Penjelasan tentang waktu-waktu shalat wajib
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRAYER_INFO.map((prayer) => {
              const Icon = prayer.icon;
              return (
                <Card key={prayer.name} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-emerald-600" />
                        <CardTitle className="text-lg">
                          {prayer.name}
                        </CardTitle>
                      </div>
                      <span className="text-xl arabic-text text-emerald-700">
                        {prayer.arabic}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {prayer.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{prayer.rakaat}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {prayer.sunnah}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600" />
                Catatan Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Metode Perhitungan:</strong> Jadwal shalat menggunakan
                metode perhitungan Kementerian Agama RI (KEMENAG) yang merupakan
                standar resmi di Indonesia.
              </p>
              <p>
                <strong>Lokasi:</strong> Waktu shalat dihitung berdasarkan
                koordinat Masjid Nurul Jannah. Untuk lokasi yang berbeda, waktu
                mungkin sedikit berbeda.
              </p>
              <p>
                <strong>Waktu Iqamah:</strong> Waktu iqamah di masjid mengikuti
                jeda yang tertera di atas setelah waktu adzan. Jamaah diharapkan
                hadir sebelum waktu iqamah.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
