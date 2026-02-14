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
} from "lucide-react";
import { PrayerTimesWidget } from "@/components/home/PrayerTimesWidget";

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
  },
  {
    name: "Dzuhur",
    arabic: "الظهر",
    description:
      "Waktu shalat Dzuhur dimulai setelah matahari tergelincir dari tengah langit.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum, 2 rakaat sesudah",
    icon: Sun,
  },
  {
    name: "Ashar",
    arabic: "العصر",
    description:
      "Waktu shalat Ashar dimulai ketika bayangan benda sama panjang dengan bendanya.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum (tidak mu'akkad)",
    icon: CloudMoon,
  },
  {
    name: "Maghrib",
    arabic: "المغرب",
    description:
      "Waktu shalat Maghrib dimulai saat matahari terbenam hingga hilangnya mega merah.",
    rakaat: "3 rakaat",
    sunnah: "2 rakaat sesudah",
    icon: Sunset,
  },
  {
    name: "Isya",
    arabic: "العشاء",
    description:
      "Waktu shalat Isya dimulai setelah hilangnya mega merah hingga pertengahan malam.",
    rakaat: "4 rakaat",
    sunnah: "2 rakaat sesudah",
    icon: Moon,
  },
];

export default function IbadahPage() {
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
            {/* Adzan & Iqomah */}
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
                  {[
                    { shalat: "Subuh", jeda: "15 menit" },
                    { shalat: "Dzuhur", jeda: "10 menit" },
                    { shalat: "Ashar", jeda: "10 menit" },
                    { shalat: "Maghrib", jeda: "5 menit" },
                    { shalat: "Isya", jeda: "10 menit" },
                  ].map((item) => (
                    <div
                      key={item.shalat}
                      className="flex justify-between items-center rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">
                        {item.shalat}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        +{item.jeda}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * Jeda iqomah dapat berubah sewaktu-waktu
                </p>
              </CardContent>
            </Card>

            {/* Shalat Jumat */}
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
                <p className="text-sm text-muted-foreground">
                  Jamaah diharapkan hadir sebelum adzan kedua. Disunnahkan
                  mandi, memakai pakaian terbaik, dan memperbanyak shalawat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Imam & Muadzin */}
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
        </div>
      </section>

      {/* Prayer Information */}
      <section className="py-12 md:py-16">
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
      <section className="py-12 md:py-16 bg-muted/30">
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
