// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { FinanceForm } from "@/components/admin/FinanceForm";
import { getFinanceById } from "@/actions/finance";
import { getFunds } from "@/actions/ziswaf/funds";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Edit Keuangan - Admin Panel",
  description: "Ubah pencatatan transaksi keuangan masjid",
};

export default async function EditFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const data = await getFinanceById(resolvedParams.id);
  const funds = await getFunds({ isActive: true });

  if (!data) {
    notFound();
  }

  // Check if current fund is active, if not add it to the list for display purposes
  if (!funds.some((f: { id: string }) => f.id === data.fundId) && data.fund) {
    funds.push(data.fund as any);
  }

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
        title="Edit Transaksi"
        description="Ubah data pemasukan atau pengeluaran"
      />

      <div className="mt-8 max-w-3xl">
        <FinanceForm 
          funds={funds}
          initialData={{
            id: data.id,
            type: data.type,
            category: data.category,
            fundId: data.fundId,
            amount: Number(data.amount),
            description: data.description,
            date: format(data.date, "yyyy-MM-dd"),
            donorName: data.donorName,
            paymentMethod: data.paymentMethod,
            isAnonymous: data.isAnonymous,
          }}
        />
      </div>
    </div>
  );
}
