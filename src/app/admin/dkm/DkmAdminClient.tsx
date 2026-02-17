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
} from "lucide-react";
import { toast } from "sonner";

type DkmMember = {
  id: string;
  name: string;
  position: string;
  photo: string | null;
  order: number;
  isActive: boolean;
  period: string | null;
};

export function DkmAdminClient({ members }: { members: DkmMember[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<DkmMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
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
    setShowDialog(true);
  };

  return (
    <AdminCard
      title={`Struktur DKM (${members.length})`}
      description="Kelola susunan pengurus Dewan Kemakmuran Masjid"
    >
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) setEditingMember(null);
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
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    name="position"
                    required
                    defaultValue={editingMember?.position || ""}
                    placeholder="Contoh: Ketua DKM, Sekretaris, dll"
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
                    <Label htmlFor="period">Periode (opsional)</Label>
                    <Input
                      id="period"
                      name="period"
                      defaultValue={editingMember?.period || ""}
                      placeholder="2024-2029"
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

      {/* Members List */}
      {members.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-500">Belum ada data pengurus DKM.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                member.isActive
                  ? "bg-white border-gray-100 hover:border-gray-200"
                  : "bg-gray-50/50 border-gray-100 opacity-60"
              }`}
            >
              {/* Drag Handle */}
              <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0 hidden md:block" />

              {/* Avatar */}
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={member.photo || ""} alt={member.name} />
                <AvatarFallback className="bg-emerald-50 text-emerald-600 text-sm font-bold">
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
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {member.name}
                  </h3>
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
                {member.period && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Periode {member.period}
                  </p>
                )}
              </div>

              {/* Order badge */}
              <span className="text-xs text-gray-300 font-mono hidden md:block">
                #{member.order}
              </span>

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
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-blue-600"
                  onClick={() => openEdit(member)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => handleDelete(member.id, member.name)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}
