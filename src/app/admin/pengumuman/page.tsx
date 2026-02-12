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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
  INFO: { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Info },
  WARNING: { badge: "bg-amber-100 text-amber-800 border-amber-200", icon: AlertTriangle },
  URGENT: { badge: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengumuman</h1>
          <p className="text-muted-foreground">
            Kelola pengumuman yang tampil di banner website
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}
              </DialogTitle>
            </DialogHeader>
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={saving || !message.trim()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Daftar Pengumuman
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada pengumuman</p>
              <p className="text-xs mt-1">Klik &quot;Tambah Pengumuman&quot; untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => {
                const style = typeStyles[announcement.type];
                const Icon = style.icon;
                return (
                  <div
                    key={announcement.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      announcement.isActive
                        ? "bg-background"
                        : "bg-muted/50 opacity-60"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${style.badge}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-relaxed">
                        {announcement.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className={`text-xs ${style.badge}`}>
                          {typeLabels[announcement.type]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Prioritas: {announcement.priority}
                        </Badge>
                        {announcement.isActive ? (
                          <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Nonaktif
                          </Badge>
                        )}
                        {announcement.startDate && (
                          <span className="text-xs text-muted-foreground">
                            Mulai:{" "}
                            {format(new Date(announcement.startDate), "d MMM yyyy", {
                              locale: localeId,
                            })}
                          </span>
                        )}
                        {announcement.endDate && (
                          <span className="text-xs text-muted-foreground">
                            Sampai:{" "}
                            {format(new Date(announcement.endDate), "d MMM yyyy", {
                              locale: localeId,
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggle(announcement.id)}
                        title={announcement.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {announcement.isActive ? (
                          <ToggleRight className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
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
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
        </CardContent>
      </Card>
    </div>
  );
}
