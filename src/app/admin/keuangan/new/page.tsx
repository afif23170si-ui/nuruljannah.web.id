import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FinanceForm } from "@/components/admin/FinanceForm";

export const metadata: Metadata = {
  title: "Tambah Transaksi",
  description: "Tambah pemasukan atau pengeluaran baru",
};

export default function NewFinancePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/keuangan">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Tambah Transaksi</h1>
          <p className="text-muted-foreground">
            Catat pemasukan atau pengeluaran baru
          </p>
        </div>
      </div>

      {/* Form */}
      <FinanceForm />
    </div>
  );
}
