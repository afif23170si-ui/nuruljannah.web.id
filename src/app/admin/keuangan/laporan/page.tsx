import { Metadata } from "next";
import { getFinanceSummary, getMonthlyReport } from "@/actions/finance";
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
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Laporan Keuangan",
  description: "Laporan keuangan bulanan masjid",
};

// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

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

export default async function FinanceReportPage() {
  const now = new Date();
  const year = now.getFullYear();
  const monthlyReport = await getMonthlyReport(year);
  const currentSummary = await getFinanceSummary();

  // Calculate totals
  const yearlyIncome = monthlyReport.reduce((sum, m) => sum + m.income, 0);
  const yearlyExpense = monthlyReport.reduce((sum, m) => sum + m.expense, 0);
  const yearlyBalance = yearlyIncome - yearlyExpense;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-muted-foreground">Tahun {year}</p>
      </div>

      {/* Yearly Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pemasukan {year}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(yearlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran {year}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(yearlyExpense)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Tahun {year}
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${yearlyBalance >= 0 ? "text-primary" : "text-red-600"}`}>
              {formatCurrency(yearlyBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rekap Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {monthlyReport.map((month) => {
                const balance = month.income - month.expense;
                const isCurrentMonth = month.month === now.getMonth() + 1;

                return (
                  <TableRow key={month.month} className={isCurrentMonth ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">
                      {MONTH_NAMES[month.month - 1]}
                      {isCurrentMonth && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Saat ini
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {month.income > 0 ? formatCurrency(month.income) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {month.expense > 0 ? formatCurrency(month.expense) : "-"}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${balance >= 0 ? "text-primary" : "text-red-600"}`}>
                      {month.income > 0 || month.expense > 0
                        ? formatCurrency(balance)
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Total Row */}
              <TableRow className="border-t-2 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(yearlyIncome)}
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {formatCurrency(yearlyExpense)}
                </TableCell>
                <TableCell className={`text-right ${yearlyBalance >= 0 ? "text-primary" : "text-red-600"}`}>
                  {formatCurrency(yearlyBalance)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
