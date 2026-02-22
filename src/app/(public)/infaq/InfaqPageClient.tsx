"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ZiswafPaymentUI, BankAccount, EWallet } from "@/components/public/ZiswafPaymentUI";

// ── Types ────────────────────────────────────────────────────

interface Donation {
  id: string;
  amount: number;
  description: string;
  fundId?: string;
  date: Date;
  donorName: string | null;
  paymentMethod?: string | null;
  isAnonymous?: boolean;
  displayName?: string;
  type?: string;
  fundName?: string;
}

interface InfaqStats {
  totalBulanIni: number;
  jumlahDonatur: number;
}

interface InfaqPageClientProps {
  bankAccounts: BankAccount[];
  ewallets: EWallet[];
  qrisImageUrl: string | null;
  recentDonations: Donation[];
  stats: InfaqStats;
  summary: any;
  month: number;
  year: number;
}

// ── Helpers ──────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function timeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 30) return `${days} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Animations ───────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ── Component ────────────────────────────────────────────────

export function InfaqPageClient({
  bankAccounts,
  ewallets,
  qrisImageUrl,
  recentDonations,
  stats,
  month,
  year,
}: InfaqPageClientProps) {
  const router = useRouter();
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const navigateMonth = (direction: "prev" | "next") => {
    let newMonth = direction === "prev" ? month - 1 : month + 1;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear--; }
    if (newMonth > 12) { newMonth = 1; newYear++; }
    // Don't navigate to future months
    if (newYear > now.getFullYear() || (newYear === now.getFullYear() && newMonth > now.getMonth() + 1)) return;
    router.push(`/infaq?month=${newMonth}&year=${newYear}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Floating Hero Section ── */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[200px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
          <Image
            src="/hero-masjid.webp"
            alt="Infaq Masjid Nurul Jannah"
            fill
            className="object-cover object-center opacity-80"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl opacity-30" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center pb-6 md:pb-12">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <Badge variant="outline" className="mb-2 md:mb-4 py-1 md:py-1.5 px-2.5 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[8px] md:text-[10px]">
                  Infaq Online
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-serif text-2xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
                Infaq Masjid
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/70 text-xs md:text-base mt-1 md:mt-3 max-w-lg mx-auto leading-relaxed">
                &ldquo;Kamu tidak akan memperoleh kebajikan (yang sempurna) sebelum kamu menginfakkan sebagian harta yang kamu cintai&rdquo; (QS. Ali &lsquo;Imran:92)
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Payment Methods ── */}
      <ZiswafPaymentUI 
        bankAccounts={bankAccounts} 
        ewallets={ewallets} 
        qrisImageUrl={qrisImageUrl} 
        title="Pilihan Berinfaq"
      />

      {/* ── Jejak Kebaikan (Social Proof) ── */}
      <section className="bg-white py-12 md:py-24">
        <div className="mx-auto w-full md:w-[96%] max-w-3xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8 md:mb-10"
          >
            <motion.div variants={fadeUp}>
              <div className="w-12 h-1 bg-emerald-500 rounded-full mb-4 mx-auto" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
                Jejak Kebaikan
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Donasi terbaru dari para dermawan
              </p>
            </motion.div>

            {/* Month Selector */}
            <motion.div variants={fadeUp} className="mt-5 md:mt-6 inline-flex items-center gap-1 bg-gray-50 rounded-full border border-gray-100 px-1 py-1">
              <button
                onClick={() => navigateMonth("prev")}
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[140px] md:min-w-[160px] text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                onClick={() => navigateMonth("next")}
                disabled={isCurrentMonth}
                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:shadow-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Compact Stats */}
            {(stats.totalBulanIni > 0 || recentDonations.filter(d => d.type === "INCOME").length > 0) && (() => {
              const incomeCount = recentDonations.filter(d => d.type === "INCOME").length;
              const donaturCount = stats.jumlahDonatur || incomeCount;
              return (
                <motion.div variants={fadeUp} className="mt-6 inline-flex items-center gap-4 bg-emerald-50 rounded-full px-5 py-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-sm font-semibold">{donaturCount}</span>
                    <span className="text-xs text-emerald-600/70">donatur</span>
                  </div>
                  <div className="w-px h-4 bg-emerald-200" />
                  <div className="text-sm font-bold text-emerald-700">
                    {formatCurrency(stats.totalBulanIni || recentDonations.filter(d => d.type === "INCOME").reduce((s, d) => s + d.amount, 0))}
                    <span className="text-xs font-normal text-emerald-600/70 ml-1">bulan ini</span>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>

          {/* Donation Feed */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-8"
          >
            {recentDonations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {recentDonations.filter(d => d.type === "INCOME").slice(0, 8).map((donation) => {
                  // Determine badge color based on fund name
                  const fundLower = donation.fundName?.toLowerCase() || "";
                  let badgeColors = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  if (fundLower.includes("sosial")) {
                    badgeColors = "bg-blue-50 text-blue-700 border-blue-100";
                  } else if (fundLower.includes("pembangunan") || fundLower.includes("infrastruktur")) {
                    badgeColors = "bg-amber-50 text-amber-700 border-amber-100";
                  } else if (fundLower.includes("yatim") || fundLower.includes("zakat")) {
                    badgeColors = "bg-purple-50 text-purple-700 border-purple-100";
                  }

                  return (
                    <motion.div
                      key={donation.id}
                      variants={fadeUp}
                      className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md hover:border-emerald-100 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900 block truncate">
                            {donation.donorName 
                              ? (donation.isAnonymous ? "Hamba Allah" : donation.donorName)
                              : donation.description}
                          </span>
                          <span className="text-sm font-bold text-emerald-600 tabular-nums flex-shrink-0 group-hover:text-emerald-500 transition-colors">
                            {formatCurrency(donation.amount)}
                          </span>
                        </div>
                        
                        <span className="text-xs text-gray-500 block truncate mb-2.5 line-clamp-1">
                          {donation.donorName && !donation.isAnonymous && donation.description 
                            ? donation.description
                            : "Donasi masuk"}
                        </span>

                        <div className="flex items-center justify-between gap-2">
                          <div className={`px-2 py-0.5 rounded-md border text-[10px] font-medium inline-flex items-center ${badgeColors}`}>
                            {donation.fundName || "Operasional"}
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {timeAgo(donation.date)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Heart className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Belum ada donasi bulan ini</p>
                <p className="text-gray-400 text-xs mt-1">Jadilah yang pertama untuk berinfaq!</p>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mt-10 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span className="font-serif italic">Jazakallahu khairan katsiran</span>
            </div>
            <div>
              <a href="/keuangan" className="text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors inline-flex items-center gap-2 group">
                Lihat laporan keuangan lengkap
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
