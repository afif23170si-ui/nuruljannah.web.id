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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownLeft, ArrowUpRight, LayoutList, Filter } from "lucide-react";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  type: string;
  fundId?: string;
  fundName?: string;
  fundType?: string;
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

const TYPE_FILTERS = [
  { key: "ALL", label: "Semua", icon: LayoutList },
  { key: "INCOME", label: "Pemasukan", icon: ArrowDownLeft },
  { key: "EXPENSE", label: "Pengeluaran", icon: ArrowUpRight },
] as const;

type TypeFilterKey = (typeof TYPE_FILTERS)[number]["key"];

type SummaryData = {
  income: number;
  expense: number;
  balance: number;
};

export function RecentTransactions({ 
  transactions, 
  summary,
  allFunds,
}: { 
  transactions: Transaction[], 
  summary?: SummaryData,
  allFunds?: Array<{ id: string; name: string }>,
}) {
  const [typeFilter, setTypeFilter] = useState<TypeFilterKey>("ALL");
  const [fundFilter, setFundFilter] = useState<string>("ALL");

  // Use allFunds prop if available, otherwise derive from transactions
  const fundOptions = allFunds || Array.from(
    new Map(
      transactions
        .filter((tx) => tx.fundName)
        .map((tx) => [tx.fundId, tx.fundName])
    ).entries()
  ).map(([id, name]) => ({ id: id!, name: name! }));

  const filtered = transactions
    .filter((tx) => typeFilter === "ALL" || tx.type === typeFilter)
    .filter((tx) => fundFilter === "ALL" || tx.fundId === fundFilter);

  return (
    <div className="mb-12 bg-white border border-gray-100 rounded-2xl p-4 md:p-6">
      <div className="pb-6 mb-2 border-b-2 border-gray-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Rincian Transaksi</h3>
            <p className="text-sm text-gray-500">
              {filtered.length} transaksi
              {typeFilter !== "ALL" && (typeFilter === "INCOME" ? " pemasukan" : " pengeluaran")}
              {fundFilter !== "ALL" && ` · ${fundOptions.find(f => f.id === fundFilter)?.name}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Fund Filter Dropdown */}
            {fundOptions.length > 1 && (
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                <Select value={fundFilter} onValueChange={setFundFilter}>
                  <SelectTrigger className="h-8 w-[160px] text-xs border-gray-200 bg-white">
                    <SelectValue placeholder="Kantong Dana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Dana</SelectItem>
                    {fundOptions.map((fund) => (
                      <SelectItem key={fund.id} value={fund.id}>{fund.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Type Filter Tabs */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-0.5">
              {TYPE_FILTERS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === key
                      ? "bg-white text-emerald-700 shadow-sm border border-gray-100"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <Table>
          <TableHeader className="bg-transparent border-b border-gray-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px] pl-2 md:pl-4">Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Kantong Dana</TableHead>
              <TableHead className="text-right">Masuk</TableHead>
              <TableHead className="text-right pr-2 md:pr-4">Keluar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50/50 cursor-default border-gray-100/50">
                  <TableCell className="pl-2 md:pl-4 font-medium text-gray-500 text-sm whitespace-nowrap">
                    {format(new Date(tx.date), "d MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="max-w-[200px] md:max-w-md truncate font-medium text-gray-900 text-sm">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-200">
                      {tx.fundName || "Tanpa Dana"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold whitespace-nowrap text-sm text-emerald-600">
                    {tx.type === "INCOME" ? formatCurrency(Number(tx.amount)) : "—"}
                  </TableCell>
                  <TableCell className="text-right pr-2 md:pr-4 font-bold whitespace-nowrap text-sm text-red-600">
                    {tx.type === "EXPENSE" ? formatCurrency(Number(tx.amount)) : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {typeFilter === "ALL"
                    ? "Belum ada data transaksi"
                    : typeFilter === "INCOME"
                    ? "Belum ada pemasukan bulan ini"
                    : "Belum ada pengeluaran bulan ini"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          
          {/* Table Footer - Dynamically calculated from filtered transactions */}
          {filtered.length > 0 && (() => {
            const filteredIncome = filtered.filter(tx => tx.type === "INCOME").reduce((sum, tx) => sum + Number(tx.amount), 0);
            const filteredExpense = filtered.filter(tx => tx.type === "EXPENSE").reduce((sum, tx) => sum + Number(tx.amount), 0);
            const filteredBalance = filteredIncome - filteredExpense;
            const filterLabel = fundFilter !== "ALL" 
              ? fundOptions.find(f => f.id === fundFilter)?.name 
              : typeFilter !== "ALL" 
              ? (typeFilter === "INCOME" ? "Pemasukan" : "Pengeluaran")
              : null;

            return (
              <tfoot className="bg-transparent font-medium border-t-2 border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="pl-2 md:pl-4 text-right font-semibold text-gray-500">
                    Total{filterLabel ? ` · ${filterLabel}` : " Bulan Ini"}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    {formatCurrency(filteredIncome)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600 pr-2 md:pr-4">
                    {formatCurrency(filteredExpense)}
                  </TableCell>
                </TableRow>
                
                <TableRow className="hover:bg-transparent bg-gray-50/50">
                  <TableCell colSpan={3} className="pl-2 md:pl-4 text-right font-bold text-gray-900">
                    Saldo{filterLabel ? ` · ${filterLabel}` : " Bulan Ini"}
                  </TableCell>
                  <TableCell colSpan={2} className={`text-right pr-2 md:pr-4 font-bold text-base ${filteredBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                     {formatCurrency(filteredBalance)}
                  </TableCell>
                </TableRow>
              </tfoot>
            );
          })()}
        </Table>
      </div>
    </div>
  );
}
