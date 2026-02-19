// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFinanceById } from "@/actions/finance";
import { FinanceForm } from "@/components/admin/FinanceForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export const metadata: Metadata = {
  title: "Edit Transaksi",
  description: "Edit data transaksi keuangan",
};

export default async function EditFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getFinanceById(id);

  if (!transaction) {
    notFound();
  }

  const initialData = {
    id: transaction.id,
    type: transaction.type as "INCOME" | "EXPENSE",
    amount: Number(transaction.amount),
    description: transaction.description,
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split("T")[0],
    donorName: transaction.donorName,
    paymentMethod: transaction.paymentMethod,
    isAnonymous: transaction.isAnonymous,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Edit Transaksi" 
        description={`Mengubah data: ${transaction.description}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Keuangan", href: "/admin/keuangan" },
          { label: "Edit Transaksi" }
        ]}
      />

      <FinanceForm initialData={initialData} />
    </div>
  );
}
