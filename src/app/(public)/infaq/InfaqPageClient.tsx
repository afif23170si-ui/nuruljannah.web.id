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
  Target,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// ── Dummy Data ───────────────────────────────────────────────

const STATS = {
  totalBulanIni: 12_750_000,
  targetBulanan: 25_000_000,
  jumlahDonatur: 48,
};

const RECENT_DONATIONS = [
  { name: "Hamba Allah", amount: 500_000, time: "2 menit lalu", type: "QRIS" },
  { name: "Ahmad S.", amount: 1_000_000, time: "15 menit lalu", type: "Transfer" },
  { name: "Hamba Allah", amount: 100_000, time: "1 jam lalu", type: "QRIS" },
  { name: "Siti R.", amount: 250_000, time: "2 jam lalu", type: "E-Wallet" },
  { name: "Hamba Allah", amount: 2_000_000, time: "3 jam lalu", type: "Transfer" },
  { name: "Budi P.", amount: 150_000, time: "5 jam lalu", type: "QRIS" },
];

const BANK_ACCOUNTS = [
  {
    bank: "Bank Syariah Indonesia (BSI)",
    accountNumber: "712 345 6789",
    accountName: "Masjid Nurul Jannah",
    logo: "🏦",
  },
  {
    bank: "Bank Muamalat",
    accountNumber: "301 234 5678",
    accountName: "Masjid Nurul Jannah",
    logo: "🏛️",
  },
];

const EWALLETS = [
  { name: "GoPay", number: "0812-3456-7890", logo: "💚" },
  { name: "DANA", number: "0812-3456-7890", logo: "💙" },
  { name: "ShopeePay", number: "0812-3456-7890", logo: "🧡" },
];

// ── Helpers ──────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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

export function InfaqPageClient() {
  const progress = Math.min(
    100,
    (STATS.totalBulanIni / STATS.targetBulanan) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Banner ── */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/bg-nj.webp"
          alt="Infaq Masjid Nurul Jannah"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1 text-sm font-normal tracking-wide">
                Infaq Online
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white drop-shadow-lg">
              Salurkan Infaq Anda <span className="italic text-emerald-300">Mudah</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-white/80 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Berkontribusi untuk kemakmuran masjid secara digital. Aman, transparan, dan mudah.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats + Progress ── */}
      <section className="container mx-auto px-4 sm:px-6 -mt-6 md:-mt-10 relative z-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          {/* Total Infaq */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl border border-zinc-100 shadow-lg shadow-emerald-900/5 p-5 md:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                Bulan Ini
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-emerald-950 tabular-nums">
              {formatCurrency(STATS.totalBulanIni)}
            </p>
          </motion.div>

          {/* Progress Target */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl border border-zinc-100 shadow-lg shadow-emerald-900/5 p-5 md:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                Target
              </span>
            </div>
            <p className="text-lg font-bold text-emerald-950 mb-2 tabular-nums">
              {formatCurrency(STATS.targetBulanan)}
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1.5">
              {progress.toFixed(0)}% tercapai
            </p>
          </motion.div>

          {/* Jumlah Donatur */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl border border-zinc-100 shadow-lg shadow-emerald-900/5 p-5 md:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                Donatur
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-emerald-950 tabular-nums">
              {STATS.jumlahDonatur}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">orang bulan ini</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Payment Methods ── */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Section title */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-emerald-950 mb-3">
              Pilih Metode Pembayaran
            </h2>
            <p className="text-zinc-500 text-sm md:text-base font-light">
              Kami menyediakan berbagai metode untuk kemudahan Anda.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            {/* QRIS Card */}
            <motion.div
              variants={fadeUp}
              className="lg:row-span-2 bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-3xl p-6 md:p-8 text-white flex flex-col items-center text-center"
            >
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
                <QrCode className="w-7 h-7 text-emerald-200" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Scan QRIS</h3>
              <p className="text-emerald-200/70 text-sm font-light mb-6">
                Scan QR Code di bawah menggunakan aplikasi e-banking atau
                e-wallet Anda.
              </p>

              {/* QR Placeholder */}
              <div className="bg-white rounded-2xl p-4 mb-5 shadow-lg">
                <div className="w-48 h-48 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-20 h-20 text-zinc-300 mx-auto mb-2" />
                    <span className="text-xs text-zinc-400">QR Code QRIS</span>
                  </div>
                </div>
              </div>

              <p className="text-emerald-300/60 text-xs">
                Berlaku untuk semua aplikasi pembayaran
              </p>
            </motion.div>

            {/* Bank Transfer */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-zinc-900">
                  Transfer Bank
                </h3>
              </div>

              <div className="space-y-4">
                {BANK_ACCOUNTS.map((bank) => (
                  <BankCard key={bank.bank} {...bank} />
                ))}
              </div>
            </motion.div>

            {/* E-Wallet */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-zinc-900">
                  E-Wallet
                </h3>
              </div>

              <div className="space-y-3">
                {EWALLETS.map((wallet) => (
                  <EWalletCard key={wallet.name} {...wallet} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Recent Donations (Transparency) ── */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-emerald-950 mb-3">
                Transparansi Donasi
              </h2>
              <p className="text-zinc-500 text-sm md:text-base font-light">
                Daftar infaq terbaru yang diterima oleh masjid.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              {RECENT_DONATIONS.map((donation, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`flex items-center justify-between px-5 md:px-6 py-4 ${
                    idx < RECENT_DONATIONS.length - 1
                      ? "border-b border-zinc-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">
                        {donation.name}
                      </p>
                      <p className="text-xs text-zinc-400">{donation.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700 tabular-nums">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {donation.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              className="text-center mt-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Jazakallahu khairan atas infaq Anda
              </div>
            </motion.div>
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
  logo,
}: {
  bank: string;
  accountNumber: string;
  accountName: string;
  logo: string;
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
        <span className="text-lg">{logo}</span>
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
        <span className="text-lg">{logo}</span>
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
