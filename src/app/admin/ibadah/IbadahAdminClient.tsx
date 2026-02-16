"use client";

import { useState, useTransition } from "react";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Users,
  Mic2,
  BookOpen,
  Settings,
  Plus,
  Edit,
  Trash2,
  Phone,
  Loader2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  createPrayerOfficer,
  updatePrayerOfficer,
  deletePrayerOfficer,
  createKhutbah,
  updateKhutbah,
  deleteKhutbah,
  updatePrayerTimeSettings,
} from "@/actions/ibadah";
import type { OfficerRole } from "@prisma/client";

type Officer = {
  id: string;
  name: string;
  phone: string | null;
  role: OfficerRole;
  isActive: boolean;
  notes: string | null;
};

type KhutbahItem = {
  id: string;
  date: Date;
  khatib: string;
  title: string;
  theme: string | null;
  summary: string | null;
  audioUrl: string | null;
};

type PrayerSettings = {
  id: string;
  method: number;
  latitude: number;
  longitude: number;
  timezone: string;
  fajrOffset: number;
  dhuhrOffset: number;
  asrOffset: number;
  maghribOffset: number;
  ishaOffset: number;
};

interface IbadahAdminClientProps {
  officers: Officer[];
  khutbahList: KhutbahItem[];
  prayerSettings: PrayerSettings;
}

const ROLE_LABELS: Record<string, string> = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
  KHATIB: "Khatib",
};

const ROLE_COLORS: Record<string, string> = {
  IMAM: "bg-emerald-50 text-emerald-700 border-none",
  MUADZIN: "bg-blue-50 text-blue-700 border-none",
  KHATIB: "bg-amber-50 text-amber-700 border-none",
};

export function IbadahAdminClient({
  officers,
  khutbahList,
  prayerSettings,
}: IbadahAdminClientProps) {
  return (
    <Tabs defaultValue="officers" className="space-y-6">
      <TabsList className="bg-gray-100/80 p-1">
        <TabsTrigger value="officers" className="gap-1.5 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Petugas</span>
        </TabsTrigger>
        <TabsTrigger value="khutbah" className="gap-1.5 text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Khutbah</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Pengaturan</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="officers">
        <OfficersTab officers={officers} />
      </TabsContent>

      <TabsContent value="khutbah">
        <KhutbahTab khutbahList={khutbahList} />
      </TabsContent>

      <TabsContent value="settings">
        <PrayerSettingsTab settings={prayerSettings} />
      </TabsContent>
    </Tabs>
  );
}

// ============================
// OFFICERS TAB
// ============================

