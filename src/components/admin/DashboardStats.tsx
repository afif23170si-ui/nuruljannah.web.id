"use client";

import Link from "next/link";
import { 
  Users, 
  FileText, 
  Wallet, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  PenLine
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FundBalance {
  id: string;
  name: string;
  balance: number;
}

interface DashboardStatsProps {
  stats: {
    users: number;
    posts: number;
    publishedPosts: number;
    students: number;
    income: number;
    expense: number;
    balance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    fundBalances: FundBalance[];
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

function formatCompact(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace('.0', '')} Jt`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} Rb`;
  return amount.toString();
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
      {/* Total Artikel */}
      <Link href="/admin/artikel" className="block bg-white rounded-xl border border-gray-100 p-3.5 md:p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-3 md:p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
            <FileText className="w-16 h-16 md:w-24 md:h-24 text-blue-600 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
            <div className="p-2 md:p-2.5 bg-blue-50 rounded-lg md:rounded-xl text-blue-600">
               <FileText className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            {stats.posts > 0 ? (
              <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 text-[9px] md:text-[10px] px-1.5 py-0">
                 {stats.publishedPosts} <span className="hidden sm:inline ml-1">Pub</span>
              </Badge>
            ) : (
              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            )}
         </div>
         <div className="relative z-10">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{stats.posts}</h3>
            <p className="text-[11px] md:text-sm text-gray-500 font-medium leading-tight mt-0.5">Total Artikel</p>
            {stats.posts === 0 && (
              <p className="text-[10px] md:text-xs text-blue-500 mt-1.5 md:mt-2 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <PenLine className="w-3 h-3" /> <span className="hidden sm:inline">Buat pertama</span>
              </p>
            )}
         </div>
      </Link>

      {/* Pengguna */}
      <div className="bg-white rounded-xl border border-gray-100 p-3.5 md:p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-3 md:p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
            <Users className="w-16 h-16 md:w-24 md:h-24 text-blue-600 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
            <div className="p-2 md:p-2.5 bg-blue-50 rounded-lg md:rounded-xl text-blue-600">
               <Users className="w-4 h-4 md:w-5 md:h-5" />
            </div>
         </div>
         <div className="relative z-10">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{stats.users}</h3>
            <p className="text-[11px] md:text-sm text-gray-500 font-medium leading-tight mt-0.5">Total Pengguna</p>
         </div>
      </div>

      {/* Santri TPA */}
      <Link href="/admin/tpa" className="block bg-white rounded-xl border border-gray-100 p-3.5 md:p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-3 md:p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
            <GraduationCap className="w-16 h-16 md:w-24 md:h-24 text-blue-600 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4" />
         </div>
         <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
            <div className="p-2 md:p-2.5 bg-blue-50 rounded-lg md:rounded-xl text-blue-600">
               <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
         </div>
         <div className="relative z-10">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{stats.students}</h3>
            <p className="text-[11px] md:text-sm text-gray-500 font-medium leading-tight mt-0.5">Santri TPA</p>
            {stats.students === 0 && (
              <p className="text-[10px] md:text-xs text-blue-500 mt-1.5 md:mt-2 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3" /> <span className="hidden sm:inline">Kelola santri</span>
              </p>
            )}
         </div>
      </Link>

      {/* Keuangan - Per Fund Balances */}
      <Link href="/admin/keuangan" className="col-span-2 lg:col-span-1 block bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-[0.04]">
            <Wallet className="w-20 h-20 md:w-24 md:h-24 text-blue-600 transform rotate-12 translate-x-2 -translate-y-2" />
         </div>
         
         {/* Header */}
         <div className="flex justify-between items-center mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 md:p-2.5 bg-blue-50 rounded-lg md:rounded-xl text-blue-600">
                 <Wallet className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo Dana</span>
            </div>
            <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowRight className="w-4 h-4" />
            </div>
         </div>

         {/* Per-fund list */}
         <div className="relative z-10 space-y-1.5 md:space-y-2 mb-3">
            {stats.fundBalances.length > 0 ? (
              stats.fundBalances.map((fund) => (
                <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-[11px] md:text-xs text-gray-500 font-medium truncate mr-2">{fund.name}</span>
                  <span className={`text-[11px] md:text-xs font-bold tabular-nums whitespace-nowrap ${fund.balance >= 0 ? "text-gray-800" : "text-red-500"}`}>
                    {formatCurrency(fund.balance)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-400">Belum ada dana</p>
            )}
         </div>

         {/* Total + Monthly Summary */}
         <div className="relative z-10 pt-2.5 md:pt-3 border-t border-dashed border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-sm md:text-base font-bold text-gray-900 tabular-nums">{formatCurrency(stats.balance)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] md:text-[11px] font-bold text-emerald-600 flex items-center">
                 <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" />
                 +{formatCompact(stats.monthlyIncome)}<span className="text-gray-400 font-medium ml-0.5">/bln</span>
              </p>
              <p className="text-[10px] md:text-[11px] font-bold text-red-500 flex items-center">
                 <TrendingDown className="w-3 h-3 mr-0.5 shrink-0" />
                 -{formatCompact(stats.monthlyExpense)}<span className="text-gray-400 font-medium ml-0.5">/bln</span>
              </p>
            </div>
         </div>
      </Link>
    </div>
  );
}
