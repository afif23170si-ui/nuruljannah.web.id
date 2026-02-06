// Finance Categories - matching Prisma enum
export const INCOME_CATEGORIES = [
  { value: "KOTAK_AMAL", label: "Kotak Amal" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "DONASI", label: "Donasi" },
  { value: "INFAQ", label: "Infaq" },
  { value: "ZAKAT", label: "Zakat" },
];

export const EXPENSE_CATEGORIES = [
  { value: "OPERASIONAL", label: "Operasional" },
  { value: "SOSIAL", label: "Sosial" },
  { value: "RENOVASI", label: "Renovasi" },
  { value: "PENDIDIKAN", label: "Pendidikan" },
  { value: "LAINNYA", label: "Lainnya" },
];

// Finance Types
export type FinanceType = "INCOME" | "EXPENSE";

export type FinanceCategory = 
  | "KOTAK_AMAL" 
  | "TRANSFER" 
  | "DONASI" 
  | "INFAQ" 
  | "ZAKAT" 
  | "OPERASIONAL" 
  | "SOSIAL" 
  | "RENOVASI" 
  | "PENDIDIKAN" 
  | "LAINNYA";

// Category label lookup
export const CATEGORY_LABELS: Record<string, string> = {
  KOTAK_AMAL: "Kotak Amal",
  TRANSFER: "Transfer",
  DONASI: "Donasi",
  INFAQ: "Infaq",
  ZAKAT: "Zakat",
  OPERASIONAL: "Operasional",
  SOSIAL: "Sosial",
  RENOVASI: "Renovasi",
  PENDIDIKAN: "Pendidikan",
  LAINNYA: "Lainnya",
};
