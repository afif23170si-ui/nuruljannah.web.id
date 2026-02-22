import { Metadata } from "next";
import { getFinanceSummary, getFinanceList, getMonthlyReport } from "@/actions/finance";
import { getFunds } from "@/actions/ziswaf/funds";

import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import Image from "next/image";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { RecentTransactions } from "./RecentTransactions";
import { FinanceChart } from "./FinanceChart";

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

export default async function TransparansiPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const currentMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const currentYear = params.year ? parseInt(params.year) : now.getFullYear();
  
  const [summary, allFunds, monthlyReport, recentTransactions] = await Promise.all([
    getFinanceSummary(currentMonth, currentYear),
    getFunds({ isActive: true }),
    getMonthlyReport(currentYear),
    getFinanceList({
      limit: 50,
      startDate: new Date(currentYear, currentMonth - 1, 1),
      endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59),
    }),
  ]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ── Hero Section ── */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
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
        <div className="mb-8">
          <MonthPicker currentMonth={currentMonth} currentYear={currentYear} basePath="/keuangan" />
        </div>

        {/* ── 2-Column: Chart + Fund Balances ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          {/* Left: Chart */}
          <FinanceChart
            data={monthlyReport}
            currentMonth={currentMonth}
            year={currentYear}
          />

          {/* Right: Fund Balance List Card (Dark) */}
          <div className="bg-slate-900 rounded-2xl p-4 md:p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Saldo Per Kantong Dana</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Akumulasi seluruh periode</p>
            {summary.fundsAllTime.length > 0 ? (
              <div className="space-y-0">
                {summary.fundsAllTime.map((fund: any, idx: number) => {
                  const isOperasional = fund.fundType === "OPERASIONAL" || idx === 0;
                  return (
                    <div 
                      key={fund.fundId} 
                      className={`flex items-center justify-between py-2.5 ${
                        idx < summary.fundsAllTime.length - 1 ? 'border-b border-dashed border-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${
                          isOperasional ? 'bg-emerald-400' : 'bg-slate-600'
                        }`} />
                        <span className={`text-sm ${isOperasional ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {fund.fundName}
                        </span>
                      </div>
                      <span className={`font-bold tabular-nums ${
                        isOperasional 
                          ? 'text-emerald-400 text-[15px]' 
                          : fund.balance >= 0 ? 'text-slate-200 text-sm' : 'text-red-400 text-sm'
                      }`}>
                        {formatCurrency(fund.balance)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Belum ada data kantong dana
              </div>
            )}
          </div>
        </div>

        {/* ── Transaction Table ── */}
        <RecentTransactions 
          allFunds={allFunds.map((f: any) => ({ id: f.id, name: f.name }))}
          transactions={recentTransactions.map((tx: any) => ({
            id: tx.id,
            date: tx.date,
            description: tx.description,
            type: tx.type,
            fundId: tx.fundId,
            fundName: (tx as any).fund?.name,
            fundType: (tx as any).fund?.type,
            amount: Number(tx.amount),
          }))}
          summary={{
            income: summary.monthly.income,
            expense: summary.monthly.expense,
            balance: summary.monthly.balance,
          }}
        />

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
