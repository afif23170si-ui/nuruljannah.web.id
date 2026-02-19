"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ArrowDownLeft, ArrowUpRight, LayoutList } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/finance-constants";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  category: string;
  type: string;
  amount: number | { toNumber?: () => number };
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const FILTERS = [
  { key: "ALL", label: "Semua", icon: LayoutList },
  { key: "INCOME", label: "Pemasukan", icon: ArrowDownLeft },
  { key: "EXPENSE", label: "Pengeluaran", icon: ArrowUpRight },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const filtered = filter === "ALL"
    ? transactions
    : transactions.filter((tx) => tx.type === filter);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-12">
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Transaksi Terbaru</h3>
            <p className="text-sm text-gray-500">
              {filter === "ALL"
                ? `${filtered.length} transaksi terakhir`
                : filter === "INCOME"
                ? `${filtered.length} pemasukan`
                : `${filtered.length} pengeluaran`}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-gray-100/80 rounded-xl p-1 gap-0.5">
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[180px] pl-6 md:pl-8">Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right pr-6 md:pr-8">Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50 cursor-default">
                  <TableCell className="pl-6 md:pl-8 font-medium text-gray-600 text-sm">
                    {format(new Date(tx.date), "d MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="max-w-[200px] md:max-w-md truncate font-medium text-gray-900 text-sm">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-200">
                      {CATEGORY_LABELS[tx.category] || tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right pr-6 md:pr-8 font-bold whitespace-nowrap text-sm ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(Number(tx.amount))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  {filter === "ALL"
                    ? "Belum ada data transaksi"
                    : filter === "INCOME"
                    ? "Belum ada pemasukan bulan ini"
                    : "Belum ada pengeluaran bulan ini"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
