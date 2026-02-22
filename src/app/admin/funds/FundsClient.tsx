"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit2, Shield, AlertCircle, Trash2 } from "lucide-react";
import { createFund, updateFund, deleteFund } from "@/actions/ziswaf/funds";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ResponsiveDataList } from "@/components/admin/shared/ResponsiveDataList";

const fundSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  type: z.enum(["OPERASIONAL", "SOSIAL", "ZAKAT", "WAKAF", "QURBAN", "PEMBANGUNAN", "LAINNYA"]),
  isRestricted: z.boolean(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type FundFormValues = z.infer<typeof fundSchema>;

type Fund = {
  id: string;
  name: string;
  type: string;
  isRestricted: boolean;
  description: string | null;
  isActive: boolean;
};

export function FundsClient({ initialFunds }: { initialFunds: Fund[] }) {
  const [funds, setFunds] = useState<Fund[]>(initialFunds);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FundFormValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      name: "",
      type: "SOSIAL",
      isRestricted: true,
      description: "",
      isActive: true,
    },
  });

  const handleOpenNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      type: "SOSIAL",
      isRestricted: true,
      description: "",
      isActive: true,
    });
    setIsOpen(true);
  };

  const handleEdit = (fund: Fund) => {
    setEditingId(fund.id);
    form.reset({
      name: fund.name,
      type: fund.type as any,
      isRestricted: fund.isRestricted,
      description: fund.description || "",
      isActive: fund.isActive,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FundFormValues) => {
    setIsLoading(true);
    try {
      if (editingId) {
        const updated = await updateFund(editingId, data);
        setFunds(funds.map((f) => (f.id === editingId ? { ...updated, description: updated.description || "" } : f)));
        toast.success("Kantong Dana diperbarui");
      } else {
        const created = await createFund(data);
        setFunds([...funds, { ...created, description: created.description || "" }]);
        toast.success("Kantong Dana berhasil dibuat");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fund: Fund) => {
    if (!confirm(`Yakin hapus Kantong Dana "${fund.name}"?\n\nJika dana ini memiliki transaksi, kamu harus nonaktifkan (bukan hapus).`)) return;
    try {
      await deleteFund(fund.id);
      setFunds(funds.filter((f) => f.id !== fund.id));
      toast.success(`"${fund.name}" berhasil dihapus`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus dana");
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      <AdminPageHeader
        title="Master Kantong Dana"
        description="Kelola kategori penempatan dana (Fund Accounting) untuk ZISWAF"
        action={
          <Button onClick={handleOpenNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Dana
          </Button>
        }
      />

      <div className="mt-6">
        <ResponsiveDataList
          data={funds}
          keyExtractor={(f) => f.id}
          renderMobileItem={(f) => (
            <div className="bg-white border text-sm border-gray-100 p-4 rounded-xl flex justify-between items-start shadow-sm">
               <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                    {f.name}
                    {!f.isActive && <Badge variant="secondary" className="text-[10px] h-5 px-1 py-0">Nonaktif</Badge>}
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                     <Badge variant="outline" className="font-medium text-[10px]">{f.type}</Badge>
                     {f.isRestricted && (
                        <span className="text-amber-600 flex items-center gap-1 font-medium"><Shield className="w-3 h-3"/> Terikat</span>
                     )}
                  </div>
                  {f.description && <div className="text-xs text-gray-500 mt-2">{f.description}</div>}
               </div>
               <div className="flex items-center gap-1">
               <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(f)}
                  className="text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(f)}
                  className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
               </div>
            </div>
          )}
          columns={[
            {
              header: "Nama Kantong Dana",
              cell: (f: any) => (
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {f.name}
                    {!f.isActive && <Badge variant="secondary" className="text-xs">Nonaktif</Badge>}
                  </div>
                  {f.description && <div className="text-xs text-gray-500 mt-1">{f.description}</div>}
                </div>
              ),
              className: "w-full md:w-auto",
            },
            {
              header: "Jenis",
              cell: (f: any) => (
                <Badge variant="outline" className="bg-gray-50">
                  {f.type}
                </Badge>
              ),
              className: "hidden md:table-cell",
            },
            {
              header: "Restriksi",
              cell: (f: any) => (
                f.isRestricted ? (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    <Shield className="w-3 h-3 mr-1" /> Terikat
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    Bebas
                  </Badge>
                )
              ),
              className: "hidden md:table-cell",
            },
            {
              header: "Aksi",
              cell: (f: any) => (
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(f)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(f)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>
              ),
              className: "text-right",
            },
          ]}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Kantong Dana" : "Tambah Kantong Dana Baru"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kantong Dana</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Dana Anak Yatim" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori/Jenis</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OPERASIONAL">Operasional</SelectItem>
                          <SelectItem value="SOSIAL">Sosial</SelectItem>
                          <SelectItem value="ZAKAT">Zakat</SelectItem>
                          <SelectItem value="WAKAF">Wakaf</SelectItem>
                          <SelectItem value="QURBAN">Qurban</SelectItem>
                          <SelectItem value="PEMBANGUNAN">Pembangunan</SelectItem>
                          <SelectItem value="LAINNYA">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-5">
                      <div className="space-y-0.5">
                        <FormLabel>Status Aktif</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="isRestricted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="flex items-center gap-1.5 font-semibold text-gray-900">
                        <Shield className="w-4 h-4 text-amber-500" />
                        Dana Terikat (Restricted)
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-600">
                        Aktifkan jika dana ini diamanahkan untuk tujuan spesifik dan tidak boleh digunakan untuk operasional umum masjid.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Penjelasan mengenai peruntukan dana ini..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Menyimpan..." : "Simpan Kantong Dana"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
