"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// Get Finance List
export async function getFinanceList(options?: {
  type?: "INCOME" | "EXPENSE";
  startDate?: Date;
  endDate?: Date;
  category?: string;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};

  if (options?.type) where.type = options.type;
  if (options?.category) where.category = options.category;
  if (options?.startDate || options?.endDate) {
    where.date = {};
    if (options?.startDate) (where.date as Record<string, Date>).gte = options.startDate;
    if (options?.endDate) (where.date as Record<string, Date>).lte = options.endDate;
  }

  return prisma.finance.findMany({
    where,
    orderBy: { date: "desc" },
    take: options?.limit,
    include: {
      creator: { select: { name: true } },
    },
  });
}

// Get Finance By ID
export async function getFinanceById(id: string) {
  return prisma.finance.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true } },
    },
  });
}

// Get Finance Summary
export async function getFinanceSummary(month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const startDate = new Date(targetYear, targetMonth - 1, 1);
  const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const [monthlyData, allTimeData, categoryData, siteSettings] = await Promise.all([
    // Monthly totals
    prisma.finance.groupBy({
      by: ["type"],
      where: {
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      _count: true,
    }),
    // All-time totals
    prisma.finance.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
    // Category breakdown for current month
    prisma.finance.groupBy({
      by: ["category", "type"],
      where: {
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),
    // Opening balance from settings
    prisma.siteSettings.findFirst({
      select: { openingBalance: true },
    }),
  ]);

  const openingBalance = Number(siteSettings?.openingBalance || 0);

  const monthlyIncome = Number(
    monthlyData.find((d) => d.type === "INCOME")?._sum.amount || 0
  );
  const monthlyExpense = Number(
    monthlyData.find((d) => d.type === "EXPENSE")?._sum.amount || 0
  );
  const allTimeIncome = Number(
    allTimeData.find((d) => d.type === "INCOME")?._sum.amount || 0
  );
  const allTimeExpense = Number(
    allTimeData.find((d) => d.type === "EXPENSE")?._sum.amount || 0
  );

  return {
    monthly: {
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense,
      incomeCount: monthlyData.find((d) => d.type === "INCOME")?._count || 0,
      expenseCount: monthlyData.find((d) => d.type === "EXPENSE")?._count || 0,
    },
    allTime: {
      income: allTimeIncome,
      expense: allTimeExpense,
      balance: openingBalance + allTimeIncome - allTimeExpense,
    },
    openingBalance,
    categories: categoryData.map((c) => ({
      category: c.category,
      type: c.type,
      amount: Number(c._sum.amount || 0),
    })),
    period: { month: targetMonth, year: targetYear },
  };
}

// Create Finance Transaction
export async function createFinance(data: {
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  category: "KOTAK_AMAL" | "TRANSFER" | "DONASI" | "INFAQ" | "ZAKAT" | "ZAKAT_FITRAH" | "ZAKAT_MAAL" | "SEDEKAH" | "WAKAF" | "FIDYAH" | "OPERASIONAL" | "SOSIAL" | "RENOVASI" | "PENDIDIKAN" | "LAINNYA";
  date: Date;
  createdBy: string;
  donorName?: string;
  paymentMethod?: string;
  isAnonymous?: boolean;
}) {
  const result = await prisma.finance.create({
    data: {
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      date: data.date,
      createdBy: data.createdBy,
      donorName: data.donorName,
      paymentMethod: data.paymentMethod,
      isAnonymous: data.isAnonymous ?? false,
    },
  });

  revalidateTag("finance", "max");
  return result;
}

// Update Finance Transaction
export async function updateFinance(
  id: string,
  data: Partial<{
    amount: number;
    description: string;
    category: "KOTAK_AMAL" | "TRANSFER" | "DONASI" | "INFAQ" | "ZAKAT" | "ZAKAT_FITRAH" | "ZAKAT_MAAL" | "SEDEKAH" | "WAKAF" | "FIDYAH" | "OPERASIONAL" | "SOSIAL" | "RENOVASI" | "PENDIDIKAN" | "LAINNYA";
    date: Date;
    donorName: string | null;
    paymentMethod: string | null;
    isAnonymous: boolean;
  }>
) {
  const result = await prisma.finance.update({
    where: { id },
    data,
  });

  revalidateTag("finance", "max");
  return result;
}

// Delete Finance Transaction
export async function deleteFinance(id: string) {
  await prisma.finance.delete({ where: { id } });
  revalidateTag("finance", "max");
}

// Get Monthly Report
export async function getMonthlyReport(year: number) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const report = await Promise.all(
    months.map(async (month) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const data = await prisma.finance.groupBy({
        by: ["type"],
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      });

      return {
        month,
        income: Number(data.find((d) => d.type === "INCOME")?._sum.amount || 0),
        expense: Number(data.find((d) => d.type === "EXPENSE")?._sum.amount || 0),
      };
    })
  );

  return report;
}

// Get Recent Donations (for public Infaq page)
export async function getRecentDonations(limit: number = 10, month?: number, year?: number) {
  const where: Record<string, unknown> = { type: "INCOME" };

  if (month && year) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    where.date = { gte: startOfMonth, lte: endOfMonth };
  }

  const donations = await prisma.finance.findMany({
    where,
    orderBy: { date: "desc" },
    take: limit,
  });

  return donations.map((d) => ({
    id: d.id,
    amount: Number(d.amount),
    description: d.description,
    category: d.category,
    date: d.date,
    donorName: d.donorName ?? null,
    paymentMethod: d.paymentMethod ?? null,
    isAnonymous: d.isAnonymous ?? false,
    displayName: d.isAnonymous || !d.donorName ? "Hamba Allah" : d.donorName,
  }));
}

// Get Infaq Stats (for public Infaq page)
export async function getInfaqStats(month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const [monthlyTotal, allTransactions] = await Promise.all([
    prisma.finance.aggregate({
      where: {
        type: "INCOME",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.finance.findMany({
      where: {
        type: "INCOME",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { donorName: true },
      distinct: ["donorName"],
    }),
  ]);

  const uniqueDonors = allTransactions.filter((t) => t.donorName).length;

  return {
    totalBulanIni: Number(monthlyTotal._sum?.amount || 0),
    jumlahDonatur: uniqueDonors,
  };
}

