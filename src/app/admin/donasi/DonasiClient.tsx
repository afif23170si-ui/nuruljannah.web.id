"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Heart,
  Users,
  TrendingUp,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────

interface Donation {
  id: string;
  amount: number;
  description: string;
  date: Date;
  donorName: string | null;
  paymentMethod: string | null;
  isAnonymous: boolean;
  fundName: string;
  fundId: string;
  creatorName: string;
}

interface DonasiStats {
  totalBulanIni: number;
  jumlahDonatur: number;
  avgDonation: number;
  topFundName: string;
  topFundAmount: number;
  totalAllTime: number;
}

interface Fund {
  id: string;
  name: string;
}

interface DonasiClientProps {
  donations: Donation[];
  stats: DonasiStats;
  funds: Fund[];
  month: number;
  year: number;
  selectedFundId: string;
}

// ── Helpers ──────────────────────────────────────────────────

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace(".0", "")} Jt`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} Rb`;
  return amount.toString();
}

// ── Component ────────────────────────────────────────────────

export function DonasiClient({
  donations,
  stats,
  funds,
  month,
  year,
  selectedFundId,
}: DonasiClientProps) {
  const router = useRouter();
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const navigateMonth = (direction: "prev" | "next") => {
    let newMonth = direction === "prev" ? month - 1 : month + 1;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear--; }
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newYear > now.getFullYear() || (newYear === now.getFullYear() && newMonth > now.getMonth() + 1)) return;
    const params = new URLSearchParams();
    params.set("month", String(newMonth));
    params.set("year", String(newYear));
    if (selectedFundId) params.set("fundId", selectedFundId);
    router.push(`/admin/donasi?${params.toString()}`);
  };

  const handleFundFilter = (fundId: string) => {
    const params = new URLSearchParams();
    params.set("month", String(month));
    params.set("year", String(year));
    if (fundId) params.set("fundId", fundId);
    router.push(`/admin/donasi?${params.toString()}`);
  };

  const statCards = [
    {
      label: "Total Donasi",
      value: formatCurrency(stats.totalBulanIni),
      sub: `Bulan ${MONTH_NAMES[month - 1]}`,
      icon: Heart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Jumlah Donatur",
      value: stats.jumlahDonatur.toString(),
      sub: "Unik bulan ini",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Rata-rata Donasi",
      value: formatCurrency(stats.avgDonation),
      sub: "Per donatur",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Dana Terbanyak",
      value: stats.topFundName,
      sub: stats.topFundAmount > 0 ? formatCompact(stats.topFundAmount) : "-",
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Header + Month Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Donasi Masuk</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Monitoring dan rekap donasi yang diterima
          </p>
        </div>

        {/* Month Selector */}
        <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1 py-1 self-start">
          <button
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700 min-w-[130px] md:min-w-[150px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={() => navigateMonth("next")}
            disabled={isCurrentMonth}
            className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-3.5 md:p-5">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className={`p-1.5 md:p-2 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-base md:text-lg font-bold text-gray-900 truncate">{card.value}</p>
            <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* All-time total */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Donasi Sepanjang Waktu</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(stats.totalAllTime)}</p>
          </div>
        </div>
      </div>

      {/* Fund Filter + Donation Table */}
      <div className="metron-card">
        <div className="px-4 md:px-6 py-3.5 md:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-gray-900 text-base md:text-lg">Riwayat Donasi</h3>
          
          {/* Fund filter */}
          <select
            value={selectedFundId}
            onChange={(e) => handleFundFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full sm:w-auto"
          >
            <option value="">Semua Dana</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>{fund.name}</option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-gray-50">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div key={donation.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 hover:bg-gray-50/50 transition-colors">
                {/* Icon */}
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Heart className="h-4 w-4 text-emerald-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {donation.donorName
                          ? (donation.isAnonymous ? "Hamba Allah" : donation.donorName)
                          : donation.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] md:text-[11px] text-gray-400">
                          {format(new Date(donation.date), "dd MMM yyyy", { locale: localeId })}
                        </span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium bg-gray-100 text-gray-500">
                          {donation.fundName}
                        </span>
                        {donation.paymentMethod && (
                          <>
                            <span className="text-[10px] text-gray-300 hidden sm:inline">•</span>
                            <span className="text-[10px] text-gray-400 hidden sm:inline">{donation.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-600 tabular-nums whitespace-nowrap">
                      +{formatCurrency(donation.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 md:px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Belum ada donasi di bulan ini</p>
              <p className="text-xs text-gray-400 mt-1">Donasi yang masuk akan muncul di sini</p>
            </div>
          )}
        </div>

        {/* Summary footer */}
        {donations.length > 0 && (
          <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{donations.length} transaksi</span>
            <span className="text-sm font-bold text-gray-800">
              Total: {formatCurrency(donations.reduce((s, d) => s + d.amount, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
