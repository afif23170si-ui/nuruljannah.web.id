"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return value.toString();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface MonthData {
  month: number;
  income: number;
  expense: number;
}

interface FinanceChartProps {
  data: MonthData[];
  currentMonth: number;
  year: number;
}

export function FinanceChart({ data, currentMonth, year }: FinanceChartProps) {
  const chartData = data.map((d) => ({
    name: MONTH_SHORT[d.month - 1],
    Pemasukan: d.income,
    Pengeluaran: d.expense,
    Saldo: d.income - d.expense,
    isCurrent: d.month === currentMonth,
  }));

  // Calculate yearly totals
  const totalIncome = data.reduce((s, d) => s + d.income, 0);
  const totalExpense = data.reduce((s, d) => s + d.expense, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Arus Kas {year}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Pemasukan vs Pengeluaran per bulan</p>
        </div>
        <div className="flex gap-4 text-[10px] md:text-xs text-gray-500">
          <div className="text-right">
            <span className="block text-emerald-600 font-bold">{formatCompact(totalIncome)}</span>
            <span>Total Masuk</span>
          </div>
          <div className="text-right">
            <span className="block text-red-500 font-bold">{formatCompact(totalExpense)}</span>
            <span>Total Keluar</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[220px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompact}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "12px",
                padding: "10px 14px",
              }}
              formatter={((value: any, name: any) => [formatCurrency(Number(value)), name]) as any}
              labelStyle={{ fontWeight: 700, color: "#1e293b", marginBottom: 4 }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            <Bar
              dataKey="Pemasukan"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="Pengeluaran"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
