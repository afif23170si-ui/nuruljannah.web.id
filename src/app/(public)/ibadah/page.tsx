import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Info,
  Mic2,
  AlarmClock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudMoon,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { PrayerTimesCard } from "@/components/ibadah/PrayerTimesCard";
import { WeeklySchedule } from "@/components/ibadah/WeeklySchedule";
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
      "Terbit fajar shadiq hingga terbit matahari.",
    rakaat: "2 rakaat",
    sunnah: "2 sblm",
    icon: Sunrise,
    offsetKey: "fajrOffset" as const,
  },
  {
    name: "Dzuhur",
    arabic: "الظهر",
    description:
      "Matahari tergelincir.",
    rakaat: "4 rakaat",
    sunnah: "2/4 sblm, 2 ssdh",
    icon: Sun,
    offsetKey: "dhuhrOffset" as const,
  },
  {
    name: "Ashar",
    arabic: "العصر",
    description:
      "Bayangan benda sama panjang.",
    rakaat: "4 rakaat",
    sunnah: "2/4 sblm",
    icon: CloudMoon,
    offsetKey: "asrOffset" as const,
  },
  {
    name: "Maghrib",
    arabic: "المغرب",
    description:
      "Matahari terbenam.",
    rakaat: "3 rakaat",
    sunnah: "2 ssdh",
    icon: Sunset,
    offsetKey: "maghribOffset" as const,
  },
  {
    name: "Isya",
    arabic: "العشاء",
    description:
      "Hilangnya mega merah.",
    rakaat: "4 rakaat",
    sunnah: "2 ssdh",
    icon: Moon,
    offsetKey: "ishaOffset" as const,
  },
];

export default async function IbadahPage() {
  const data = await getIbadahPublicData();

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Hero Section - Clean & Minimal with Image */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-masjid.webp"
              alt="Masjid Nurul Jannah"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          
          <div className="container relative z-10 mx-auto max-w-3xl text-center text-white pb-10 px-4">
            <Badge variant="outline" className="mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
              Jadwal & Kegiatan
            </Badge>
            
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 md:mb-4 drop-shadow-sm">
              Ibadah
            </h1>
            
            <p className="text-white/70 text-sm md:text-base mt-3 max-w-lg mx-auto">
              Informasi lengkap jadwal shalat, petugas, dan kegiatan ibadah harian di Masjid Nurul Jannah.
            </p>
          </div>
        </div>
      </section>

      {/* Prayer Times Card - Overlapping Hero */}
      <section className="px-4 -mt-16 md:-mt-20 relative z-20 mb-12 md:mb-20">
        <div className="container mx-auto max-w-5xl">
          <PrayerTimesCard />
        </div>
      </section>

      {/* Adzan & Jumat Info */}
      <section className="mb-12 md:mb-20 px-4 md:px-0">
        <div className="mx-auto w-full md:w-[96%] max-w-7xl">
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            
            {/* Adzan & Iqomah */}
            <div className="space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Adzan & Iqomah</h2>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-1">
                <div className="grid grid-cols-1 divide-y divide-gray-50">
                  {PRAYER_INFO.map((prayer) => (
                    <div key={prayer.name} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <prayer.icon className="w-4 h-4" />
                         </div>
                         <span className="font-medium text-gray-700">{prayer.name}</span>
                      </div>
                      <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        +{data.prayerSettings[prayer.offsetKey]} menit
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 px-2">
                * Waktu iqomah dihitung setelah adzan selesai berkumandang.
              </p>
            </div>

            {/* Shalat Jumat */}
            <div className="space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Shalat Jumat</h2>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
                {data.upcomingKhutbah ? (
                  <div className="space-y-5">
                    {/* Tanggal */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Jumat, {new Date(data.upcomingKhutbah.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>

                    {/* Judul Khutbah */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {data.upcomingKhutbah.title}
                      </h3>
                      {data.upcomingKhutbah.theme && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          {data.upcomingKhutbah.theme}
                        </span>
                      )}
                    </div>

                    {/* Petugas */}
                    <div className="pt-4 border-t border-gray-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Khatib</span>
                        <span className="text-sm font-semibold text-gray-900">{data.upcomingKhutbah.khatib}</span>
                      </div>
                      {data.upcomingKhutbah.muadzin && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">Bilal / Muadzin</span>
                          <span className="text-sm font-semibold text-gray-900">{data.upcomingKhutbah.muadzin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400">Jadwal Jumat belum tersedia</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="mb-12 md:mb-20 px-4 md:px-0">
        <div className="mx-auto w-full md:w-[96%] max-w-7xl bg-emerald-950 py-16 md:py-24 rounded-2xl md:rounded-3xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 px-4 md:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Petugas Ibadah</h2>
              <p className="text-emerald-200/80 text-xs md:text-sm">Jadwal Imam dan Muadzin harian</p>
            </div>

            <WeeklySchedule schedule={data.weeklySchedule} variant="light" />
          </div>
        </div>
      </section>
      
      {/* Khutbah Archive */}
      {data.recentKhutbah && data.recentKhutbah.length > 0 && (
         <section className="mb-20 px-4 md:px-0">
            <div className="mx-auto w-full md:w-[96%] max-w-7xl">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Arsip Khutbah</h2>
                  {/* Could add a 'View All' link here in future */}
               </div>
               
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.recentKhutbah.map((k) => (
                     <div key={k.id} className="group p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                           <BookOpen className="w-3.5 h-3.5" />
                           <span>{new Date(k.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors line-clamp-2">
                           {k.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">{k.khatib}</p>
                        {k.summary && (
                           <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {k.summary}
                           </p>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </section>
      )}

      {/* Footer Notes */}
      <section className="px-4 pb-10">
         <div className="container mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
               <Info className="w-3.5 h-3.5" />
               <span>Waktu shalat mengacu pada standar Kemenag RI sesuai lokasi masjid.</span>
            </div>
         </div>
      </section>

    </div>
  );
}
