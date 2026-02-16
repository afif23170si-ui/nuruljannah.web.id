"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Plus,
  Trash2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Megaphone,
  Info,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { ResponsiveModal } from "@/components/admin/shared/ResponsiveModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement,
} from "@/actions/announcement";

type AnnouncementType = "INFO" | "WARNING" | "URGENT";

interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
  isActive: boolean;
  priority: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const typeStyles: Record<AnnouncementType, { badge: string; icon: typeof Info }> = {
  INFO: { badge: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: Info },
  WARNING: { badge: "bg-amber-50 text-amber-600 border-amber-100", icon: AlertTriangle },
  URGENT: { badge: "bg-red-50 text-red-600 border-red-100", icon: AlertCircle },
};

const typeLabels: Record<AnnouncementType, string> = {
  INFO: "Informasi",
  WARNING: "Peringatan",
  URGENT: "Penting",
};

export default function AnnouncementAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AnnouncementType>("INFO");
  const [priority, setPriority] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function loadData() {
    setLoading(true);
    const data = await getAnnouncements();
    setAnnouncements(data as Announcement[]);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setMessage("");
    setType("INFO");
    setPriority(0);
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  }

  function openEditDialog(announcement: Announcement) {
    setEditingId(announcement.id);
    setMessage(announcement.message);
    setType(announcement.type);
    setPriority(announcement.priority);
    setStartDate(
      announcement.startDate
        ? new Date(announcement.startDate).toISOString().slice(0, 10)
        : ""
    );
    setEndDate(
      announcement.endDate
        ? new Date(announcement.endDate).toISOString().slice(0, 10)
        : ""
    );
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!message.trim()) return;
    setSaving(true);

    const data = {
      message: message.trim(),
      type,
      priority,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    if (editingId) {
      await updateAnnouncement(editingId, data);
    } else {
      await createAnnouncement(data);
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    loadData();
  }

  async function handleToggle(id: string) {
    await toggleAnnouncement(id);
    loadData();
  }

  async function handleDelete(id: string) {
    await deleteAnnouncement(id);
    loadData();
  }

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Pengumuman" 
        description="Kelola running text dan pengumuman banner website"
        action={
          <ResponsiveModal 
            title={editingId ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}
            open={dialogOpen}
            onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
            }}
            trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Pengumuman
                </Button>
            }
          >
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan Pengumuman</Label>
                  <Input
                    id="message"
                    placeholder="Contoh: Shalat Jumat dipindahkan ke lapangan"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipe</Label>
                    <Select value={type} onValueChange={(v) => setType(v as AnnouncementType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INFO">🟢 Informasi</SelectItem>
                        <SelectItem value="WARNING">🟡 Peringatan</SelectItem>
                        <SelectItem value="URGENT">🔴 Penting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritas</Label>
                    <Input
                      id="priority"
                      type="number"
                      min={0}
                      max={100}
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai (opsional)</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Berakhir (opsional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                    <Button onClick={handleSave} disabled={saving || !message.trim()} className="bg-blue-600 hover:bg-blue-700">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Simpan Perubahan" : "Tambah"}
                    </Button>
                </div>
              </div>
          </ResponsiveModal>
        }
      />

      <AdminCard title={`Daftar Pengumuman (${announcements.length})`}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                 <Megaphone className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada pengumuman</h3>
              <p className="text-gray-500 mb-6">Tambahkan pengumuman penting untuk jamaah website.</p>
              <Button variant="outline" onClick={() => setDialogOpen(true)} className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                Buat Pengumuman
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => {
                const style = typeStyles[announcement.type];
                const Icon = style.icon;
                return (
                  <div
                    key={announcement.id}
                    className={`flex items-start gap-5 p-5 rounded-xl border transition-all duration-200 group ${
                      announcement.isActive
                        ? "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
                        : "bg-gray-50 border-gray-100 opacity-70"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${style.badge}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-semibold text-gray-900 leading-relaxed mb-2">
                        {announcement.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-xs font-semibold border-none ${style.badge}`}>
                          {typeLabels[announcement.type]}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-none font-medium">
                          Prioritas: {announcement.priority}
                        </Badge>
                        {announcement.isActive ? (
                          <Badge className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-semibold">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600 hover:bg-gray-300 border-none">
                            Nonaktif
                          </Badge>
                        )}
                        {(announcement.startDate || announcement.endDate) && (
                          <div className="text-xs text-gray-400 font-medium ml-1 flex items-center gap-1">
                            <span>
                              {announcement.startDate ? format(new Date(announcement.startDate), "d MMM", { locale: localeId }) : "..."}
                            </span>
                            <span>-</span>
                            <span>
                              {announcement.endDate ? format(new Date(announcement.endDate), "d MMM", { locale: localeId }) : "..."}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleToggle(announcement.id)}
                        title={announcement.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {announcement.isActive ? (
                          <ToggleRight className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-t-4 border-t-red-500">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Pengumuman ini akan dihapus permanen dan tidak bisa dikembalikan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(announcement.id)}
                              className="bg-red-600 text-white hover:bg-red-700 border-none"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </AdminCard>
    </div>
  );
}
