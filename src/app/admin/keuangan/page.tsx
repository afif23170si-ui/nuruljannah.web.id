// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getFinanceSummary, getFinanceList } from "@/actions/finance";
import { CATEGORY_LABELS } from "@/lib/finance-constants";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveDataList } from "@/components/admin/shared/ResponsiveDataList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Kelola Keuangan - Admin Panel",
  description: "Manajemen laporan keuangan dan transparansi infaq",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default async function FinanceAdminPage() {
  const now = new Date();
  const summary = await getFinanceSummary(now.getMonth() + 1, now.getFullYear());
  const recentTransactions = await getFinanceList({ limit: 10 });

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Keuangan Masjid" 
        description={`Laporan keuangan periode ${MONTH_NAMES[summary.period.month - 1]} ${summary.period.year}`}
        action={
          <div className="flex gap-2">
             <Link href="/admin/keuangan/laporan">
               <Button variant="outline" className="gap-2 bg-white border-gray-200 hover:bg-gray-50 hover:text-blue-600">
                 <FileText className="h-4 w-4" />
                 Laporan
               </Button>
             </Link>
             <Link href="/admin/keuangan/new">
               <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                 <Plus className="h-4 w-4" />
                 Transaksi Baru
               </Button>
             </Link>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="metron-card p-6 border-l-4 border-l-green-500 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pemasukan Bulan Ini</span>
             <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
             {formatCurrency(summary.monthly.income)}
          </div>
          <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded w-fit">
             {summary.monthly.incomeCount} transaksi
          </p>
        </div>

        <div className="metron-card p-6 border-l-4 border-l-red-500 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pengeluaran Bulan Ini</span>
             <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
             {formatCurrency(summary.monthly.expense)}
          </div>
          <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded w-fit">
             {summary.monthly.expenseCount} transaksi
          </p>
        </div>

        <div className="metron-card p-6 border-l-4 border-l-blue-500 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Saldo Bulan Ini</span>
             <Wallet className="h-4 w-4 text-blue-500" />
          </div>
          <div className={`text-2xl font-bold mb-1 ${summary.monthly.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
             {formatCurrency(summary.monthly.balance)}
          </div>
          <p className="text-xs text-gray-500 font-medium">
             {summary.monthly.balance >= 0 ? "Surplus" : "Defisit"}
          </p>
        </div>

        <div className="metron-card p-6 border-l-4 border-l-indigo-600 hover:shadow-sm transition-shadow bg-gray-900 text-white border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet className="h-24 w-24 -mr-8 -mt-8" />
          </div>
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Total Saldo Kas</span>
             </div>
             <div className="text-2xl font-bold text-white mb-1">
                {formatCurrency(summary.allTime.balance)}
             </div>
             <p className="text-xs text-gray-400 font-medium">
                Seluruh periode
             </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {summary.categories.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <AdminCard title="Pemasukan per Kategori">
              <div className="space-y-4">
                {summary.categories
                  .filter((c) => c.type === "INCOME")
                  .sort((a, b) => b.amount - a.amount)
                  .map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded bg-green-50 text-green-600 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4" />
                         </div>
                         <span className="text-sm font-semibold text-gray-700">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                  ))}
                {summary.categories.filter((c) => c.type === "INCOME").length ===
                  0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Belum ada pemasukan bulan ini
                  </p>
                )}
              </div>
          </AdminCard>

          <AdminCard title="Pengeluaran per Kategori">
              <div className="space-y-4">
                {summary.categories
                  .filter((c) => c.type === "EXPENSE")
                  .sort((a, b) => b.amount - a.amount)
                  .map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded bg-red-50 text-red-600 flex items-center justify-center">
                            <TrendingDown className="h-4 w-4" />
                         </div>
                         <span className="text-sm font-semibold text-gray-700">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                      </div>
                      <span className="font-bold text-red-600">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                  ))}
                {summary.categories.filter((c) => c.type === "EXPENSE")
                  .length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Belum ada pengeluaran bulan ini
                  </p>
                )}
              </div>
          </AdminCard>
        </div>
      )}

      {/* Recent Transactions */}
      <AdminCard title="Transaksi Terbaru">
          <ResponsiveDataList 
            data={recentTransactions}
            keyExtractor={(tx) => tx.id}
            columns={[
              {
                header: "Tanggal",
                cell: (tx) => <span className="text-sm text-gray-500">{format(new Date(tx.date), "d MMM yyyy", { locale: id })}</span>
              },
              {
                header: "Deskripsi",
                cell: (tx) => <span className="font-medium text-gray-900 line-clamp-1">{tx.description}</span>
              },
              {
                header: "Kategori",
                cell: (tx) => <Badge variant="outline" className="font-semibold text-gray-600 border-gray-200">{CATEGORY_LABELS[tx.category] || tx.category}</Badge>
              },
              {
                header: "Jumlah",
                cell: (tx) => (
                  <span className={`font-bold ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(Number(tx.amount)).replace("Rp", "")}
                  </span>
                ),
                className: "text-right"
              },
              {
                header: "",
                cell: (tx) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-blue-500" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
                className: "text-right"
              }
            ]}
            renderMobileItem={(tx) => (
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs text-gray-500">{format(new Date(tx.date), "d MMM yyyy", { locale: id })}</span>
                       <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{tx.description}</h4>
                    </div>
                    <Badge variant="outline" className="font-semibold text-gray-600 border-gray-200 text-[10px] h-6">
                        {CATEGORY_LABELS[tx.category] || tx.category}
                    </Badge>
                 </div>
                 
                 <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                     <span className={`font-bold ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(Number(tx.amount)).replace("Rp", "")}
                     </span>
                     
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-blue-500" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                 </div>
              </div>
            )}
            emptyMessage={
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                   <Wallet className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-6">Belum ada transaksi tercatat.</p>
                <Link href="/admin/keuangan/new">
                  <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                    Tambah Transaksi Pertama
                  </Button>
                </Link>
              </div>
            }
          />
      </AdminCard>
    </div>
  );
}
