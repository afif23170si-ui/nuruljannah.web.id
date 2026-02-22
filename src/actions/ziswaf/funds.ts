"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type FundTypeEnum = "OPERASIONAL" | "SOSIAL" | "ZAKAT" | "WAKAF" | "QURBAN" | "PEMBANGUNAN" | "LAINNYA";

// Get All Funds
export async function getFunds(options?: {
  isActive?: boolean;
  type?: FundTypeEnum;
}) {
  const where: Record<string, unknown> = {};
  
  if (options?.isActive !== undefined) where.isActive = options.isActive;
  if (options?.type) where.type = options.type;

  return prisma.fund.findMany({
    where,
    orderBy: [
      { type: 'asc' },
      { name: 'asc' }
    ]
  });
}

// Get Fund By ID
export async function getFundById(id: string) {
  return prisma.fund.findUnique({
    where: { id }
  });
}

// Create Fund
export async function createFund(data: {
  name: string;
  type: FundTypeEnum;
  isRestricted: boolean;
  description?: string;
  isActive?: boolean;
}) {
  const result = await prisma.fund.create({
    data,
  });
  
  revalidateTag("funds", "max");
  revalidateTag("finance", "max");
  return result;
}

// Update Fund
export async function updateFund(
  id: string,
  data: Partial<{
    name: string;
    type: FundTypeEnum;
    isRestricted: boolean;
    description: string;
    isActive: boolean;
  }>
) {
  const result = await prisma.fund.update({
    where: { id },
    data,
  });
  
  revalidateTag("funds", "max");
  revalidateTag("finance", "max");
  return result;
}

// Delete Fund
export async function deleteFund(id: string) {
  // Check if there are related transactions
  const hasTransactions = await prisma.finance.findFirst({
    where: { fundId: id },
  });

  if (hasTransactions) {
    throw new Error("Cannot delete fund because it has existing transactions. Consider setting it to inactive instead.");
  }

  const result = await prisma.fund.delete({
    where: { id }
  });

  revalidateTag("funds", "max");
  return result;
}
