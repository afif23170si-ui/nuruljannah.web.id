"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { ResponsiveDataList } from "@/components/admin/shared/ResponsiveDataList";
import { TransactionActions } from "@/components/admin/TransactionActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, Filter, Tag } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CATEGORY_LABELS } from "@/lib/finance-constants";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface AdminTransactionListProps {
  transactions: any[];
  funds: Array<{ id: string; name: string }>;
  periodLabel: string;
}

export function AdminTransactionList({ transactions, funds, periodLabel }: AdminTransactionListProps) {
  const [fundFilter, setFundFilter] = useState<string>("ALL");

  const filtered = fundFilter === "ALL"
    ? transactions
    : transactions.filter((tx) => tx.fundId === fundFilter);

  const filterLabel = fundFilter !== "ALL" 
    ? funds.find(f => f.id === fundFilter)?.name 
    : null;

  return (
    <AdminCard 
      title={`Transaksi ${periodLabel}`}
      action={
        funds.length > 1 ? (
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <Select value={fundFilter} onValueChange={setFundFilter}>
              <SelectTrigger className="h-8 w-[180px] text-xs border-gray-200 bg-white font-normal">
                <SelectValue placeholder="Filter Dana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kantong Dana</SelectItem>
                {funds.map((fund) => (
                  <SelectItem key={fund.id} value={fund.id}>{fund.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : undefined
      }
    >
        <ResponsiveDataList 
          data={filtered}
          keyExtractor={(tx) => tx.id}
          columns={[
            {
              header: "Tanggal",
              cell: (tx) => <span className="text-sm text-gray-500">{format(new Date(tx.date), "d MMM yyyy", { locale: id })}</span>
            },
            {
              header: "Deskripsi",
              cell: (tx) => (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 line-clamp-1">{tx.description}</span>
                  {tx.category && (
                    <Badge className="bg-gray-100 text-gray-500 border-0 text-[9px] font-semibold shrink-0">
                      {CATEGORY_LABELS[tx.category] || tx.category}
                    </Badge>
                  )}
                </div>
              )
            },
            {
              header: "Kantong Dana",
              cell: (tx: any) => (
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="font-semibold text-gray-600 border-gray-200">{tx.fund?.name || "Tanpa Dana"}</Badge>
                  {tx.fund?.type !== "OPERASIONAL" && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold">{tx.fund?.type}</Badge>
                  )}
                </div>
              )
            },
            {
              header: "Masuk",
              cell: (tx) => (
                <span className="font-bold text-green-600">
                  {tx.type === "INCOME" ? formatCurrency(Number(tx.amount)).replace("Rp", "") : "—"}
                </span>
              ),
              className: "text-right"
            },
            {
              header: "Keluar",
              cell: (tx) => (
                <span className="font-bold text-red-600">
                  {tx.type === "EXPENSE" ? formatCurrency(Number(tx.amount)).replace("Rp", "") : "—"}
                </span>
              ),
              className: "text-right"
            },
            {
              header: "",
              cell: (tx) => (
                <TransactionActions transactionId={tx.id} description={tx.description} />
              ),
              className: "text-right"
            }
          ]}
          renderMobileItem={(tx: any) => (
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                     <span className="text-xs text-gray-500">{format(new Date(tx.date), "d MMM yyyy", { locale: id })}</span>
                     <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{tx.description}</h4>
                     {tx.category && (
                       <Badge className="bg-gray-100 text-gray-500 border-0 text-[9px] font-semibold w-fit">
                         {CATEGORY_LABELS[tx.category] || tx.category}
                       </Badge>
                     )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="font-semibold text-gray-600 border-gray-200 text-[10px] h-6">
                        {tx.fund?.name || "Tanpa Dana"}
                    </Badge>
                    {tx.fund?.type !== "OPERASIONAL" && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] h-6 font-bold">{tx.fund?.type}</Badge>
                    )}
                  </div>
               </div>
               
               <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                   <div className="flex items-center gap-4">
                     {tx.type === "INCOME" ? (
                       <div className="flex items-center gap-1.5">
                         <span className="text-[10px] font-semibold text-green-600 uppercase">Masuk</span>
                         <span className="font-bold text-green-600">{formatCurrency(Number(tx.amount)).replace("Rp", "")}</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5">
                         <span className="text-[10px] font-semibold text-red-600 uppercase">Keluar</span>
                         <span className="font-bold text-red-600">{formatCurrency(Number(tx.amount)).replace("Rp", "")}</span>
                       </div>
                     )}
                   </div>
                   
                   <TransactionActions transactionId={tx.id} description={tx.description} />
               </div>
            </div>
          )}
          emptyMessage={
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                 <Wallet className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-6">
                {filterLabel ? `Belum ada transaksi ${filterLabel} di ${periodLabel}.` : `Belum ada transaksi di ${periodLabel}.`}
              </p>
              <Link href="/admin/keuangan/new">
                <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  Tambah Transaksi Pertama
                </Button>
              </Link>
            </div>
          }
        />
    </AdminCard>
  );
}
