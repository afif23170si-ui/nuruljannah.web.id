"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// Get Finance List
export async function getFinanceList(options?: {
  type?: "INCOME" | "EXPENSE";
  startDate?: Date;
  endDate?: Date;
  fundId?: string;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};

  if (options?.type) where.type = options.type;
  if (options?.fundId) where.fundId = options.fundId;
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
      fund: { select: { id: true, name: true, type: true } },
    },
  });
}

// Get Finance By ID
export async function getFinanceById(id: string) {
  return prisma.finance.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true } },
      fund: { select: { id: true, name: true, type: true } },
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

  const [
    monthlyData,
    allTimeData,
    siteSettings,
    allFunds,
    fundDataAllTime,
    fundDataMonthly,
  ] = await Promise.all([
    // Monthly totals
    prisma.finance.groupBy({
      by: ["type"],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
      _count: true,
    }),
    // All-time totals
    prisma.finance.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
    // Opening balance from settings
    prisma.siteSettings.findFirst({ select: { openingBalance: true } }),
    // Get all master funds for mapping
    prisma.fund.findMany(),
    // Fund breakdown (all-time)
    prisma.finance.groupBy({
      by: ["fundId", "type"],
      _sum: { amount: true },
    }),
    // Fund breakdown (monthly)
    prisma.finance.groupBy({
      by: ["fundId", "type"],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    }),
  ]);

  const openingBalance = Number(siteSettings?.openingBalance || 0);

  const monthlyIncome = Number(monthlyData.find(d => d.type === "INCOME")?._sum.amount || 0);
  const monthlyExpense = Number(monthlyData.find(d => d.type === "EXPENSE")?._sum.amount || 0);
  const allTimeIncome = Number(allTimeData.find(d => d.type === "INCOME")?._sum.amount || 0);
  const allTimeExpense = Number(allTimeData.find(d => d.type === "EXPENSE")?._sum.amount || 0);

  // Map fund balances
  // Get all OPERASIONAL fund IDs
  const operasionalFundIds = allFunds.filter(f => f.type === "OPERASIONAL").map(f => f.id);

  const fundBalancesAllTime = fundDataAllTime.reduce((acc, curr) => {
    if (!acc[curr.fundId]) acc[curr.fundId] = { income: 0, expense: 0, balance: 0 };
    const amount = Number(curr._sum.amount || 0);
    if (curr.type === "INCOME") acc[curr.fundId].income += amount;
    else acc[curr.fundId].expense += amount;
    
    // add opening balance to the first operational fund (for backward compat)
    let bal = acc[curr.fundId].income - acc[curr.fundId].expense;
    if (curr.fundId === operasionalFundIds[0]) bal += openingBalance;
    acc[curr.fundId].balance = bal;
    
    return acc;
  }, {} as Record<string, { income: number, expense: number, balance: number }>);

  const fundBalancesMonthly = fundDataMonthly.reduce((acc, curr) => {
    if (!acc[curr.fundId]) acc[curr.fundId] = { income: 0, expense: 0, balance: 0 };
    const amount = Number(curr._sum.amount || 0);
    if (curr.type === "INCOME") acc[curr.fundId].income += amount;
    else acc[curr.fundId].expense += amount;
    acc[curr.fundId].balance = acc[curr.fundId].income - acc[curr.fundId].expense;
    return acc;
  }, {} as Record<string, { income: number, expense: number, balance: number }>);

  // Aggregate all OPERASIONAL funds for backward compat
  const operasionalMonthly = operasionalFundIds.reduce((acc, id) => {
    const fund = fundBalancesMonthly[id] || { income: 0, expense: 0, balance: 0 };
    return {
      income: acc.income + fund.income,
      expense: acc.expense + fund.expense,
      balance: acc.balance + fund.balance,
    };
  }, { income: 0, expense: 0, balance: 0 });
  
  const operasionalAllTime = operasionalFundIds.reduce((acc, id, idx) => {
    const fund = fundBalancesAllTime[id] || { income: 0, expense: 0, balance: 0 };
    return {
      income: acc.income + fund.income,
      expense: acc.expense + fund.expense,
      balance: acc.balance + fund.balance,
    };
  }, { income: 0, expense: 0, balance: openingBalance });

  return {
    monthly: {
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense,
      incomeCount: monthlyData.find(d => d.type === "INCOME")?._count || 0,
      expenseCount: monthlyData.find(d => d.type === "EXPENSE")?._count || 0,
      
      // Backward compat mappings
      operasionalBalance: operasionalMonthly.balance,
      operasionalIncome: operasionalMonthly.income,
      operasionalExpense: operasionalMonthly.expense,
      titipanBalance: monthlyIncome - monthlyExpense - operasionalMonthly.balance, // Approximation if multiple funds
    },
    allTime: {
      income: allTimeIncome,
      expense: allTimeExpense,
      balance: openingBalance + allTimeIncome - allTimeExpense,
    },
    fundBalances: {
      operasional: operasionalAllTime.balance,
      titipan: (allTimeIncome - allTimeExpense) - (operasionalAllTime.balance - openingBalance), // Approx
    },
    fundsAllTime: Object.entries(fundBalancesAllTime).map(([id, data]) => ({
      fundId: id,
      fundName: allFunds.find(f => f.id === id)?.name || "Unknown",
      ...data
    })),
    fundsMonthly: Object.entries(fundBalancesMonthly).map(([id, data]) => ({
      fundId: id,
      fundName: allFunds.find(f => f.id === id)?.name || "Unknown",
      ...data
    })),
    openingBalance,
    period: { month: targetMonth, year: targetYear },
  };
}

// Create Finance Transaction
export async function createFinance(data: {
  type: "INCOME" | "EXPENSE";
  category?: string;
  amount: number;
  description: string;
  fundId: string;
  date: Date;
  createdBy: string;
  donorName?: string;
  paymentMethod?: string;
  isAnonymous?: boolean;
}) {
  const result = await prisma.finance.create({
    data: {
      type: data.type,
      category: data.category || null,
      fundId: data.fundId,
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
    category: string | null;
    fundId: string;
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
    include: { fund: true }
  });

  return donations.map((d) => ({
    id: d.id,
    amount: Number(d.amount),
    description: d.description,
    fundName: d.fund.name,
    date: d.date,
    donorName: d.donorName ?? null,
    paymentMethod: d.paymentMethod ?? null,
    isAnonymous: d.isAnonymous ?? false,
    displayName: d.isAnonymous || !d.donorName ? "Hamba Allah" : d.donorName,
    type: d.type,
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

  // Count unique donors (exclude null/empty donorName)
  const uniqueDonors = allTransactions.filter((t) => t.donorName).length;

  return {
    totalBulanIni: Number(monthlyTotal._sum?.amount || 0),
    jumlahDonatur: uniqueDonors,
  };
}
