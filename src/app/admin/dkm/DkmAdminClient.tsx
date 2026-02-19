"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { AdminCard } from "@/components/admin/shared/AdminCard";
import {
  createDkmMember,
  updateDkmMember,
  deleteDkmMember,
} from "@/actions/dkm";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  GripVertical,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

type DkmMember = {
  id: string;
  name: string;
  position: string;
  section: string;
  photo: string | null;
  order: number;
  isActive: boolean;
  period: string | null;
};

const SECTION_LABELS: Record<string, string> = {
  PEMBINA: "Pembina",
  PENASEHAT: "Penasehat",
  BPH: "Badan Pengurus Harian (BPH)",
  IMAM: "Imam Masjid",
  GHARIM: "Gharim (Petugas Harian)",
  BIDANG_DAKWAH: "Bidang Dakwah",
  BIDANG_FARDHU_KIFAYAH: "Bidang Fardhu Kifayah",
  BIDANG_PENDIDIKAN: "Bidang Pendidikan",
  BIDANG_PEMBANGUNAN: "Bidang Pembangunan",
  BIDANG_REMAJA: "Bidang Remaja Masjid",
  BIDANG_KEBERSIHAN: "Bidang Kebersihan & Keamanan",
  BIDANG_SARANA: "Bidang Sarana & Prasarana",
  BIDANG_PERWIRITAN: "Bidang Perwiritan Ibu-Ibu",
};

const SECTION_ORDER = Object.keys(SECTION_LABELS);

export function DkmAdminClient({ members }: { members: DkmMember[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<DkmMember | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedSection, setSelectedSection] = useState("BPH");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      section: selectedSection,
      photo: (formData.get("photo") as string) || undefined,
      period: (formData.get("period") as string) || undefined,
      order: parseInt(formData.get("order") as string) || 0,
    };

    startTransition(async () => {
      try {
        if (editingMember) {
          await updateDkmMember(editingMember.id, data);
          toast.success("Pengurus berhasil diperbarui");
        } else {
          await createDkmMember(data);
          toast.success("Pengurus berhasil ditambahkan");
        }
        setShowDialog(false);
        setEditingMember(null);
      } catch {
        toast.error("Gagal menyimpan data pengurus");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;
    startTransition(async () => {
      try {
        await deleteDkmMember(id);
        toast.success("Pengurus berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus pengurus");
      }
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        await updateDkmMember(id, { isActive: !isActive });
        toast.success(
          isActive ? "Pengurus dinonaktifkan" : "Pengurus diaktifkan"
        );
      } catch {
        toast.error("Gagal mengubah status");
      }
    });
  };

  const openEdit = (member: DkmMember) => {
    setEditingMember(member);
    setSelectedSection(member.section);
    setShowDialog(true);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  // Group members by section
  const groupedMembers = SECTION_ORDER.reduce((acc, section) => {
    const sectionMembers = members.filter((m) => m.section === section);
    if (sectionMembers.length > 0) {
      acc.push({ section, label: SECTION_LABELS[section], members: sectionMembers });
    }
    return acc;
  }, [] as { section: string; label: string; members: DkmMember[] }[]);

  return (
    <AdminCard
      title={`Struktur DKM (${members.length} pengurus)`}
      description="Kelola susunan pengurus Dewan Kemakmuran Masjid"
    >
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingMember(null);
              setSelectedSection("BPH");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengurus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingMember
                    ? "Edit Pengurus"
                    : "Tambah Pengurus Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingMember
                    ? "Perbarui informasi pengurus DKM"
                    : "Tambahkan anggota pengurus DKM baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={editingMember?.name || ""}
                    placeholder="Nama lengkap pengurus"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Seksi / Bagian</Label>
                  <Select
                    value={selectedSection}
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih seksi" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SECTION_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    name="position"
                    required
                    defaultValue={editingMember?.position || ""}
                    placeholder="Contoh: Ketua, Koordinator, Anggota"
                  />
                </div>
                <div>
                  <Label htmlFor="photo">URL Foto (opsional)</Label>
                  <Input
                    id="photo"
                    name="photo"
                    defaultValue={editingMember?.photo || ""}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="period">Periode</Label>
                    <Input
                      id="period"
                      name="period"
                      defaultValue={editingMember?.period || "2025-2028"}
                      placeholder="2025-2028"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Urutan</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={editingMember?.order ?? 0}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingMember
                    ? "Simpan Perubahan"
                    : "Tambah Pengurus"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List Grouped by Section */}
      {groupedMembers.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-500">Belum ada data pengurus DKM.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedMembers.map(({ section, label, members: sectionMembers }) => {
            const isCollapsed = collapsedSections.has(section);
            return (
              <div key={section} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-gray-50/80 hover:bg-gray-100/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-gray-700">{label}</h3>
                    <Badge variant="secondary" className="text-[10px] bg-gray-200/80 text-gray-500">
                      {sectionMembers.length}
                    </Badge>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
                </button>

                {/* Section members */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-50">
                    {sectionMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 px-4 py-3 transition-all ${
                          member.isActive
                            ? "bg-white hover:bg-gray-50/50"
                            : "bg-gray-50/30 opacity-60"
                        }`}
                      >
                        {/* Avatar */}
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={member.photo || ""} alt={member.name} />
                          <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xs font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {member.name}
                            </h4>
                            {!member.isActive && (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-gray-400 border-gray-200"
                              >
                                Nonaktif
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{member.position}</p>
                        </div>

                        {/* Active Toggle */}
                        <Switch
                          checked={member.isActive}
                          onCheckedChange={() =>
                            handleToggleActive(member.id, member.isActive)
                          }
                          disabled={isPending}
                          className="flex-shrink-0"
                        />

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-blue-600"
                            onClick={() => openEdit(member)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-600"
                            onClick={() => handleDelete(member.id, member.name)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
