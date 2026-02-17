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
  CalendarDays,
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
  upsertOfficerSchedule,
  deleteOfficerSchedule,
} from "@/actions/ibadah";
import type { OfficerRole, PrayerTime } from "@prisma/client";

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
  muadzin: string | null;
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

type ScheduleItem = {
  id: string;
  dayOfWeek: number;
  prayer: PrayerTime;
  role: OfficerRole;
  officerId: string;
  notes: string | null;
  officer: { id: string; name: string; role: OfficerRole };
};

interface IbadahAdminClientProps {
  officers: Officer[];
  khutbahList: KhutbahItem[];
  prayerSettings: PrayerSettings;
  weeklySchedule: ScheduleItem[];
}

const ROLE_LABELS: Record<string, string> = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
};

const ROLE_COLORS: Record<string, string> = {
  IMAM: "bg-emerald-50 text-emerald-700 border-none",
  MUADZIN: "bg-blue-50 text-blue-700 border-none",
};

const DAY_NAMES = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const PRAYER_NAMES: Record<string, string> = {
  FAJR: "Subuh",
  DHUHR: "Dzuhur",
  ASR: "Ashar",
  MAGHRIB: "Maghrib",
  ISHA: "Isya",
};

const PRAYER_ORDER: PrayerTime[] = ["FAJR", "DHUHR", "ASR", "MAGHRIB", "ISHA"] as PrayerTime[];

