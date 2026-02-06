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
import { createStudent, updateStudent } from "@/actions/tpa";

const studentSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  birthDate: z.string().optional(),
  parentName: z.string().min(3, "Nama orang tua minimal 3 karakter"),
  parentPhone: z.string().min(10, "Nomor HP minimal 10 digit"),
  address: z.string().optional(),
  classId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED"]),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: any;
  classes: { id: string; name: string }[];
  isEditing?: boolean;
}

export function StudentForm({ initialData, classes, isEditing = false }: StudentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || "",
      birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split("T")[0] : "",
      parentName: initialData?.parentName || "",
      parentPhone: initialData?.parentPhone || "",
      address: initialData?.address || "",
      classId: initialData?.classId || "",
      status: initialData?.status || "ACTIVE",
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      };

      if (isEditing && initialData?.id) {
        await updateStudent(initialData.id, formattedData);
        toast.success("Data santri berhasil diperbarui");
      } else {
        await createStudent(formattedData);
        toast.success("Santri baru berhasil ditambahkan");
      }
      
      router.push("/admin/tpa/students");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data santri");
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
                  <FormLabel>Nama Lengkap Santri</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Santri" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Orang Tua / Wali</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Orang Tua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp / HP</FormLabel>
                    <FormControl>
                      <Input placeholder="08..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alamat lengkap..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Santri</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                        <SelectItem value="GRADUATED">Lulus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditing ? "Simpan Perubahan" : "Daftarkan Santri"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
