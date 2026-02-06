"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { createClass, updateClass } from "@/actions/tpa";

const classSchema = z.object({
  name: z.string().min(3, "Nama kelas minimal 3 karakter"),
  description: z.string().optional(),
  schedule: z.string().optional(),
  teacherId: z.string().optional(),
  isActive: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  initialData?: any;
  teachers: { id: string; name: string }[];
  isEditing?: boolean;
}

export function ClassForm({ initialData, teachers, isEditing = false }: ClassFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      schedule: initialData?.schedule || "",
      teacherId: initialData?.teacherId || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && initialData?.id) {
        await updateClass(initialData.id, data);
        toast.success("Data kelas berhasil diperbarui");
      } else {
        await createClass(data);
        toast.success("Kelas baru berhasil dibuat");
      }
      
      router.push("/admin/tpa/classes");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data kelas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kelas</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kelas Iqra 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wali Kelas / Pengajar Utama</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pengajar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jadwal Belajar</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Senin - Jumat, 16.00 - 17.30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi kelas..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditing ? "Simpan Kelas" : "Buat Kelas"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
