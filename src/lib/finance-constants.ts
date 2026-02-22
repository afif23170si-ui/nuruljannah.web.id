// ── Finance Categories (Jenis/Sumber Transaksi) ─────────────

export const INCOME_CATEGORIES = [
  { value: "INFAQ", label: "Infaq" },
  { value: "DONASI", label: "Donasi" },
  { value: "SEDEKAH", label: "Sedekah" },
  { value: "ZAKAT", label: "Zakat" },
  { value: "ZAKAT_FITRAH", label: "Zakat Fitrah" },
  { value: "ZAKAT_MAAL", label: "Zakat Maal" },
  { value: "WAKAF", label: "Wakaf" },
  { value: "FIDYAH", label: "Fidyah" },
];

export const EXPENSE_CATEGORIES = [
  { value: "OPERASIONAL", label: "Operasional" },
  { value: "SOSIAL", label: "Sosial" },
  { value: "RENOVASI", label: "Renovasi" },
  { value: "PENDIDIKAN", label: "Pendidikan" },
  { value: "LAINNYA", label: "Lainnya" },
];

// ── Finance Types ────────────────────────────────────────────

export type FinanceType = "INCOME" | "EXPENSE";

export type FinanceCategory = 
  | "INFAQ" 
  | "DONASI" 
  | "SEDEKAH"
  | "ZAKAT" 
  | "ZAKAT_FITRAH"
  | "ZAKAT_MAAL"
  | "WAKAF"
  | "FIDYAH"
  | "OPERASIONAL" 
  | "SOSIAL" 
  | "RENOVASI" 
  | "PENDIDIKAN" 
  | "LAINNYA";

// ── Category Labels ──────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  INFAQ: "Infaq",
  DONASI: "Donasi",
  SEDEKAH: "Sedekah",
  ZAKAT: "Zakat",
  ZAKAT_FITRAH: "Zakat Fitrah",
  ZAKAT_MAAL: "Zakat Maal",
  WAKAF: "Wakaf",
  FIDYAH: "Fidyah",
  OPERASIONAL: "Operasional",
  SOSIAL: "Sosial",
  RENOVASI: "Renovasi",
  PENDIDIKAN: "Pendidikan",
  LAINNYA: "Lainnya",
  // Legacy (backward compat for existing data)
  KOTAK_AMAL: "Kotak Amal",
  TRANSFER: "Transfer",
};

// ── Payment Methods (Media Pembayaran) ───────────────────────

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Tunai" },
  { value: "KOTAK_AMAL", label: "Kotak Amal" },
  { value: "TRANSFER", label: "Transfer Bank" },
  { value: "QRIS", label: "QRIS" },
  { value: "EWALLET", label: "E-Wallet" },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Tunai",
  KOTAK_AMAL: "Kotak Amal",
  TRANSFER: "Transfer Bank",
  QRIS: "QRIS",
  EWALLET: "E-Wallet",
};

// ── Fund Types ───────────────────────────────────────────────

export type FundType = "OPERASIONAL" | "TITIPAN";

export const FUND_TYPE_OPTIONS = [
  { value: "OPERASIONAL", label: "Kas Umum", description: "Kas umum operasional masjid" },
  { value: "TITIPAN", label: "Dana Anak Yatim", description: "Dana khusus santunan anak yatim" },
];

export const FUND_TYPE_LABELS: Record<string, string> = {
  OPERASIONAL: "Kas Umum",
  TITIPAN: "Dana Anak Yatim",
};
