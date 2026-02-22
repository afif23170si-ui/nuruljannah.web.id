import { Metadata } from "next";
import { getFinanceList, getInfaqStats } from "@/actions/finance";
import { DonasiClient } from "./DonasiClient";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donasi Masuk - Admin",
  description: "Monitoring donasi dan infaq yang masuk.",
};

export default async function DonasiPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; fundId?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year) : now.getFullYear();

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const [donations, stats, funds, totalAllTime] = await Promise.all([
    getFinanceList({
      type: "INCOME",
      startDate: startOfMonth,
      endDate: endOfMonth,
      fundId: params.fundId || undefined,
    }),
    getInfaqStats(month, year),
    prisma.fund.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.finance.aggregate({
      where: { type: "INCOME" },
      _sum: { amount: true },
    }),
  ]);

  // Calculate average per donatur
  const avgDonation = stats.jumlahDonatur > 0
    ? stats.totalBulanIni / stats.jumlahDonatur
    : 0;

  // Find top fund this month
  const fundTotals: Record<string, { name: string; total: number }> = {};
  donations.forEach((d) => {
    const fname = d.fund?.name || "Lainnya";
    if (!fundTotals[fname]) fundTotals[fname] = { name: fname, total: 0 };
    fundTotals[fname].total += Number(d.amount);
  });
  const topFund = Object.values(fundTotals).sort((a, b) => b.total - a.total)[0] || null;

  return (
    <DonasiClient
      donations={donations.map((d) => ({
        id: d.id,
        amount: Number(d.amount),
        description: d.description,
        date: d.date,
        donorName: d.donorName,
        paymentMethod: d.paymentMethod,
        isAnonymous: d.isAnonymous,
        fundName: d.fund?.name || "Operasional",
        fundId: d.fundId,
        creatorName: d.creator?.name || "-",
      }))}
      stats={{
        totalBulanIni: stats.totalBulanIni,
        jumlahDonatur: stats.jumlahDonatur,
        avgDonation,
        topFundName: topFund?.name || "-",
        topFundAmount: topFund?.total || 0,
        totalAllTime: Number(totalAllTime._sum?.amount || 0),
      }}
      funds={funds}
      month={month}
      year={year}
      selectedFundId={params.fundId || ""}
    />
  );
}
