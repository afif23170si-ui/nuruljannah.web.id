// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getDashboardStats } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  PenLine,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { QuickActions } from "@/components/admin/QuickActions";

export const metadata = {
  title: "Dashboard Admin - Nurul Jannah",
  description: "Pusat kontrol manajemen Masjid Nurul Jannah",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
         <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Dashboard Overview</h1>
         <p className="text-xs md:text-sm text-gray-500 mt-1">
            Selamat datang kembali, Admin. Berikut ringkasan hari ini.
         </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-4 px-1">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
         {/* Recent Articles (2 Cols) */}
         <div className="metron-card xl:col-span-2">
            <div className="px-4 md:px-6 py-3.5 md:py-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-900 text-base md:text-lg">Artikel Terbaru</h3>
               {stats.recentPosts.length > 0 && (
                 <Link href="/admin/artikel" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    LIHAT SEMUA
                 </Link>
               )}
            </div>
            <div className="p-0">
               {stats.recentPosts.length === 0 ? (
                  <div className="py-14 px-8 flex flex-col items-center text-center">
                     <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <PenLine className="w-6 h-6 text-blue-400" />
                     </div>
                     <p className="text-gray-500 font-medium text-sm mb-1">Belum ada artikel</p>
                     <p className="text-gray-400 text-xs mb-5">Mulai buat konten untuk jamaah masjid</p>
                     <Link href="/admin/artikel/new">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs">
                           <PenLine className="w-3.5 h-3.5" />
                           Buat Artikel Pertama
                        </Button>
                     </Link>
                  </div>
               ) : (
                  <div className="divide-y divide-gray-100">
                     {stats.recentPosts.map((post) => (
                        <div key={post.id} className="p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-gray-50/80 transition-colors">
                           <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                              <FileText className="h-4 w-4 md:h-5 md:w-5" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <Link href={`/admin/artikel/${post.id}`} className="text-sm font-bold text-gray-800 hover:text-blue-600 line-clamp-1 mb-1">
                                 {post.title}
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                 <span>{format(new Date(post.createdAt), "d MMM yyyy", { locale: id })}</span>
                                 <span>•</span>
                                 <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-4 ${post.status === "PUBLISHED" 
                                    ? "bg-green-50 text-green-700 border-green-100" 
                                    : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                    {post.status === "PUBLISHED" ? "Published" : post.status === "DRAFT" ? "Draft" : "Archived"}
                                 </Badge>
                              </div>
                           </div>
                           <Link href={`/admin/artikel/${post.id}`}>
                              <Button variant="outline" size="sm" className="h-8 text-xs shrink-0 border-gray-200 text-gray-600 hover:bg-gray-100">
                                 Edit
                              </Button>
                           </Link>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Recent Finance (1 Col) */}
         <div className="metron-card">
            <div className="px-4 md:px-6 py-3.5 md:py-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-900 text-base md:text-lg">Mutasi Terakhir</h3>
               <Link href="/admin/keuangan" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  LIHAT SEMUA
               </Link>
            </div>
            <div className="p-4">
               {stats.recentFinance.length === 0 ? (
                  <div className="py-10 text-center">
                     <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-5 h-5 text-gray-300" />
                     </div>
                     <p className="text-gray-400 text-sm">Belum ada transaksi</p>
                  </div>
               ) : (
                  <div className="space-y-3.5">
                     {stats.recentFinance.map((finance) => (
                        <div key={finance.id} className="flex items-center gap-2.5 md:gap-3 group">
                           <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center shrink-0 ${
                              finance.type === "INCOME" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                           }`}>
                              {finance.type === "INCOME" ? <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <TrendingDown className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-1">{finance.description}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <span className="text-[10px] text-gray-400">{format(new Date(finance.date), "dd MMM", { locale: id })}</span>
                                 <span className="text-[10px] text-gray-300">•</span>
                                 <span className={`text-[10px] font-medium px-1.5 py-0 rounded border ${
                                    finance.type === "INCOME" 
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                      : "bg-gray-50 text-gray-500 border-gray-100"
                                 }`}>
                                    {(finance as any).fundName || "Operasional"}
                                 </span>
                              </div>
                           </div>
                           <div className={`text-sm font-bold tabular-nums ${
                              finance.type === "INCOME" ? "text-emerald-600" : "text-red-500"
                           }`}>
                              {finance.type === "INCOME" ? "+" : "-"}{formatCurrency(Number(finance.amount)).replace("Rp", "")}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Upcoming Events */}
      {stats.upcomingEvents && stats.upcomingEvents.length > 0 && (
        <div className="metron-card">
          <div className="px-4 md:px-6 py-3.5 md:py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base md:text-lg">Agenda Masjid</h3>
            <Link href="/admin/agenda" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              KELOLA
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{event.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {event.isRecurring && event.dayOfWeek !== null
                          ? `Setiap ${DAY_NAMES[event.dayOfWeek]}`
                          : event.date
                          ? format(new Date(event.date), "d MMM", { locale: id })
                          : ""
                        }
                        {" · "}{event.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
