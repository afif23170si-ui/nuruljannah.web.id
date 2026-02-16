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
  FormDescription,
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
import { toast } from "sonner";
import { Loader2, Save, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createArticle, updateArticle } from "@/actions/admin";

const articleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  excerpt: z.string().optional(),
  category: z.enum(["ARTIKEL", "BERITA", "PENGUMUMAN", "KAJIAN", "KHUTBAH"]),
  coverImage: z.string().url().optional().or(z.literal("")),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    category: string;
    coverImage?: string | null;
    status: string;
  };
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      category: (initialData?.category as ArticleFormData["category"]) || "ARTIKEL",
      coverImage: initialData?.coverImage || "",
    },
  });

  const onSubmit = async (data: ArticleFormData, status: "DRAFT" | "PUBLISHED") => {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      if (initialData) {
        await updateArticle(initialData.id, { ...data, status });
        toast.success(
          status === "PUBLISHED"
            ? "Artikel berhasil dipublikasikan"
            : "Artikel berhasil disimpan"
        );
      } else {
        await createArticle({
          ...data,
          status,
          authorId: session.user.id,
        });
        toast.success(
          status === "PUBLISHED"
            ? "Artikel berhasil dipublikasikan"
            : "Draft berhasil disimpan"
        );
      }
      router.push("/admin/artikel");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan artikel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard title="Konten Artikel">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Artikel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul artikel..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ringkasan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ringkasan singkat artikel..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Akan ditampilkan di halaman listing artikel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konten</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis konten artikel di sini..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mendukung format HTML untuk styling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard title="Pengaturan">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ARTIKEL">Artikel</SelectItem>
                          <SelectItem value="BERITA">Berita</SelectItem>
                          <SelectItem value="PENGUMUMAN">Pengumuman</SelectItem>
                          <SelectItem value="KAJIAN">Ringkasan Kajian</SelectItem>
                          <SelectItem value="KHUTBAH">Ringkasan Khutbah</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Gambar Cover (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL gambar untuk thumbnail artikel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard title="Aksi">
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => onSubmit(data, "DRAFT"))}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Simpan Draft
                </Button>
                <Button
                  type="button"
                  className="w-full gap-2"
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => onSubmit(data, "PUBLISHED"))}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Publikasikan
                </Button>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </Form>
  );
}
