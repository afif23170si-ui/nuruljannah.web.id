import { Metadata } from "next";
import { getFinanceSummary, getMonthlyReport, getFinanceList } from "@/actions/finance";
import { CATEGORY_LABELS } from "@/lib/finance-constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, BarChart3, Shield } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { RecentTransactions } from "./RecentTransactions";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transparansi Keuangan",
  description: "Laporan keuangan masjid yang transparan untuk jamaah",
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

export default async function TransparansiPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const currentMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const currentYear = params.year ? parseInt(params.year) : now.getFullYear();
  
  const summary = await getFinanceSummary(currentMonth, currentYear);
  const monthlyReport = await getMonthlyReport(currentYear);
  const recentTransactions = await getFinanceList({
    limit: 20,
    startDate: new Date(currentYear, currentMonth - 1, 1),
    endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59),
  });

  // Calculate totals
  const yearlyIncome = monthlyReport.reduce((sum, m) => sum + m.income, 0);
  const yearlyExpense = monthlyReport.reduce((sum, m) => sum + m.expense, 0);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ── Floating Hero Section ── */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
           {/* Hero Image */}
           <Image
              src="/hero-masjid.webp"
              alt="Laporan Keuangan Masjid Nurul Jannah"
              fill
              className="object-cover object-center opacity-80"
              priority
              sizes="100vw"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
           
           <div className="container relative z-10 mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/5 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
              Transparansi
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 md:mb-4 drop-shadow-sm">
              Laporan Keuangan
            </h1>
            <p className="text-white/70 text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
              Laporan keuangan masjid yang akuntabel dan terbuka untuk seluruh jamaah sebagai bentuk pertanggungjawaban amanah.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto w-full md:w-[96%] max-w-7xl px-4 md:px-0 py-12 md:py-16">
        
        {/* Month Picker */}
        <div className="mb-10">
          <MonthPicker currentMonth={currentMonth} currentYear={currentYear} basePath="/keuangan" />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Pemasukan */}
            <Card className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    + Pemasukan
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Pemasukan</p>
                  <p className="text-2xl font-serif font-bold text-gray-900">
                    {formatCurrency(summary.monthly.income)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pengeluaran */}
            <Card className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    - Pengeluaran
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Pengeluaran</p>
                  <p className="text-2xl font-serif font-bold text-gray-900">
                    {formatCurrency(summary.monthly.expense)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Saldo Bulan Ini */}
            <Card className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Saldo Bulan Ini</p>
                  <p className={`text-2xl font-serif font-bold ${summary.monthly.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {formatCurrency(summary.monthly.balance)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Saldo Kas */}
            <Card className="rounded-2xl border-gray-100 bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:shadow-2xl transition-all group">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Shield className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400">Total Saldo Kas</p>
                  <p className="text-3xl font-serif font-bold text-white">
                    {formatCurrency(summary.allTime.balance)}
                  </p>
                  {summary.openingBalance !== 0 && (
                    <p className="text-xs text-slate-500">Termasuk saldo awal: {formatCurrency(summary.openingBalance)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Category Breakdown */}
        {summary.categories.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {/* Pemasukan Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Rincian Pemasukan
              </h3>
              <div className="space-y-4">
                  {summary.categories
                    .filter((c) => c.type === "INCOME")
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                              {idx + 1}
                           </div>
                           <span className="font-medium text-gray-700 text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                        </div>
                        <span className="font-bold text-emerald-600 text-sm">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    ))}
                  {summary.categories.filter((c) => c.type === "INCOME").length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8 bg-gray-50 rounded-xl">
                      Belum ada pemasukan bulan ini
                    </p>
                  )}
              </div>
            </div>

            {/* Pengeluaran Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                Rincian Pengeluaran
              </h3>
              <div className="space-y-4">
                  {summary.categories
                    .filter((c) => c.type === "EXPENSE")
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-red-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                              {idx + 1}
                           </div>
                           <span className="font-medium text-gray-700 text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                        </div>
                        <span className="font-bold text-red-600 text-sm">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    ))}
                  {summary.categories.filter((c) => c.type === "EXPENSE").length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8 bg-gray-50 rounded-xl">
                      Belum ada pengeluaran bulan ini
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <RecentTransactions transactions={recentTransactions.map(tx => ({
          id: tx.id,
          date: tx.date,
          description: tx.description,
          category: tx.category,
          type: tx.type,
          amount: Number(tx.amount),
        }))} />

        {/* Footer Notes */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-600">Catatan:</strong> Laporan keuangan ini diperbarui secara real-time berdasarkan data yang diinput oleh bendahara masjid.
            Jika terdapat kekeliruan, silakan hubungi pengurus DKM.
          </p>
        </div>
      </div>
    </div>
  );
}
