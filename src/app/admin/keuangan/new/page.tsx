// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { FinanceForm } from "@/components/admin/FinanceForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export const metadata: Metadata = {
  title: "Tambah Transaksi",
  description: "Tambah pemasukan atau pengeluaran baru",
};

export default function NewFinancePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
          title="Tambah Transaksi" 
          description="Catat pemasukan atau pengeluaran rutin masjid"
          breadcrumbs={[
              { label: "Dashboard", href: "/admin" },
              { label: "Keuangan", href: "/admin/keuangan" },
              { label: "Buat Baru" }
          ]}
        />

      {/* Form */}
      <FinanceForm />
    </div>
  );
}
