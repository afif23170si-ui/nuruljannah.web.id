import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, MapPin, Info } from "lucide-react";
import { PrayerTimesWidget } from "@/components/home/PrayerTimesWidget";

export const metadata: Metadata = {
  title: "Jadwal Shalat",
  description: "Jadwal waktu shalat harian di Masjid Nurul Jannah berdasarkan perhitungan Kemenag RI.",
};

const PRAYER_INFO = [
  {
    name: "Subuh",
    arabic: "الفجر",
    description: "Waktu shalat Subuh dimulai dari terbit fajar shadiq hingga terbit matahari.",
    rakaat: "2 rakaat",
    sunnah: "2 rakaat sebelum (Qabliyah)",
  },
  {
    name: "Dzuhur",
    arabic: "الظهر",
    description: "Waktu shalat Dzuhur dimulai setelah matahari tergelincir dari tengah langit.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum, 2 rakaat sesudah",
  },
  {
    name: "Ashar",
    arabic: "العصر",
    description: "Waktu shalat Ashar dimulai ketika bayangan benda sama panjang dengan bendanya.",
    rakaat: "4 rakaat",
    sunnah: "2/4 rakaat sebelum (tidak mu'akkad)",
  },
  {
    name: "Maghrib",
    arabic: "المغرب",
    description: "Waktu shalat Maghrib dimulai saat matahari terbenam hingga hilangnya mega merah.",
    rakaat: "3 rakaat",
    sunnah: "2 rakaat sesudah",
  },
  {
    name: "Isya",
    arabic: "العشاء",
    description: "Waktu shalat Isya dimulai setelah hilangnya mega merah hingga pertengahan malam.",
    rakaat: "4 rakaat",
    sunnah: "2 rakaat sesudah",
  },
];

export default function JadwalShalatPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Clock className="h-3 w-3 mr-1" />
            Waktu Shalat
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Jadwal Shalat</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jadwal waktu shalat berdasarkan perhitungan Kementerian Agama RI untuk lokasi Masjid Nurul Jannah
          </p>
        </div>
      </section>

      {/* Prayer Times Widget - Today */}
      <PrayerTimesWidget />

      {/* Prayer Information */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Informasi Waktu Shalat
            </h2>
            <p className="text-muted-foreground">
              Penjelasan tentang waktu-waktu shalat wajib
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRAYER_INFO.map((prayer) => (
              <Card key={prayer.name} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{prayer.name}</CardTitle>
                    <span className="text-xl arabic-text text-primary">
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
            ))}
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Catatan Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Metode Perhitungan:</strong> Jadwal shalat menggunakan metode
                perhitungan Kementerian Agama RI (KEMENAG) yang merupakan standar
                resmi di Indonesia.
              </p>
              <p>
                <strong>Lokasi:</strong> Waktu shalat dihitung berdasarkan koordinat
                Masjid Nurul Jannah. Untuk lokasi yang berbeda, waktu mungkin sedikit berbeda.
              </p>
              <p>
                <strong>Waktu Iqamah:</strong> Waktu iqamah di masjid biasanya 5-10
                menit setelah waktu adzan. Jamaah diharapkan hadir sebelum waktu iqamah.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
