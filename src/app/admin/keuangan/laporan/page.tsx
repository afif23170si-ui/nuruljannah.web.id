import { Metadata } from "next";
import { getFinanceSummary, getMonthlyReport } from "@/actions/finance";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

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
      <AdminPageHeader 
        title="Laporan Keuangan" 
        description={`Laporan keuangan bulanan masjid Tahun ${year}`}
        breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Keuangan", href: "/admin/keuangan" },
            { label: "Laporan" }
        ]}
      />

      {/* Yearly Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="metron-card bg-white p-6 border-l-4 border-l-green-500 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Pemasukan {year}
            </h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(yearlyIncome)}
            </div>
          </div>
        </div>

        <div className="metron-card bg-white p-6 border-l-4 border-l-red-500 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran {year}
            </h3>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(yearlyExpense)}
            </div>
          </div>
        </div>

        <div className="metron-card bg-white p-6 border-l-4 border-l-primary shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Saldo Tahun {year}
            </h3>
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${yearlyBalance >= 0 ? "text-primary" : "text-red-600"}`}>
              {formatCurrency(yearlyBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <AdminCard title="Rekap Bulanan">
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
      </AdminCard>
    </div>
  );
}
