// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Wallet,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Dashboard Admin - Metronic",
  description: "Dashboard admin Masjid Nurul Jannah",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const today = new Date();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
           <p className="text-sm text-gray-500 mt-1">
              Selamat datang kembali, Admin. Berikut ringkasan hari ini.
           </p>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/artikel/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                 <Plus className="h-4 w-4 mr-2" />
                 Artikel Baru
              </Button>
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Artikel */}
        <div className="metron-card p-6 flex flex-col justify-between h-full hover:border-blue-200 transition-colors group">
           <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-gray-900 tabular-nums">{stats.posts}</span>
                 <span className="text-sm font-semibold text-gray-500 mt-1">Total Artikel</span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                 <FileText className="h-5 w-5" />
              </div>
           </div>
           
           <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
              <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100">
                 {stats.publishedPosts} Published
              </Badge>
           </div>
        </div>

        {/* Pengguna */}
        <div className="metron-card p-6 flex flex-col justify-between h-full hover:border-indigo-200 transition-colors group">
           <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-gray-900 tabular-nums">{stats.users}</span>
                 <span className="text-sm font-semibold text-gray-500 mt-1">Pengguna Terdaftar</span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                 <Users className="h-5 w-5" />
              </div>
           </div>
           
           <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                 <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">Partisipasi Aktif</span>
           </div>
        </div>

        {/* Santri TPA */}
        <div className="metron-card p-6 flex flex-col justify-between h-full hover:border-orange-200 transition-colors group">
           <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-gray-900 tabular-nums">{stats.students}</span>
                 <span className="text-sm font-semibold text-gray-500 mt-1">Santri TPA</span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                 <GraduationCap className="h-5 w-5" />
              </div>
           </div>
           
           <div className="mt-auto flex items-center text-orange-600 text-sm font-medium cursor-pointer hover:underline">
              <Link href="/admin/tpa" className="flex items-center">
                 Lihat Data <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
           </div>
        </div>

        {/* Saldo Kas */}
        <div className="metron-card p-6 flex flex-col justify-between h-full hover:border-emerald-200 transition-colors group relative overflow-hidden">
           <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-gray-900 tabular-nums">{formatCurrency(stats.balance)}</span>
                 <span className="text-sm font-semibold text-gray-500 mt-1">Saldo Kas Masjid</span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Wallet className="h-5 w-5" />
              </div>
           </div>

           <div className="mt-auto pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-4">
              <div>
                 <span className="text-xs text-gray-400 block mb-1">Pemasukan</span>
                 <span className="font-bold flex items-center text-emerald-600 text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" /> {formatCurrency(stats.income).split(',')[0]}
                 </span>
              </div>
              <div>
                 <span className="text-xs text-gray-400 block mb-1">Pengeluaran</span>
                 <span className="font-bold flex items-center text-red-600 text-sm">
                    <TrendingDown className="h-3 w-3 mr-1" /> {formatCurrency(stats.expense).split(',')[0]}
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Recent Articles (2 Cols) */}
         <div className="metron-card xl:col-span-2">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-900 text-lg">Artikel Terbaru</h3>
               <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                  <MoreHorizontal className="h-5 w-5" />
               </Button>
            </div>
            <div className="p-0">
               {stats.recentPosts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">Belum ada artikel</div>
               ) : (
                  <div className="divide-y divide-gray-100">
                     {stats.recentPosts.map((post) => (
                        <div key={post.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                           <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                              <FileText className="h-6 w-6" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <Link href={`/admin/artikel/${post.id}`} className="text-sm font-bold text-gray-800 hover:text-blue-600 line-clamp-1 mb-1">
                                 {post.title}
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                 <span>{format(new Date(post.createdAt), "d MMM yyyy", { locale: id })}</span>
                                 <span>•</span>
                                 <span className={post.status === "PUBLISHED" ? "text-green-600 font-medium" : "text-gray-400"}>
                                    {post.status}
                                 </span>
                              </div>
                           </div>
                           <Button variant="outline" size="sm" className="h-8 text-xs shrink-0 border-gray-200 text-gray-600 hover:bg-gray-100">
                              Edit
                           </Button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Recent Finance (1 Col) */}
         <div className="metron-card">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-900 text-lg">Mutasi Terakhir</h3>
               <Link href="/admin/keuangan" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  LIHAT SEMUA
               </Link>
            </div>
            <div className="p-4">
               {stats.recentFinance.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">Belum ada data</div>
               ) : (
                  <div className="space-y-4">
                     {stats.recentFinance.map((finance) => (
                        <div key={finance.id} className="flex items-center gap-3">
                           <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                              finance.type === "INCOME" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                           }`}>
                              {finance.type === "INCOME" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-1">{finance.description}</p>
                              <p className="text-xs text-gray-500">{format(new Date(finance.date), "dd MMM", { locale: id })}</p>
                           </div>
                           <div className={`text-sm font-bold ${
                              finance.type === "INCOME" ? "text-green-600" : "text-gray-800"
                           }`}>
                              {finance.type === "INCOME" ? "+" : "-"} {formatCurrency(Number(finance.amount)).replace("Rp", "")}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
