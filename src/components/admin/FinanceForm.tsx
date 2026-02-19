"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, TrendingUp, TrendingDown } from "lucide-react";
import { createFinance, updateFinance } from "@/actions/finance";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/finance-constants";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Tunai" },
  { value: "TRANSFER", label: "Transfer Bank" },
  { value: "QRIS", label: "QRIS" },
  { value: "EWALLET", label: "E-Wallet" },
];

const financeSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().min(1000, "Minimal Rp 1.000"),
  description: z.string().min(3, "Deskripsi minimal 3 karakter"),
  category: z.string().min(1, "Pilih kategori"),
  date: z.string().min(1, "Pilih tanggal"),
  donorName: z.string().optional(),
  paymentMethod: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

type FinanceFormData = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  initialData?: {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    category: string;
    date: string; // ISO date string (yyyy-MM-dd)
    donorName?: string | null;
    paymentMethod?: string | null;
    isAnonymous?: boolean;
  };
}

export function FinanceForm({ initialData }: FinanceFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      type: initialData?.type ?? "INCOME",
      amount: initialData?.amount ?? 0,
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      date: initialData?.date ?? new Date().toISOString().split("T")[0],
      donorName: initialData?.donorName ?? "",
      paymentMethod: initialData?.paymentMethod ?? "",
      isAnonymous: initialData?.isAnonymous ?? false,
    },
  });

  const transactionType = form.watch("type");
  const categories = transactionType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Reset category when type changes (only in create mode)
  const handleTypeChange = (value: "INCOME" | "EXPENSE") => {
    form.setValue("type", value);
    if (!isEditMode || value !== initialData?.type) {
      form.setValue("category", "");
    }
  };

  const onSubmit = async (data: FinanceFormData) => {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && initialData) {
        await updateFinance(initialData.id, {
          amount: data.amount,
          description: data.description,
          category: data.category as any,
          date: new Date(data.date),
          donorName: data.donorName || null,
          paymentMethod: data.paymentMethod || null,
          isAnonymous: data.isAnonymous,
        } as any);
        toast.success("Transaksi berhasil diperbarui");
      } else {
        await createFinance({
          type: data.type,
          amount: data.amount,
          description: data.description,
          category: data.category as any,
          date: new Date(data.date),
          createdBy: session.user.id,
          donorName: data.donorName || undefined,
          paymentMethod: data.paymentMethod || undefined,
          isAnonymous: data.isAnonymous,
        });
        toast.success(
          data.type === "INCOME"
            ? "Pemasukan berhasil ditambahkan"
            : "Pengeluaran berhasil ditambahkan"
        );
      }

      router.push("/admin/keuangan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(isEditMode ? "Gagal memperbarui transaksi" : "Gagal menyimpan transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Type */}
            <AdminCard title="Jenis Transaksi">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => handleTypeChange(val as "INCOME" | "EXPENSE")}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="income"
                          className={`flex items-center justify-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                            field.value === "INCOME"
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : "border-muted hover:bg-accent"
                          }`}
                        >
                          <RadioGroupItem value="INCOME" id="income" className="sr-only" />
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Pemasukan</span>
                        </Label>
                        <Label
                          htmlFor="expense"
                          className={`flex items-center justify-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                            field.value === "EXPENSE"
                              ? "border-red-500 bg-red-50 dark:bg-red-950"
                              : "border-muted hover:bg-accent"
                          }`}
                        >
                          <RadioGroupItem value="EXPENSE" id="expense" className="sr-only" />
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="font-medium">Pengeluaran</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AdminCard>

            {/* Transaction Details */}
            <AdminCard title="Detail Transaksi">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Infaq Jumat minggu ke-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Donor Info - only for INCOME */}
              {transactionType === "INCOME" && (
                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-dashed border-gray-200">
                  <FormField
                    control={form.control}
                    name="donorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Donatur <span className="text-gray-400 font-normal">(opsional)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kosongkan jika anonim"
                            {...field}
                            disabled={form.watch("isAnonymous")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metode Pembayaran <span className="text-gray-400 font-normal">(opsional)</span></FormLabel>
                        <div className="flex items-center gap-2">
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Pilih metode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PAYMENT_METHODS.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && (
                            <button
                              type="button"
                              onClick={() => field.onChange("")}
                              className="shrink-0 h-9 w-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                              title="Kosongkan"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="isAnonymous"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) form.setValue("donorName", "");
                              }}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 text-sm font-normal text-gray-600 cursor-pointer">
                            Donatur anonim (tampil sebagai &ldquo;Hamba Allah&rdquo;)
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard title="Kategori">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Kategori</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard>
                <div className="space-y-3">
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isEditMode ? "Update Transaksi" : "Simpan Transaksi"}
                </Button>
                </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </Form>
  );
}
