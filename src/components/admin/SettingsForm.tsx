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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  tagline: z.string().optional(),
  address: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  history: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  bankAccounts: z.array(bankAccountSchema).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: {
    id: string;
    mosqueName: string;
    tagline: string | null;
    address: string | null;
    village: string | null;
    district: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    description: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    logoUrl: string | null;
    history: string | null;
    vision: string | null;
    mission: string | null;
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
      tagline: settings.tagline || "",
      address: settings.address || "",
      village: settings.village || "",
      district: settings.district || "",
      city: settings.city || "",
      province: settings.province || "",
      postalCode: settings.postalCode || "",
      description: settings.description || "",
      logoUrl: settings.logoUrl || "",
      phone: settings.phone || "",
      whatsapp: settings.whatsapp || "",
      email: settings.email || "",
      facebook: settings.facebook || "",
      instagram: settings.instagram || "",
      twitter: settings.twitter || "",
      youtube: settings.youtube || "",
      history: settings.history || "",
      vision: settings.vision || "",
      mission: settings.mission || "",
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

      form.setValue("logoUrl", result.url!);
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile Navigation */}
          <div className="md:hidden">
             <label htmlFor="settings-tab" className="sr-only">Navigasi Pengaturan</label>
             <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger id="settings-tab" className="w-full h-12 bg-white">
                   <SelectValue placeholder="Pilih bagian pengaturan" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="profile">
                      <div className="flex items-center gap-2">
                         <Building2 className="h-4 w-4" />
                         <span>Profil Masjid</span>
                      </div>
                   </SelectItem>
                   <SelectItem value="contact">
                      <div className="flex items-center gap-2">
                         <Phone className="h-4 w-4" />
                         <span>Kontak</span>
                      </div>
                   </SelectItem>
                   <SelectItem value="social">
                      <div className="flex items-center gap-2">
                         <Share2 className="h-4 w-4" />
                         <span>Media Sosial</span>
                      </div>
                   </SelectItem>
                   <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                         <CreditCard className="h-4 w-4" />
                         <span>Rekening Donasi</span>
                      </div>
                   </SelectItem>
                </SelectContent>
             </Select>
          </div>

          {/* Desktop + Mobile Content Layout */}
          <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8 items-start">
             {/* Desktop Sidebar Navigation (hidden on mobile) */}
             <div className="hidden md:block sticky top-24">
               <div className="py-2">
                 <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pengaturan</h3>
                 <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1 w-full justify-start">
                    <TabsTrigger 
                       value="profile" 
                       className="w-full justify-start px-4 py-3 h-auto text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-50 data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-600 data-[state=active]:shadow-none border-0 ring-0 focus-visible:ring-0 rounded-lg transition-all"
                    >
                      <Building2 className="h-4 w-4 mr-3" />
                      Profil Masjid
                    </TabsTrigger>
                    <TabsTrigger 
                       value="contact" 
                       className="w-full justify-start px-4 py-3 h-auto text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-50 data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-600 data-[state=active]:shadow-none border-0 ring-0 focus-visible:ring-0 rounded-lg transition-all"
                    >
                      <Phone className="h-4 w-4 mr-3" />
                      Kontak
                    </TabsTrigger>
                    <TabsTrigger 
                       value="social" 
                       className="w-full justify-start px-4 py-3 h-auto text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-50 data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-600 data-[state=active]:shadow-none border-0 ring-0 focus-visible:ring-0 rounded-lg transition-all"
                    >
                      <Share2 className="h-4 w-4 mr-3" />
                      Media Sosial
                    </TabsTrigger>
                    <TabsTrigger 
                       value="bank" 
                       className="w-full justify-start px-4 py-3 h-auto text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-50 data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-600 data-[state=active]:shadow-none border-0 ring-0 focus-visible:ring-0 rounded-lg transition-all"
                    >
                      <CreditCard className="h-4 w-4 mr-3" />
                      Rekening Donasi
                    </TabsTrigger>
                 </TabsList>
               </div>
             </div>

             {/* Content Area (visible on both mobile and desktop) */}
             <div className="min-w-0 space-y-6">

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AdminCard title="Profil Masjid" description="Informasi dasar tentang masjid" compact={true}>
              <div className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="mosqueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Masjid</FormLabel>
                      <FormControl>
                        <Input placeholder="Masjid Nurul Jannah" {...field} className="h-10 md:h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input placeholder="Pusat Ibadah, Dakwah, dan Pendidikan" {...field} className="h-10 md:h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jl. Contoh No. 123"
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelurahan/Desa</FormLabel>
                        <FormControl>
                          <Input placeholder="Kelurahan" {...field} className="h-10 md:h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Kecamatan" {...field} className="h-10 md:h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota/Kabupaten</FormLabel>
                        <FormControl>
                          <Input placeholder="Jakarta Selatan" {...field} className="h-10 md:h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Input placeholder="DKI Jakarta" {...field} className="h-10 md:h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} className="h-10 md:h-11" />
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
                      <FormLabel>Deskripsi Masjid</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tentang masjid..."
                          rows={4}
                          {...field}
                          className="min-h-[120px]"
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
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Visi masjid..."
                          rows={3}
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Misi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Misi masjid..."
                          rows={3}
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sejarah Masjid</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Sejarah berdirinya masjid..."
                          rows={4}
                          {...field}
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Masjid</FormLabel>
                      <FormControl>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50">
                            <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-white">
                              {field.value ? (
                                <Image
                                  src={field.value}
                                  alt="Logo Preview"
                                  fill
                                  sizes="(max-width: 768px) 96px, 128px"
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-gray-300" />
                              )}
                            </div>
                            <div className="flex flex-col items-center md:items-start space-y-3 w-full text-center md:text-left">
                              <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingLogo}
                                  onClick={() => document.getElementById("logo-upload")?.click()}
                                  className="bg-white"
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
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => field.onChange("")}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Hapus
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground max-w-xs">
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
          <TabsContent value="contact" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AdminCard title="Informasi Kontak" description="Nomor telepon dan email untuk dihubungi" compact={true}>
              <div className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="021-1234567" {...field} className="h-10 md:h-11" />
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
                        <Input placeholder="08123456789" {...field} className="h-10 md:h-11" />
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
                          className="h-10 md:h-11"
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
          <TabsContent value="social" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AdminCard title="Media Sosial" description="Akun media sosial masjid" compact={true}>
              <div className="space-y-4 md:space-y-6">
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
                          className="h-10 md:h-11"
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
                          className="h-10 md:h-11"
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
                          className="h-10 md:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter / X</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/masjidnuruljannah"
                          {...field}
                          className="h-10 md:h-11"
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
          <TabsContent value="bank" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AdminCard title="Rekening Donasi" description="Rekening bank untuk menerima infaq dan sedekah" compact={true}>
              <div className="space-y-4 md:space-y-6">
                {fields.length === 0 && (
                   <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                      <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">Belum ada rekening donasi ditambahkan</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({ bankName: "", accountNumber: "", accountName: "" })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Rekening Baru
                      </Button>
                   </div>
                )}

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative flex flex-col gap-4 p-5 border border-gray-100 bg-white rounded-xl shadow-sm group hover:border-blue-100 transition-colors"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="font-medium text-sm text-gray-500 mb-2">Rekening #{index + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.bankName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Bank</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank Syariah Indonesia" {...field} className="h-10" />
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
                              <Input placeholder="1234567890" {...field} className="h-10" />
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
                              <Input placeholder="Masjid Nurul Jannah" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
            
                {fields.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 h-12"
                      onClick={() =>
                        append({ bankName: "", accountNumber: "", accountName: "" })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Rekening Lainnya
                    </Button>
                )}
              </div>
            </AdminCard>
          </TabsContent>
        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
        </div>
        </div>
        </Tabs>
      </form>
    </Form>
  );
}
