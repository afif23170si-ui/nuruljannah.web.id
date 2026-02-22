// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { FinanceForm } from "@/components/admin/FinanceForm";
import { getFunds } from "@/actions/ziswaf/funds";

export const metadata: Metadata = {
  title: "Catat Keuangan Baru - Admin Panel",
  description: "Buat pencatatan transaksi keuangan masjid baru",
};

export default async function NewFinancePage() {
  const funds = await getFunds({ isActive: true });

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-6">
        <Link
          href="/admin/keuangan"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>
            Kembali ke tabel keuangan
          </span>
        </Link>
      </div>

      <AdminPageHeader
        title="Transaksi Baru"
        description="Catat pemasukan atau pengeluaran kas berdasarkan Kantong Dana"
      />

      <div className="mt-8 max-w-3xl">
        <FinanceForm funds={funds} />
      </div>
    </div>
  );
}
