// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getFinanceSummary, getFinanceList } from "@/actions/finance";
import { CATEGORY_LABELS } from "@/lib/finance-constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  title: "Kelola Keuangan",
  description: "Kelola pemasukan dan pengeluaran masjid",
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Keuangan Masjid</h1>
          <p className="text-muted-foreground">
            {MONTH_NAMES[summary.period.month - 1]} {summary.period.year}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/keuangan/laporan">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Laporan
            </Button>
          </Link>
          <Link href="/admin/keuangan/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Transaksi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pemasukan Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.monthly.income)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.monthly.incomeCount} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengeluaran Bulan Ini
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.monthly.expense)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.monthly.expenseCount} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Bulan Ini
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.monthly.balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(summary.monthly.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.monthly.balance >= 0 ? "Surplus" : "Defisit"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Saldo Kas
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary.allTime.balance)}
            </div>
            <p className="text-xs text-muted-foreground">Seluruh periode</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {summary.categories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Pemasukan per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.categories
                  .filter((c) => c.type === "INCOME")
                  .sort((a, b) => b.amount - a.amount)
                  .map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                  ))}
                {summary.categories.filter((c) => c.type === "INCOME").length ===
                  0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada pemasukan bulan ini
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Pengeluaran per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.categories
                  .filter((c) => c.type === "EXPENSE")
                  .sort((a, b) => b.amount - a.amount)
                  .map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                  ))}
                {summary.categories.filter((c) => c.type === "EXPENSE")
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada pengeluaran bulan ini
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada transaksi.</p>
              <Link href="/admin/keuangan/new" className="mt-4 inline-block">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Transaksi Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(tx.date), "d MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {tx.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{CATEGORY_LABELS[tx.category] || tx.category}</Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        tx.type === "INCOME" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(Number(tx.amount))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
