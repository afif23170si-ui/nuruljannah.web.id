import { Metadata } from "next";
import { getFinanceSummary, getMonthlyReport, getFinanceList } from "@/actions/finance";
import { CATEGORY_LABELS } from "@/lib/finance-constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Wallet, BarChart3, Shield, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transparansi Keuangan",
  description: "Laporan keuangan masjid yang transparan untuk jamaah",
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

export default async function TransparansiPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const summary = await getFinanceSummary(currentMonth, currentYear);
  const monthlyReport = await getMonthlyReport(currentYear);
  const recentTransactions = await getFinanceList({ limit: 20 });

  // Calculate totals
  const yearlyIncome = monthlyReport.reduce((sum, m) => sum + m.income, 0);
  const yearlyExpense = monthlyReport.reduce((sum, m) => sum + m.expense, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Shield className="h-3 w-3 mr-1" />
            Transparansi
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparansi Keuangan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Laporan keuangan masjid yang akuntabel dan transparan untuk seluruh jamaah
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Current Month Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pemasukan
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.monthly.income)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pengeluaran
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.monthly.expense)}
                </div>
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
                <div className={`text-2xl font-bold ${summary.monthly.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatCurrency(summary.monthly.balance)}
                </div>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Breakdown */}
        {summary.categories.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Sumber Pemasukan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.categories
                    .filter((c) => c.type === "INCOME")
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between py-1">
                        <span className="text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    ))}
                  {summary.categories.filter((c) => c.type === "INCOME").length === 0 && (
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
                  Penggunaan Dana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.categories
                    .filter((c) => c.type === "EXPENSE")
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between py-1">
                        <span className="text-sm">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    ))}
                  {summary.categories.filter((c) => c.type === "EXPENSE").length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Belum ada pengeluaran bulan ini
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Yearly Report */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rekap Tahun {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bulan</TableHead>
                    <TableHead className="text-right">Pemasukan</TableHead>
                    <TableHead className="text-right">Pengeluaran</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReport.slice(0, currentMonth).map((month) => {
                    const balance = month.income - month.expense;
                    return (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">
                          {MONTH_NAMES[month.month - 1]}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {month.income > 0 ? formatCurrency(month.income) : "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {month.expense > 0 ? formatCurrency(month.expense) : "-"}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${balance >= 0 ? "text-primary" : "text-red-600"}`}>
                          {month.income > 0 || month.expense > 0 ? formatCurrency(balance) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(yearlyIncome)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(yearlyExpense)}
                    </TableCell>
                    <TableCell className={`text-right ${yearlyIncome - yearlyExpense >= 0 ? "text-primary" : "text-red-600"}`}>
                      {formatCurrency(yearlyIncome - yearlyExpense)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Transaksi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.slice(0, 15).map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {format(new Date(tx.date), "d MMM yyyy", { locale: id })}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {tx.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[tx.category] || tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold whitespace-nowrap ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(Number(tx.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Note */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Laporan keuangan ini diperbarui secara berkala oleh pengurus masjid.
            Untuk pertanyaan lebih lanjut, silakan hubungi bendahara masjid.
          </p>
        </div>
      </div>
    </div>
  );
}
