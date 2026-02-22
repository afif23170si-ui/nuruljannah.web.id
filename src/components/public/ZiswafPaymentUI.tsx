"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Copy, Check, Download } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  imageUrl?: string;
}

export interface EWallet {
  name: string;
  number: string;
  logo?: string;
  imageUrl?: string;
}

interface ZiswafPaymentUIProps {
  bankAccounts: BankAccount[];
  ewallets: EWallet[];
  qrisImageUrl: string | null;
  title?: string;
  subtitle?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function ZiswafPaymentUI({
  bankAccounts,
  ewallets,
  qrisImageUrl,
  title = "Pilihan Pembayaran",
  subtitle = "Salurkan donasi terbaik Anda melalui berbagai kemudahan metode pembayaran di bawah ini.",
}: ZiswafPaymentUIProps) {
  const hasPaymentMethods = bankAccounts.length > 0 || ewallets.length > 0 || qrisImageUrl;

  if (!hasPaymentMethods) return null;

  return (
    <section className="bg-white py-12 md:py-20 relative z-20">
      <div className="mx-auto w-full md:w-[96%] max-w-7xl px-4 md:px-6">
        <motion.div
          className="mb-8 md:mb-12 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-1 bg-emerald-500 rounded-full mb-4"></div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-lg">
              {subtitle}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-2xl mx-auto"
        >
           <Tabs defaultValue={qrisImageUrl ? "qris" : (bankAccounts.length > 0 ? "bank" : "ewallet")} className="w-full">
            <TabsList className="flex w-max mx-auto justify-center gap-2 mb-8 h-auto bg-gray-50/80 border border-gray-100 p-1.5 rounded-full overflow-hidden">
             {qrisImageUrl && (
                <TabsTrigger value="qris" className="rounded-full data-[state=active]:bg-emerald-500 text-gray-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 text-sm font-semibold transition-all duration-300">QRIS</TabsTrigger>
             )}
             {bankAccounts.length > 0 && (
                <TabsTrigger value="bank" className="rounded-full data-[state=active]:bg-emerald-500 text-gray-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 text-sm font-semibold transition-all duration-300">Transfer Bank</TabsTrigger>
             )}
             {ewallets.length > 0 && (
                <TabsTrigger value="ewallet" className="rounded-full data-[state=active]:bg-emerald-500 text-gray-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 text-sm font-semibold transition-all duration-300">E-Wallet</TabsTrigger>
             )}
            </TabsList>

            {/* QRIS Tab */}
            {qrisImageUrl && (
              <TabsContent value="qris" className="mt-0 outline-none">
                <div className="bg-transparent rounded-2xl border border-zinc-200 p-6 sm:p-8 flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex items-center justify-center">
                     <Image
                      src={qrisImageUrl}
                      alt="QRIS Masjid Nurul Jannah"
                      width={250}
                      height={350}
                      className="w-[180px] sm:w-[220px] aspect-[5/7] object-contain mix-blend-multiply"
                    />
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-1.5">Scan QRIS</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm max-w-[260px] mb-4">
                    Buka aplikasi Mobile Banking atau E-Wallet pilihan Anda, lalu scan QRIS di atas.
                  </p>
                  <a
                    href={qrisImageUrl}
                    download="QRIS-Masjid-Nurul-Jannah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Simpan QRIS
                  </a>
                </div>
              </TabsContent>
            )}

            {/* Bank Accounts Tab */}
            {bankAccounts.length > 0 && (
              <TabsContent value="bank" className="mt-0 outline-none">
                <div className="space-y-3">
                  {bankAccounts.map((bank) => (
                    <BankCard
                      key={bank.accountNumber}
                      bank={bank.bankName}
                      accountNumber={bank.accountNumber}
                      accountName={bank.accountName}
                      imageUrl={bank.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
            )}

            {/* E-Wallets Tab */}
            {ewallets.length > 0 && (
              <TabsContent value="ewallet" className="mt-0 outline-none">
                <div className="space-y-3">
                  {ewallets.map((wallet) => (
                    <EWalletCard key={wallet.name} {...wallet} />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

function BankCard({
  bank,
  accountNumber,
  accountName,
  imageUrl,
}: {
  bank: string;
  accountNumber: string;
  accountName: string;
  imageUrl?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-transparent border border-zinc-200 hover:border-emerald-200 transition-colors rounded-xl p-3 flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-zinc-100 flex items-center justify-center p-1.5 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={bank} className="w-full h-full object-contain rounded-sm" />
        ) : (
          <Building2 className="w-5 h-5 text-zinc-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
          <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded truncate">
            {bank}
          </span>
          <span className="text-[10px] sm:text-xs text-zinc-400 truncate">
            a.n. {accountName}
          </span>
        </div>
        <p className="text-sm sm:text-base font-bold text-zinc-800 tabular-nums tracking-wide truncate">
          {accountNumber}
        </p>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 flex-shrink-0 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
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

function EWalletCard({
  name,
  number,
  logo,
  imageUrl,
}: {
  name: string;
  number: string;
  logo?: string;
  imageUrl?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(number.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-transparent border border-zinc-200 hover:border-emerald-200 transition-colors rounded-xl p-3 flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-zinc-100 flex items-center justify-center p-1.5 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-contain rounded-sm" />
        ) : (
          <span className="text-xl sm:text-2xl">{logo || "📱"}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
          <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded truncate">
            {name}
          </span>
        </div>
        <p className="text-sm sm:text-base font-bold text-zinc-800 tabular-nums tracking-wide truncate">
          {number}
        </p>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 flex-shrink-0 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
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
