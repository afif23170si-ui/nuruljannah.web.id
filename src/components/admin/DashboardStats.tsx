"use client";

import Link from "next/link";
import { 
  Users, 
  FileText, 
  Wallet, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsProps {
  stats: {
    users: number;
    posts: number;
    publishedPosts: number;
    students: number;
    income: number;
    expense: number;
    balance: number;
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Artikel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24 text-blue-600 transform rotate-12 translate-x-4 -translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
               <FileText className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100">
               {stats.publishedPosts} Pub
            </Badge>
         </div>
         <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900">{stats.posts}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Artikel</p>
         </div>
      </div>

      {/* Pengguna */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-indigo-600 transform rotate-12 translate-x-4 -translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
               <Users className="w-6 h-6" />
            </div>
         </div>
         <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Pengguna</p>
         </div>
         <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[70%] rounded-full" />
         </div>
      </div>

      {/* Santri TPA */}
      <Link href="/admin/tpa" className="block bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap className="w-24 h-24 text-orange-600 transform rotate-12 translate-x-4 -translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
               <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowRight className="w-5 h-5" />
            </div>
         </div>
         <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900">{stats.students}</h3>
            <p className="text-sm text-gray-500 font-medium">Santri TPA</p>
         </div>
      </Link>

      {/* Keuangan */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group md:col-span-2 lg:col-span-1">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-emerald-600 transform rotate-12 translate-x-4 -translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
               <Wallet className="w-6 h-6" />
            </div>
         </div>
         <div className="relative z-10 mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.balance)}</h3>
            <p className="text-sm text-gray-500 font-medium">Saldo Kas Masjid</p>
         </div>
         <div className="grid grid-cols-2 gap-2 pt-4 border-t border-dashed border-gray-200 relative z-10">
            <div>
               <p className="text-xs text-gray-400 mb-1">Pemasukan</p>
               <p className="text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {formatCurrency(stats.income).split(',')[0]}
               </p>
            </div>
            <div>
               <p className="text-xs text-gray-400 mb-1">Pengeluaran</p>
               <p className="text-xs font-bold text-red-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {formatCurrency(stats.expense).split(',')[0]}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
