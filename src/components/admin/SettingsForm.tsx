"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import dynamic from "next/dynamic";
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
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { uploadLogo } from "@/actions/upload";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor").then(mod => ({ default: mod.RichTextEditor })),
  { ssr: false, loading: () => <div className="h-[200px] rounded-lg border border-gray-200 bg-gray-50 animate-pulse" /> }
);

const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
  accountName: z.string().min(1, "Nama pemilik wajib diisi"),
});

const contactSchema = z.object({
  label: z.string().min(1, "Label kontak wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  link: z.string().optional(),
});

const ewalletSchema = z.object({
  name: z.string().min(1, "Nama e-wallet wajib diisi"),
  number: z.string().min(1, "Nomor wajib diisi"),
  logo: z.string().optional(),
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
  openingBalance: z.number().optional(),
  bankAccounts: z.array(bankAccountSchema).optional(),
  contacts: z.array(contactSchema).optional(),
  qrisImageUrl: z.string().optional(),
  ewallets: z.array(ewalletSchema).optional(),
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
    contacts: unknown;
    qrisImageUrl: string | null;
    ewallets: unknown;
    openingBalance: unknown;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const bankAccounts = (settings.bankAccounts as Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>) || [];

  const contacts = (settings.contacts as Array<{
    label: string;
    phone: string;
    link?: string;
  }>) || [];

  const ewallets = (settings.ewallets as Array<{
    name: string;
    number: string;
    logo: string;
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
      openingBalance: Number(settings.openingBalance || 0),
      bankAccounts: bankAccounts,
      contacts: contacts,
      qrisImageUrl: settings.qrisImageUrl || "",
      ewallets: ewallets,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankAccounts",
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const { fields: ewalletFields, append: appendEwallet, remove: removeEwallet } = useFieldArray({
    control: form.control,
    name: "ewallets",
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
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-100/80 p-1 h-auto inline-flex items-center justify-start w-auto">
            <TabsTrigger value="profile" className="gap-2 px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Profil Masjid</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2 px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Kontak</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2 px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Media Sosial</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2 px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Rekening Donasi</span>
            </TabsTrigger>
          </TabsList>

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
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Tentang masjid..."
                        />
                      </FormControl>
                      <FormDescription>
                        Deskripsi tentang masjid yang akan ditampilkan di halaman Profil
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
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Visi masjid..."
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
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Misi masjid..."
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
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Tulis sejarah masjid dengan format yang menarik..."
                        />
                      </FormControl>
                      <FormDescription>
                        Gunakan toolbar untuk menambahkan judul, list, kutipan, dan format lainnya
                      </FormDescription>
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
          <TabsContent value="contact" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
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

            {/* Kontak Pengurus Inti */}
            <AdminCard title="Kontak Pengurus Inti" description="Daftar kontak pengurus yang bisa dihubungi jamaah" compact={true}>
              <div className="space-y-4 md:space-y-6">
                {contactFields.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">Belum ada kontak pengurus ditambahkan</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendContact({ label: "", phone: "", link: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Kontak Pengurus
                    </Button>
                  </div>
                )}

                {contactFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative flex flex-col gap-4 p-5 border border-gray-100 bg-white rounded-xl shadow-sm group hover:border-emerald-100 transition-colors"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeContact(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="font-medium text-sm text-gray-500 mb-2">Kontak #{index + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label / Nama</FormLabel>
                            <FormControl>
                              <Input placeholder="Pengurus I (Ns. Rico, S.Kep)" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`contacts.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input placeholder="+62 852-2544-1245" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`contacts.${index}.link`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link WhatsApp</FormLabel>
                            <FormControl>
                              <Input placeholder="https://wa.me/6285225441245" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                {contactFields.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-gray-300 hover:border-emerald-500 hover:text-emerald-600 h-12"
                    onClick={() => appendContact({ label: "", phone: "", link: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kontak Lainnya
                  </Button>
                )}
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
            {/* Opening Balance */}
            <AdminCard title="Saldo Awal (Pra-Digital)" description="Posisi kas masjid sebelum pencatatan digital dimulai" compact={true}>
              <FormField
                control={form.control}
                name="openingBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Awal (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: -2410000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">Masukkan angka negatif jika saldo awal defisit. Angka ini akan ditambahkan ke Total Saldo Kas.</p>
                  </FormItem>
                )}
              />
            </AdminCard>

            <div className="h-4" />

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

            {/* QRIS Image */}
            <AdminCard title="QRIS" description="Upload gambar QRIS untuk pembayaran digital" compact={true} className="mt-6">
              <FormField
                control={form.control}
                name="qrisImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Gambar QRIS</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/qris.png"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">Upload gambar QRIS ke galeri/media terlebih dahulu, lalu paste URL-nya di sini</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("qrisImageUrl") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="bg-white rounded-lg p-3 w-fit mx-auto border border-gray-100">
                    <img
                      src={form.watch("qrisImageUrl")}
                      alt="QRIS Preview"
                      className="w-48 h-48 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </AdminCard>

            {/* E-Wallets */}
            <AdminCard title="E-Wallet" description="Daftar e-wallet untuk menerima donasi" compact={true} className="mt-6">
              <div className="space-y-4 md:space-y-6">
                {ewalletFields.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <Wallet className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">Belum ada e-wallet ditambahkan</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        appendEwallet({ name: "", number: "", logo: "" })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah E-Wallet
                    </Button>
                  </div>
                )}

                {ewalletFields.map((field, index) => (
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
                        onClick={() => removeEwallet(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="font-medium text-sm text-gray-500 mb-2">E-Wallet #{index + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`ewallets.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                              <Input placeholder="GoPay / DANA / ShopeePay" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ewallets.${index}.number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor</FormLabel>
                            <FormControl>
                              <Input placeholder="0812-3456-7890" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ewallets.${index}.logo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emoji/Icon</FormLabel>
                            <FormControl>
                              <Input placeholder="💚" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                {ewalletFields.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 h-12"
                    onClick={() =>
                      appendEwallet({ name: "", number: "", logo: "" })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah E-Wallet Lainnya
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
        </Tabs>
      </form>
    </Form>
  );
}