function OfficersTab({ officers }: { officers: Officer[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
      role: formData.get("role") as OfficerRole,
      notes: (formData.get("notes") as string) || undefined,
    };

    startTransition(async () => {
      try {
        if (editingOfficer) {
          await updatePrayerOfficer(editingOfficer.id, data);
          toast.success("Petugas berhasil diperbarui");
        } else {
          await createPrayerOfficer(data);
          toast.success("Petugas berhasil ditambahkan");
        }
        setShowDialog(false);
        setEditingOfficer(null);
      } catch {
        toast.error("Gagal menyimpan data petugas");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus petugas ini?")) return;
    startTransition(async () => {
      try {
        await deletePrayerOfficer(id);
        toast.success("Petugas berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus petugas");
      }
    });
  };

  const handleToggleActive = (officer: Officer) => {
    startTransition(async () => {
      try {
        await updatePrayerOfficer(officer.id, {
          isActive: !officer.isActive,
        });
        toast.success(
          officer.isActive
            ? "Petugas dinonaktifkan"
            : "Petugas diaktifkan kembali"
        );
      } catch {
        toast.error("Gagal mengubah status");
      }
    });
  };

  return (
    <AdminCard
      title={`Petugas Ibadah (${officers.length})`}
      description="Imam, muadzin, dan khatib masjid"
    >
      <div className="flex justify-end mb-4">
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) setEditingOfficer(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Petugas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingOfficer
                    ? "Edit Petugas"
                    : "Tambah Petugas Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingOfficer
                    ? "Perbarui informasi petugas ibadah"
                    : "Tambahkan imam, muadzin, atau khatib baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={editingOfficer?.name || ""}
                    placeholder="Nama petugas"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Peran</Label>
                  <Select
                    name="role"
                    defaultValue={editingOfficer?.role || "IMAM"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMAM">Imam</SelectItem>
                      <SelectItem value="MUADZIN">Muadzin</SelectItem>
                      <SelectItem value="KHATIB">Khatib</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingOfficer?.phone || ""}
                    placeholder="+62 812 xxxx xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingOfficer?.notes || ""}
                    placeholder="Catatan tambahan..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingOfficer ? "Simpan Perubahan" : "Tambah Petugas"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {officers.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-500">Belum ada petugas ibadah terdaftar.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100">
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Nama
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Peran
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4 hidden sm:table-cell">
                Telepon
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Status
              </TableHead>
              <TableHead className="w-[120px] text-right py-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {officers.map((officer) => (
              <TableRow
                key={officer.id}
                className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {officer.name}
                    </span>
                    {officer.notes && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {officer.notes}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={`font-semibold ${ROLE_COLORS[officer.role] || ""}`}
                  >
                    {ROLE_LABELS[officer.role] || officer.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-600 hidden sm:table-cell">
                  {officer.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {officer.phone}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    className={`cursor-pointer ${officer.isActive ? "bg-green-50 text-green-700 hover:bg-green-100 border-none" : "bg-gray-100 text-gray-500 border-none"}`}
                    onClick={() => handleToggleActive(officer)}
                  >
                    {officer.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setEditingOfficer(officer);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(officer.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminCard>
  );
}

// ============================
// KHUTBAH TAB
// ============================

function KhutbahTab({ khutbahList }: { khutbahList: KhutbahItem[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingKhutbah, setEditingKhutbah] = useState<KhutbahItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const data = {
      date: new Date(formData.get("date") as string),
      khatib: formData.get("khatib") as string,
      title: formData.get("title") as string,
      theme: (formData.get("theme") as string) || undefined,
      summary: (formData.get("summary") as string) || undefined,
    };

    startTransition(async () => {
      try {
        if (editingKhutbah) {
          await updateKhutbah(editingKhutbah.id, data);
          toast.success("Khutbah berhasil diperbarui");
        } else {
          await createKhutbah(data);
          toast.success("Khutbah berhasil ditambahkan");
        }
        setShowDialog(false);
        setEditingKhutbah(null);
      } catch {
        toast.error("Gagal menyimpan data khutbah");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus data khutbah ini?")) return;
    startTransition(async () => {
      try {
        await deleteKhutbah(id);
        toast.success("Khutbah berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus khutbah");
      }
    });
  };

  return (
    <AdminCard
      title={`Khutbah Jumat (${khutbahList.length})`}
      description="Arsip dan jadwal khutbah Jumat"
    >
      <div className="flex justify-end mb-4">
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) setEditingKhutbah(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Khutbah
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingKhutbah
                    ? "Edit Khutbah"
                    : "Tambah Khutbah Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingKhutbah
                    ? "Perbarui informasi khutbah Jumat"
                    : "Catat khutbah Jumat baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={
                      editingKhutbah
                        ? new Date(editingKhutbah.date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="khatib">Khatib</Label>
                  <Input
                    id="khatib"
                    name="khatib"
                    required
                    defaultValue={editingKhutbah?.khatib || ""}
                    placeholder="Nama khatib"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Judul Khutbah</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={editingKhutbah?.title || ""}
                    placeholder="Judul khutbah"
                  />
                </div>
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Input
                    id="theme"
                    name="theme"
                    defaultValue={editingKhutbah?.theme || ""}
                    placeholder="Tema khutbah"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Ringkasan</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    defaultValue={editingKhutbah?.summary || ""}
                    placeholder="Ringkasan isi khutbah..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingKhutbah
                    ? "Simpan Perubahan"
                    : "Tambah Khutbah"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {khutbahList.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-500">Belum ada data khutbah.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100">
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Tanggal
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Khatib
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">
                Judul
              </TableHead>
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4 hidden md:table-cell">
                Tema
              </TableHead>
              <TableHead className="w-[100px] text-right py-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {khutbahList.map((k) => (
              <TableRow
                key={k.id}
                className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
              >
                <TableCell className="py-4">
                  <span className="text-sm font-semibold text-gray-700">
                    {new Date(k.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    <Mic2 className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-sm font-bold text-gray-900">
                      {k.khatib}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm text-gray-700">{k.title}</span>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell">
                  {k.theme ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-none font-medium"
                    >
                      {k.theme}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setEditingKhutbah(k);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(k.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminCard>
  );
}

// ============================
// PRAYER SETTINGS TAB
// ============================

function PrayerSettingsTab({ settings }: { settings: PrayerSettings }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const data = {
      method: Number(formData.get("method")),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      fajrOffset: Number(formData.get("fajrOffset")),
      dhuhrOffset: Number(formData.get("dhuhrOffset")),
      asrOffset: Number(formData.get("asrOffset")),
      maghribOffset: Number(formData.get("maghribOffset")),
      ishaOffset: Number(formData.get("ishaOffset")),
    };

    startTransition(async () => {
      try {
        await updatePrayerTimeSettings(data);
        toast.success("Pengaturan waktu shalat berhasil disimpan");
      } catch {
        toast.error("Gagal menyimpan pengaturan");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard
        title="Lokasi & Metode"
        description="Koordinat masjid dan metode perhitungan"
      >
        <form action={handleSubmit} id="prayer-settings-form">
          <div className="space-y-4">
            <div>
              <Label htmlFor="method">Metode Perhitungan</Label>
              <Select
                name="method"
                defaultValue={String(settings.method)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">KEMENAG (Indonesia)</SelectItem>
                  <SelectItem value="2">ISNA (North America)</SelectItem>
                  <SelectItem value="3">MWL (Muslim World League)</SelectItem>
                  <SelectItem value="4">Umm al-Qura (Makkah)</SelectItem>
                  <SelectItem value="5">Egyptian General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  defaultValue={settings.latitude}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  defaultValue={settings.longitude}
                />
              </div>
            </div>
          </div>
        </form>
      </AdminCard>

      <AdminCard
        title="Jeda Iqamah"
        description="Jeda waktu iqamah setelah adzan (dalam menit)"
      >
        <div className="space-y-4">
          {[
            { name: "fajrOffset", label: "Subuh", value: settings.fajrOffset },
            {
              name: "dhuhrOffset",
              label: "Dzuhur",
              value: settings.dhuhrOffset,
            },
            { name: "asrOffset", label: "Ashar", value: settings.asrOffset },
            {
              name: "maghribOffset",
              label: "Maghrib",
              value: settings.maghribOffset,
            },
            { name: "ishaOffset", label: "Isya", value: settings.ishaOffset },
          ].map((prayer) => (
            <div
              key={prayer.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <Label
                  htmlFor={prayer.name}
                  className="text-sm font-medium cursor-pointer"
                >
                  {prayer.label}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">+</span>
                <Input
                  id={prayer.name}
                  name={prayer.name}
                  type="number"
                  min={1}
                  max={30}
                  form="prayer-settings-form"
                  defaultValue={prayer.value}
                  className="w-16 h-8 text-center text-sm"
                />
                <span className="text-xs text-muted-foreground">menit</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            form="prayer-settings-form"
            disabled={isPending}
            className="w-full"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan Pengaturan
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}
