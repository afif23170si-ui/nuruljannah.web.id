"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
  FormDescription,
} from "@/components/ui/form";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSiteSettings } from "@/actions/settings";
import { 
  Loader2, 
  Building2, 
  Phone, 
  Share2, 
  CreditCard,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { uploadLogo } from "@/actions/upload";

const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
  accountName: z.string().min(1, "Nama pemilik wajib diisi"),
});

const settingsSchema = z.object({
  mosqueName: z.string().min(1, "Nama masjid wajib diisi"),
  mosqueAddress: z.string().optional(),
  mosqueCity: z.string().optional(),
  mosqueProvince: z.string().optional(),
  mosquePostcode: z.string().optional(),
  mosqueDescription: z.string().optional(),
  mosqueLogo: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  bankAccounts: z.array(bankAccountSchema).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: {
    id: string;
    mosqueName: string;
    mosqueAddress: string | null;
    mosqueCity: string | null;
    mosqueProvince: string | null;
    mosquePostcode: string | null;
    mosqueDescription: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    tiktok: string | null;
    mosqueLogo: string | null;
    bankAccounts: unknown;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const bankAccounts = (settings.bankAccounts as Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>) || [];

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      mosqueName: settings.mosqueName || "",
      mosqueAddress: settings.mosqueAddress || "",
      mosqueCity: settings.mosqueCity || "",
      mosqueProvince: settings.mosqueProvince || "",
      mosquePostcode: settings.mosquePostcode || "",
      mosqueDescription: settings.mosqueDescription || "",
      mosqueLogo: settings.mosqueLogo || "",
      phone: settings.phone || "",
      whatsapp: settings.whatsapp || "",
      email: settings.email || "",
      facebook: settings.facebook || "",
      instagram: settings.instagram || "",
      youtube: settings.youtube || "",
      tiktok: settings.tiktok || "",
      bankAccounts: bankAccounts,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankAccounts",
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateSiteSettings(data);
      toast.success("Pengaturan berhasil disimpan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB");
        setUploadingLogo(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadLogo(formData);

      if (!result.success) {
        toast.error(result.error || "Gagal upload logo");
        return;
      }

      form.setValue("mosqueLogo", result.url!);
      toast.success("Logo berhasil diupload");
    } catch (error: any) {
      console.error("Logo upload error:", error);
      toast.error("Terjadi kesalahan saat upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Kontak</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sosmed</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Rekening</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <AdminCard title="Profil Masjid" description="Informasi dasar tentang masjid">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="mosqueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Masjid</FormLabel>
                      <FormControl>
                        <Input placeholder="Masjid Nurul Jannah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mosqueAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jl. Contoh No. 123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mosqueCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota/Kabupaten</FormLabel>
                        <FormControl>
                          <Input placeholder="Jakarta Selatan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mosqueProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Input placeholder="DKI Jakarta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="mosquePostcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mosqueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Masjid</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tentang masjid..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Deskripsi singkat tentang masjid yang akan ditampilkan di halaman Profil
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mosqueLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Masjid</FormLabel>
                      <FormControl>
                        <div className="flex items-start gap-6">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                              {field.value ? (
                                <Image
                                  src={field.value}
                                  alt="Logo Preview"
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingLogo}
                                  onClick={() => document.getElementById("logo-upload")?.click()}
                                >
                                  {uploadingLogo ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                  )}
                                  Upload Logo Baru
                                </Button>
                                {field.value && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => field.onChange("")}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Hapus
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Format: JPG, PNG, WEBP. Maksimal 2MB. Disarankan rasio 1:1.
                              </p>
                              <Input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                              />
                            </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <AdminCard title="Informasi Kontak" description="Nomor telepon dan email untuk dihubungi">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="021-1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="08123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nomor WhatsApp untuk komunikasi dengan jamaah
                      </FormDescription>
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
                          placeholder="info@masjidnuruljannah.id"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <AdminCard title="Media Sosial" description="Akun media sosial masjid">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/masjidnuruljannah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/masjidnuruljannah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/@masjidnuruljannah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://tiktok.com/@masjidnuruljannah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdminCard>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bank">
            <AdminCard title="Rekening Donasi" description="Rekening bank untuk menerima infaq dan sedekah">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-start p-4 border rounded-lg"
                  >
                    <div className="flex-1 grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.bankName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Bank</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank Syariah Indonesia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.accountNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Rekening</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.accountName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Atas Nama</FormLabel>
                            <FormControl>
                              <Input placeholder="Masjid Nurul Jannah" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 mt-8"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ bankName: "", accountNumber: "", accountName: "" })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Rekening
                </Button>
              </div>
            </AdminCard>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </Form>
  );
}
