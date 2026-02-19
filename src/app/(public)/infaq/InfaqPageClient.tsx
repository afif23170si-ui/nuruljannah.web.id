"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  QrCode,
  Building2,
  Smartphone,
  TrendingUp,
  Users,
  Copy,
  Check,
  Sparkles,
  Wallet,
  History,
} from "lucide-react";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/finance-constants";

// ── Types ────────────────────────────────────────────────────

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface EWallet {
  name: string;
  number: string;
  logo: string;
}

interface Donation {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  donorName: string | null;
  paymentMethod: string | null;
  isAnonymous: boolean;
  displayName: string;
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
  const hasPaymentMethods = bankAccounts.length > 0 || ewallets.length > 0 || qrisImageUrl;
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
  
  return (
    <div className="min-h-screen bg-white">
      {/* ── Floating Hero Section ── */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
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
          
          <div className="container relative z-10 mx-auto px-4 text-center pb-12">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
            >
            <motion.div variants={fadeUp}>
                <Badge variant="outline" className="mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
                  Infaq Online
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 md:mb-4 drop-shadow-sm">
                Salurkan Infaq <br />
                <span className="text-emerald-200">Dengan Mudah</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/70 text-sm md:text-base mt-3 max-w-lg mx-auto">
                Platform digital resmi Masjid Nurul Jannah untuk memudahkan jamaah dalam menyalurkan infaq, sedekah, dan wakaf secara transparan.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Cards (Overlapping) ── */}
      <section className="px-4 md:px-0 -mt-20 relative z-20 mb-16 md:mb-24">
        <motion.div
          className="container mx-auto max-w-5xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          {/* Month Picker */}
          <motion.div variants={fadeUp} className="mb-6">
            <MonthPicker currentMonth={month} currentYear={year} basePath="/infaq" variant="glass" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Total Infaq */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-emerald-900/5 p-6 md:p-8 flex items-center justify-between group hover:border-emerald-100 transition-colors"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-600/80 font-semibold mb-2">
                  {isCurrentMonth ? "Total Bulan Ini" : "Total Infaq"}
                </p>
                <p className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tabular-nums">
                  {formatCurrency(stats.totalBulanIni)}
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
            </motion.div>

            {/* Jumlah Donatur */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-emerald-900/5 p-6 md:p-8 flex items-center justify-between group hover:border-blue-100 transition-colors"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-600/80 font-semibold mb-2">
                  Donatur
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tabular-nums">
                    {stats.jumlahDonatur}
                  </p>
                  <span className="text-sm text-gray-400">orang</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Payment Methods ── */}
      {hasPaymentMethods && (
        <section className="mb-20 md:mb-32 px-4 md:px-0">
          <div className="mx-auto w-full md:w-[96%] max-w-7xl">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Metode Pembayaran
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Pilih metode yang paling memudahkan bagi Anda untuk menyalurkan kebaikan.
              </p>
            </motion.div>

            <motion.div
              className={`grid grid-cols-1 ${qrisImageUrl ? "lg:grid-cols-3" : bankAccounts.length > 0 && ewallets.length > 0 ? "lg:grid-cols-2" : ""} gap-6 md:gap-8`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {/* QRIS Card */}
              {qrisImageUrl && (
                <motion.div
                  variants={fadeUp}
                  className="lg:row-span-2 bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-3xl p-8 text-white flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="mb-6 p-4 bg-white rounded-2xl shadow-2xl">
                       <img
                        src={qrisImageUrl}
                        alt="QRIS Masjid Nurul Jannah"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">Scan QRIS</h3>
                    <p className="text-emerald-200/80 text-sm mb-6 max-w-xs">
                      Mendukung GoPay, OVO, Dana, LinkAja, ShopeePay, dan Mobile Banking.
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full text-emerald-200">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>NMID: ID123456789 (Contoh)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bank Accounts */}
              {bankAccounts.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Transfer Bank</h3>
                      <p className="text-sm text-gray-400">Konfirmasi otomatis</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {bankAccounts.map((bank) => (
                      <BankCard
                        key={bank.accountNumber}
                        bank={bank.bankName}
                        accountNumber={bank.accountNumber}
                        accountName={bank.accountName}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* E-Wallets */}
              {ewallets.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">E-Wallet</h3>
                      <p className="text-sm text-gray-400">Transfer via nomor HP</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ewallets.map((wallet) => (
                      <EWalletCard key={wallet.name} {...wallet} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Recent Donations ── */}
      <section className="bg-gray-50/50 py-20 md:py-32 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:w-[96%] max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl mb-4 shadow-sm">
               <History className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Jejak Kebaikan
            </h2>
            <p className="text-gray-500">
              Transparansi donasi yang diterima masjid.
            </p>
          </div>

          {recentDonations.length > 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-gray-50">
                {recentDonations.map((donation) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-5 md:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-0.5">
                          {donation.displayName}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                           <span>{timeAgo(donation.date)}</span>
                           <span>•</span>
                           <span>{donation.paymentMethod || "Tunai"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 tabular-nums">
                        {formatCurrency(donation.amount)}
                      </p>
                      <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-500 hover:bg-gray-200 text-[10px] uppercase tracking-wider font-normal">
                        {CATEGORY_LABELS[donation.category] || "Infaq"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="h-16 w-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500">Belum ada donasi tercatat bulan ini.</p>
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
               <Sparkles className="w-4 h-4" />
               <span className="font-serif italic">Jazakallahu khairan kastiran</span>
            </div>
            <div>
               <a href="/keuangan" className="text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 group">
                  Lihat laporan keuangan lengkap
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sub-Components ───────────────────────────────────────────

function BankCard({
  bank,
  accountNumber,
  accountName,
}: {
  bank: string;
  accountNumber: string;
  accountName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="w-4 h-4 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-500">{bank}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-zinc-800 tabular-nums tracking-wide">
            {accountNumber}
          </p>
          <p className="text-[11px] text-zinc-400">a.n. {accountName}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function EWalletCard({
  name,
  number,
  logo,
}: {
  name: string;
  number: string;
  logo: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(number.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{logo || "📱"}</span>
        <div>
          <p className="text-sm font-medium text-zinc-700">{name}</p>
          <p className="text-xs text-zinc-400 tabular-nums">{number}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
