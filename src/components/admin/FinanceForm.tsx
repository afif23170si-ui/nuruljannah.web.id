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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { toast } from "sonner";
import { Loader2, Save, TrendingUp, TrendingDown, Wallet, Tag } from "lucide-react";
import { createFinance, updateFinance } from "@/actions/finance";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/finance-constants";

const financeSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
  fundId: z.string().min(1, "Pilih Kantong Dana"),
  amount: z.number().min(1000, "Minimal Rp 1.000"),
  description: z.string().min(3, "Deskripsi minimal 3 karakter"),
  date: z.string().min(1, "Pilih tanggal"),
  donorName: z.string().optional(),
  paymentMethod: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

type FinanceFormData = z.infer<typeof financeSchema>;

export interface Fund {
  id: string;
  name: string;
  type: string;
  isRestricted?: boolean;
}

interface FinanceFormProps {
  funds: Fund[];
  initialData?: {
    id: string;
    type: "INCOME" | "EXPENSE";
    category?: string | null;
    fundId: string;
    amount: number;
    description: string;
    date: string;
    donorName?: string | null;
    paymentMethod?: string | null;
    isAnonymous?: boolean;
  };
}

export function FinanceForm({ funds, initialData }: FinanceFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      type: initialData?.type ?? "INCOME",
      category: initialData?.category ?? "",
      fundId: initialData?.fundId ?? "",
      amount: initialData?.amount ?? 0,
      description: initialData?.description ?? "",
      date: initialData?.date ?? new Date().toISOString().split("T")[0],
      donorName: initialData?.donorName ?? "",
      paymentMethod: initialData?.paymentMethod ?? "",
      isAnonymous: initialData?.isAnonymous ?? false,
    },
  });

  const transactionType = form.watch("type");

  const onSubmit = async (data: FinanceFormData) => {
    if (!session?.user?.id) {
      toast.error("Anda harus login");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isEditMode && initialData) {
        await updateFinance(initialData.id, {
          ...data,
          donorName: data.donorName || null,
          paymentMethod: data.paymentMethod || null,
          date: new Date(data.date),
        });
        toast.success("Transaksi berhasil diperbarui");
      } else {
        await createFinance({
          ...data,
          createdBy: session.user.id,
          date: new Date(data.date),
        });
        toast.success("Transaksi berhasil ditambahkan");
      }
      
      router.push("/admin/keuangan");
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AdminCard className="p-6">
          <div className="space-y-6">
            
            {/* Type Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Jenis Transaksi</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => form.setValue("type", "INCOME")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    transactionType === "INCOME"
                      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                      : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${transactionType === "INCOME" ? "bg-green-100 text-green-600" : "bg-gray-100"}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Pemasukan</span>
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("type", "EXPENSE")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    transactionType === "EXPENSE"
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${transactionType === "EXPENSE" ? "bg-red-100 text-red-600" : "bg-gray-100"}`}>
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Pengeluaran</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <FormField
                control={form.control}
                name="fundId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kantong Dana (Fund)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih Kantong Dana..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {funds.map((fund) => (
                          <SelectItem key={fund.id} value={fund.id}>
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-gray-500" />
                              {fund.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Semua transaksi harus dialokasikan ke kantong dana spesifik.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Transaksi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih Kategori..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(transactionType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 text-gray-400" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Jenis sumber pemasukan atau tujuan pengeluaran.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah (Rp)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-9 h-11 text-lg font-semibold"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
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
                      placeholder={transactionType === "INCOME" ? "Contoh: Kotak Amal Jumat" : "Contoh: Pembayaran Listrik & Air"} 
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Transaksi</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11" />
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
                    <FormLabel>Metode Pembayaran</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Pilih metode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-11 px-3 text-gray-400 hover:text-red-500"
                          onClick={() => field.onChange("")}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </AdminCard>

        {transactionType === "INCOME" && (
          <AdminCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Informasi Donatur (Opsional)</h3>
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4 bg-gray-50/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Hamba Allah (Anonim)
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        Sembunyikan nama donatur di laporan publik
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("isAnonymous") && (
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Donatur</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama (opsional)..." className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </AdminCard>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="h-11 px-6 font-medium"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sabar...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Simpan Perubahan" : "Simpan Transaksi"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Temporary Label component if missing
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={className}>{children}</label>;
}