export function IbadahAdminClient({
  officers,
  khutbahList,
  prayerSettings,
  weeklySchedule,
}: IbadahAdminClientProps) {
  return (
    <Tabs defaultValue="schedule" className="space-y-6">
      <TabsList className="bg-gray-100/80 p-1">
        <TabsTrigger value="schedule" className="gap-1.5 text-xs sm:text-sm">
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Jadwal</span>
        </TabsTrigger>
        <TabsTrigger value="officers" className="gap-1.5 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Petugas</span>
        </TabsTrigger>
        <TabsTrigger value="khutbah" className="gap-1.5 text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Jumat</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Pengaturan</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="schedule">
        <ScheduleTab
          weeklySchedule={weeklySchedule}
          officers={officers.filter((o) => o.isActive)}
        />
      </TabsContent>

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
// SCHEDULE TAB
// ============================

function ScheduleTab({
  weeklySchedule,
  officers,
}: {
  weeklySchedule: ScheduleItem[];
  officers: Officer[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editSlot, setEditSlot] = useState<{
    dayOfWeek: number;
    prayer: PrayerTime;
    role: OfficerRole;
    currentOfficerId?: string;
    scheduleId?: string;
  } | null>(null);

  // Build a lookup map: dayOfWeek-prayer-role -> schedule item
  const scheduleMap = new Map<string, ScheduleItem>();
  weeklySchedule.forEach((s) => {
    scheduleMap.set(`${s.dayOfWeek}-${s.prayer}-${s.role}`, s);
  });

  const getScheduleFor = (day: number, prayer: PrayerTime, role: OfficerRole) => {
    return scheduleMap.get(`${day}-${prayer}-${role}`);
  };

  const imams = officers.filter((o) => o.role === "IMAM");
  const muadzins = officers.filter((o) => o.role === "MUADZIN");

  const handleAssign = (officerId: string) => {
    if (!editSlot || !officerId) return;

    startTransition(async () => {
      try {
        await upsertOfficerSchedule({
          dayOfWeek: editSlot.dayOfWeek,
          prayer: editSlot.prayer,
          role: editSlot.role,
          officerId,
        });
        toast.success("Jadwal berhasil disimpan");
        setEditSlot(null);
      } catch {
        toast.error("Gagal menyimpan jadwal");
      }
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      try {
        await deleteOfficerSchedule(id);
        toast.success("Jadwal berhasil dihapus");
        setEditSlot(null);
      } catch {
        toast.error("Gagal menghapus jadwal");
      }
    });
  };

  return (
    <AdminCard
      title="Jadwal Petugas Mingguan"
      description="Atur imam dan muadzin untuk setiap waktu shalat per hari"
    >
      <Dialog open={!!editSlot} onOpenChange={(open) => !open && setEditSlot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editSlot && `${DAY_NAMES[editSlot.dayOfWeek]} — ${PRAYER_NAMES[editSlot.prayer]}`}
            </DialogTitle>
            <DialogDescription>
              Pilih {editSlot?.role === "IMAM" ? "imam" : "muadzin"} untuk slot ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {(editSlot?.role === "IMAM" ? imams : muadzins).map((officer) => (
              <button
                key={officer.id}
                onClick={() => handleAssign(officer.id)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${officer.id === editSlot?.currentOfficerId
                    ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200"
                    : "hover:bg-gray-50 border-gray-100"
                  }
                `}
              >
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold
                  ${editSlot?.role === "IMAM" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {officer.name.charAt(0)}
                </div>
                <span className="font-medium text-sm">{officer.name}</span>
                {officer.id === editSlot?.currentOfficerId && (
                  <Badge className="ml-auto bg-emerald-600 text-white text-[10px]">Saat ini</Badge>
                )}
              </button>
            ))}

            {(editSlot?.role === "IMAM" ? imams : muadzins).length === 0 && (
              <p className="text-center text-sm text-gray-500 py-4">
                Belum ada {editSlot?.role === "IMAM" ? "imam" : "muadzin"} aktif. Tambahkan di tab Petugas.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            {editSlot?.scheduleId && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(editSlot.scheduleId!)}
                disabled={isPending}
              >
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Hapus
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditSlot(null)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop view: Full table */}
      <div className="hidden md:block overflow-x-auto -mx-6 px-6">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b bg-gray-50/80">
              <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2.5 w-[88px]">
                Hari
              </th>
              {PRAYER_ORDER.map((prayer) => (
                <th
                  key={prayer}
                  className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1.5 py-2.5"
                >
                  {PRAYER_NAMES[prayer]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <tr key={day} className="hover:bg-gray-50/50">
                <td className="font-bold text-sm text-gray-900 px-3 py-2">
                  {DAY_NAMES[day]}
                </td>
                {PRAYER_ORDER.map((prayer) => {
                  const imam = getScheduleFor(day, prayer, "IMAM" as OfficerRole);
                  const muadzin = getScheduleFor(day, prayer, "MUADZIN" as OfficerRole);
                  return (
                    <td key={prayer} className="px-1 py-1.5">
                      <div className="space-y-1">
                        {/* Imam slot */}
                        <button
                          onClick={() =>
                            setEditSlot({
                              dayOfWeek: day,
                              prayer,
                              role: "IMAM" as OfficerRole,
                              currentOfficerId: imam?.officerId,
                              scheduleId: imam?.id,
                            })
                          }
                          className="w-full text-left px-2 py-1 rounded-md border border-dashed text-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 min-h-[36px]"
                        >
                          <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none mb-0.5">Imam</span>
                          <span className={`block truncate text-[11px] leading-tight ${imam ? "text-emerald-700 font-semibold" : "text-gray-300"}`}>
                            {imam ? imam.officer.name : "—"}
                          </span>
                        </button>
                        {/* Muadzin slot */}
                        <button
                          onClick={() =>
                            setEditSlot({
                              dayOfWeek: day,
                              prayer,
                              role: "MUADZIN" as OfficerRole,
                              currentOfficerId: muadzin?.officerId,
                              scheduleId: muadzin?.id,
                            })
                          }
                          className="w-full text-left px-2 py-1 rounded-md border border-dashed text-xs transition-all hover:bg-blue-50 hover:border-blue-300 min-h-[36px]"
                        >
                          <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none mb-0.5">Muadzin</span>
                          <span className={`block truncate text-[11px] leading-tight ${muadzin ? "text-blue-700 font-semibold" : "text-gray-300"}`}>
                            {muadzin ? muadzin.officer.name : "—"}
                          </span>
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Card per day */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div key={day} className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900">{DAY_NAMES[day]}</h4>
            </div>
            <div className="divide-y divide-gray-50">
              {PRAYER_ORDER.map((prayer) => {
                const imam = getScheduleFor(day, prayer, "IMAM" as OfficerRole);
                const muadzin = getScheduleFor(day, prayer, "MUADZIN" as OfficerRole);
                return (
                  <div key={prayer} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-16 shrink-0">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {PRAYER_NAMES[prayer]}
                      </span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() =>
                          setEditSlot({
                            dayOfWeek: day,
                            prayer,
                            role: "IMAM" as OfficerRole,
                            currentOfficerId: imam?.officerId,
                            scheduleId: imam?.id,
                          })
                        }
                        className="flex-1 text-left px-2 py-1.5 rounded-lg border border-dashed text-xs transition-all active:scale-95"
                      >
                        <span className="text-[9px] font-bold text-emerald-600 uppercase block">Imam</span>
                        <span className={imam ? "text-gray-900 font-medium" : "text-gray-300"}>
                          {imam ? imam.officer.name : "—"}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setEditSlot({
                            dayOfWeek: day,
                            prayer,
                            role: "MUADZIN" as OfficerRole,
                            currentOfficerId: muadzin?.officerId,
                            scheduleId: muadzin?.id,
                          })
                        }
                        className="flex-1 text-left px-2 py-1.5 rounded-lg border border-dashed text-xs transition-all active:scale-95"
                      >
                        <span className="text-[9px] font-bold text-blue-600 uppercase block">Muadzin</span>
                        <span className={muadzin ? "text-gray-900 font-medium" : "text-gray-300"}>
                          {muadzin ? muadzin.officer.name : "—"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
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
      description="Daftar imam dan muadzin masjid"
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
                    : "Tambahkan imam atau muadzin baru"}
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
      muadzin: (formData.get("muadzin") as string) || undefined,
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
                  <Label htmlFor="muadzin">Bilal / Muadzin</Label>
                  <Input
                    id="muadzin"
                    name="muadzin"
                    defaultValue={editingKhutbah?.muadzin || ""}
                    placeholder="Nama bilal/muadzin Jumat"
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
              <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4 hidden md:table-cell">
                Bilal
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
                <TableCell className="py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-700">
                    {k.muadzin || "-"}
                  </span>
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
