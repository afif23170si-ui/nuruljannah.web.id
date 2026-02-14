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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createEvent, updateEvent } from "@/actions/admin";

const eventSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  category: z.enum([
    "KAJIAN_RUTIN",
    "PROGRAM_RUTIN",
    "EVENT_BESAR",
    "SOSIAL",
    "INTERNAL_DKM",
  ]),
  isRecurring: z.boolean(),
  dayOfWeek: z.coerce.number().min(0).max(6).optional().nullable(),
  date: z.string().optional().nullable(),
  time: z.string().min(1, "Waktu wajib diisi"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  speaker: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const DAYS = [
  { value: "0", label: "Ahad" },
  { value: "1", label: "Senin" },
  { value: "2", label: "Selasa" },
  { value: "3", label: "Rabu" },
  { value: "4", label: "Kamis" },
  { value: "5", label: "Jumat" },
  { value: "6", label: "Sabtu" },
];

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    description?: string | null;
    category: string;
    isRecurring: boolean;
    dayOfWeek?: number | null;
    date?: Date | string | null;
    time: string;
    endTime?: string | null;
    location?: string | null;
    speaker?: string | null;
  };
}

export function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category:
        (initialData?.category as EventFormData["category"]) || "KAJIAN_RUTIN",
      isRecurring: initialData?.isRecurring ?? true,
      dayOfWeek: initialData?.dayOfWeek ?? null,
      date: initialData?.date
        ? typeof initialData.date === "string"
          ? initialData.date.slice(0, 10)
          : new Date(initialData.date).toISOString().slice(0, 10)
        : "",
      time: initialData?.time || "",
      endTime: initialData?.endTime || "",
      location: initialData?.location || "",
      speaker: initialData?.speaker || "",
    },
  });

  const isRecurring = form.watch("isRecurring");

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);

    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        isRecurring: data.isRecurring,
        dayOfWeek: data.isRecurring ? (data.dayOfWeek ?? undefined) : null,
        date:
          !data.isRecurring && data.date
            ? new Date(data.date)
            : null,
        time: data.time,
        endTime: data.endTime || undefined,
        location: data.location || undefined,
        speaker: data.speaker || undefined,
      };

      if (initialData) {
        await updateEvent(initialData.id, payload);
        toast.success("Agenda berhasil diperbarui");
      } else {
        await createEvent(payload);
        toast.success("Agenda berhasil ditambahkan");
      }
      router.push("/admin/kajian");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan agenda");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Back button */}
        <Link
          href="/admin/kajian"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Agenda
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Agenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Agenda</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Kajian Ba'da Maghrib"
                          {...field}
                        />
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
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsi kegiatan..."
                          className="resize-none h-24"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="speaker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pemateri / Penanggung Jawab (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Ustadz Ahmad"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Lantai 2 Masjid"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          <SelectItem value="KAJIAN_RUTIN">Kajian Rutin</SelectItem>
                          <SelectItem value="PROGRAM_RUTIN">Program Rutin</SelectItem>
                          <SelectItem value="EVENT_BESAR">
                            Event Besar
                          </SelectItem>
                          <SelectItem value="SOSIAL">
                            Kegiatan Sosial
                          </SelectItem>
                          <SelectItem value="INTERNAL_DKM">
                            Internal DKM
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Agenda Rutin (Berulang)
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Aktifkan jika event berlangsung setiap minggu
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

                {isRecurring ? (
                  <FormField
                    control={form.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hari</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(parseInt(v))}
                          defaultValue={
                            field.value !== null && field.value !== undefined
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih hari" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DAYS.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mulai</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selesai</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {initialData ? "Perbarui Agenda" : "Simpan Agenda"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
