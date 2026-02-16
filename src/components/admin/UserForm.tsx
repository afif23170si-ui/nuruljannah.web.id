"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createUser, updateUser } from "@/actions/users";
import { Loader2 } from "lucide-react";

const roles = [
  { value: "ADMIN", label: "Administrator" },
  { value: "BENDAHARA", label: "Bendahara" },
  { value: "TAKMIR", label: "Takmir" },
  { value: "PENGELOLA_TPA", label: "Pengelola TPA" },
  { value: "JAMAAH", label: "Jamaah" },
];

const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "BENDAHARA", "TAKMIR", "PENGELOLA_TPA", "JAMAAH"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(
      isEditing
        ? userSchema
        : userSchema.extend({
            password: z.string().min(6, "Password minimal 6 karakter"),
          })
    ),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: (user?.role as UserFormData["role"]) || "JAMAAH",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing) {
        await updateUser(user.id, {
          name: data.name,
          email: data.email,
          password: data.password || undefined,
          role: data.role,
        });
        toast.success("User berhasil diperbarui");
      } else {
        await createUser({
          name: data.name,
          email: data.email,
          password: data.password!,
          role: data.role,
        });
        toast.success("User berhasil ditambahkan");
      }
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <AdminCard title={isEditing ? "Edit User" : "Tambah User Baru"} description={isEditing ? "Perbarui informasi user" : "Tambahkan user baru ke sistem"} className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {isEditing && "(Kosongkan jika tidak ingin mengubah)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? "••••••••" : "Minimal 6 karakter"}
                      {...field}
                    />
                  </FormControl>
                  {isEditing && (
                    <FormDescription>
                      Biarkan kosong jika tidak ingin mengubah password
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Jabatan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Simpan Perubahan" : "Tambah User"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminCard>
  );
}
