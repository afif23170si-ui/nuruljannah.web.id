// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getFinanceSummary, getFinanceList } from "@/actions/finance";
import { getFunds } from "@/actions/ziswaf/funds";
import { CATEGORY_LABELS, FUND_TYPE_LABELS } from "@/lib/finance-constants";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTransactionList } from "./AdminTransactionList";
import { MonthPicker } from "@/components/ui/MonthPicker";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Shield,
  HandHeart,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Kelola Keuangan - Admin Panel",
  description: "Manajemen laporan keuangan dan transparansi infaq",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default async function FinanceAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const currentMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const currentYear = params.year ? parseInt(params.year) : now.getFullYear();

  const summary = await getFinanceSummary(currentMonth, currentYear);

  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
  const recentTransactions = await getFinanceList({ limit: 50, startDate, endDate });
  const allFunds = await getFunds({ isActive: true });

  const isCurrentMonth = currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear();
  const periodLabel = `${MONTH_NAMES[currentMonth - 1]} ${currentYear}`;

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Keuangan Masjid" 
        description={`Laporan keuangan periode ${periodLabel}`}
        action={
          <div className="flex gap-2">
             <Link href="/admin/keuangan/laporan">
               <Button variant="outline" className="gap-2 bg-white border-gray-200 hover:bg-gray-50 hover:text-blue-600">
                 <FileText className="h-4 w-4" />
                 Laporan
               </Button>
             </Link>
             <Link href="/admin/keuangan/new">
               <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                 <Plus className="h-4 w-4" />
                 Transaksi Baru
               </Button>
             </Link>
          </div>
        }
      />

      {/* Month Picker */}
      <div className="mb-4 md:mb-6">
        <MonthPicker currentMonth={currentMonth} currentYear={currentYear} basePath="/admin/keuangan" />
      </div>

      {/* Summary — Compact */}
      <div className="space-y-3 mb-6 md:mb-8">
        {/* Monthly Overview */}
        <div className="metron-card p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Pemasukan */}
            <div className="pb-3 md:pb-0 md:pr-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  {isCurrentMonth ? "Masuk" : "Masuk"}
                </span>
              </div>
              <p className="text-xl md:text-xl font-bold text-green-600">{formatCurrency(summary.monthly.income)}</p>
              <span className="text-[10px] text-gray-400">{summary.monthly.incomeCount} transaksi</span>
            </div>
            {/* Pengeluaran */}
            <div className="py-3 md:py-0 md:px-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Keluar</span>
              </div>
              <p className="text-xl md:text-xl font-bold text-red-600">{formatCurrency(summary.monthly.expense)}</p>
              <span className="text-[10px] text-gray-400">{summary.monthly.expenseCount} transaksi</span>
            </div>
            {/* Saldo */}
            <div className="pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Saldo</span>
              </div>
              <p className={`text-lg md:text-xl font-bold ${summary.monthly.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {formatCurrency(summary.monthly.balance)}
              </p>
              <span className="text-[10px] text-gray-400">{summary.monthly.balance >= 0 ? "Surplus" : "Defisit"}</span>
            </div>
          </div>
        </div>

        {/* Fund Balances - Dynamic Grid */}
        {summary.fundsAllTime.length > 0 && (
          <div className={`grid gap-3 ${summary.fundsAllTime.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : summary.fundsAllTime.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'}`}>
            {summary.fundsAllTime.map((fund: any, idx: number) => (
              <div key={fund.fundId} className={`rounded-xl p-4 ${idx === 0 ? 'bg-slate-900' : 'bg-gray-50 border border-gray-100'}`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {idx === 0 ? (
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Wallet className="h-3.5 w-3.5 text-gray-500" />
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wide truncate ${idx === 0 ? 'text-slate-400' : 'text-gray-500'}`}>
                    {fund.fundName}
                  </span>
                </div>
                <p className={`text-base md:text-lg font-bold ${idx === 0 ? 'text-white' : fund.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                  {formatCurrency(fund.balance)}
                </p>
                <span className={`text-[10px] ${idx === 0 ? 'text-slate-500' : 'text-gray-400'}`}>
                  {fund.balance >= 0 ? 'Seluruh periode' : 'Defisit'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {summary.fundsMonthly.length > 0 && (
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-6 md:mb-8">
          <AdminCard title="Pemasukan per Kantong Dana">
              <div className="space-y-4">
                {summary.fundsMonthly
                  .filter((f) => f.income > 0)
                  .sort((a, b) => b.income - a.income)
                  .map((fund) => (
                    <div
                      key={fund.fundId}
                      className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded bg-green-50 text-green-600 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4" />
                         </div>
                         <span className="text-sm font-semibold text-gray-700">{fund.fundName}</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatCurrency(fund.income)}
                      </span>
                    </div>
                  ))}
                {summary.fundsMonthly.filter((f) => f.income > 0).length ===
                  0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Belum ada pemasukan bulan ini
                  </p>
                )}
              </div>
          </AdminCard>

          <AdminCard title="Pengeluaran per Kantong Dana">
              <div className="space-y-4">
                {summary.fundsMonthly
                  .filter((f) => f.expense > 0)
                  .sort((a, b) => b.expense - a.expense)
                  .map((fund) => (
                    <div
                      key={fund.fundId}
                      className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded bg-red-50 text-red-600 flex items-center justify-center">
                            <TrendingDown className="h-4 w-4" />
                         </div>
                         <span className="text-sm font-semibold text-gray-700">{fund.fundName}</span>
                      </div>
                      <span className="font-bold text-red-600">
                        {formatCurrency(fund.expense)}
                      </span>
                    </div>
                  ))}
                {summary.fundsMonthly.filter((f) => f.expense > 0)
                  .length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Belum ada pengeluaran bulan ini
                  </p>
                )}
              </div>
          </AdminCard>
        </div>
      )}

      <AdminTransactionList
        transactions={JSON.parse(JSON.stringify(recentTransactions))}
        funds={allFunds.map((f: any) => ({ id: f.id, name: f.name }))}
        periodLabel={periodLabel}
      />
    </div>
  );
}
