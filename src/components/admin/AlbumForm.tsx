"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAlbum, updateAlbum } from "@/actions/gallery";
import { Loader2, Save, ImageIcon } from "lucide-react";

// Generate slug from title (client-side utility)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const albumSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type AlbumFormData = z.infer<typeof albumSchema>;

interface AlbumFormProps {
  album?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    coverImage: string | null;
  };
}

export default function AlbumForm({ album }: AlbumFormProps) {
  const router = useRouter();
  const isEditing = !!album;

  const form = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: album?.title || "",
      slug: album?.slug || "",
      description: album?.description || "",
      isActive: album?.isActive ?? true,
    },
  });

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    form.setValue("title", newTitle);
    if (!isEditing) {
      form.setValue("slug", generateSlug(newTitle));
    }
  };

  const onSubmit = async (data: AlbumFormData) => {
    try {
      if (isEditing) {
        await updateAlbum(album.id, data);
        toast.success("Album berhasil diperbarui");
      } else {
        await createAlbum(data);
        toast.success("Album berhasil dibuat");
      }
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {isEditing ? "Edit Album" : "Album Baru"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Perbarui informasi album galeri"
                : "Buat album baru untuk mengelompokkan foto-foto"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Album</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Kegiatan Ramadhan 2026"
                      {...field}
                      onChange={onTitleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug URL</FormLabel>
                  <FormControl>
                    <Input placeholder="kegiatan-ramadhan-2026" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL: /galeri/{form.watch("slug") || "slug-album"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tentang album ini..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Tampilkan</FormLabel>
                      <FormDescription>
                        Album akan ditampilkan di halaman galeri publik
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Simpan Perubahan" : "Buat Album"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
