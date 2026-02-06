"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, TrendingUp, TrendingDown } from "lucide-react";
import { createFinance } from "@/actions/finance";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/finance-constants";

const financeSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().min(1000, "Minimal Rp 1.000"),
  description: z.string().min(3, "Deskripsi minimal 3 karakter"),
  category: z.string().min(1, "Pilih kategori"),
  date: z.string().min(1, "Pilih tanggal"),
});

type FinanceFormData = z.infer<typeof financeSchema>;

export function FinanceForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      type: "INCOME",
      amount: 0,
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const transactionType = form.watch("type");
  const categories = transactionType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Reset category when type changes
  const handleTypeChange = (value: "INCOME" | "EXPENSE") => {
    form.setValue("type", value);
    form.setValue("category", "");
  };

  const onSubmit = async (data: FinanceFormData) => {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      await createFinance({
        type: data.type,
        amount: data.amount,
        description: data.description,
        category: data.category as "KOTAK_AMAL" | "TRANSFER" | "DONASI" | "INFAQ" | "ZAKAT" | "OPERASIONAL" | "SOSIAL" | "RENOVASI" | "PENDIDIKAN" | "LAINNYA",
        date: new Date(data.date),
        createdBy: session.user.id,
      });

      toast.success(
        data.type === "INCOME"
          ? "Pemasukan berhasil ditambahkan"
          : "Pengeluaran berhasil ditambahkan"
      );
      router.push("/admin/keuangan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan transaksi");
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
            <Card>
              <CardHeader>
                <CardTitle>Jenis Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Simpan Transaksi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
