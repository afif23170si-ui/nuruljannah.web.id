// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { getKajianList } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Jadwal Kajian",
  description: "Kelola jadwal kajian rutin masjid",
};

const DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const DAY_COLORS: Record<number, string> = {
  0: "bg-red-500/10 text-red-600",
  1: "bg-yellow-500/10 text-yellow-600",
  2: "bg-pink-500/10 text-pink-600",
  3: "bg-green-500/10 text-green-600",
  4: "bg-blue-500/10 text-blue-600",
  5: "bg-emerald-500/10 text-emerald-600",
  6: "bg-purple-500/10 text-purple-600",
};

export default async function KajianAdminPage() {
  const kajianList = await getKajianList();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jadwal Kajian</h1>
          <p className="text-muted-foreground">Kelola jadwal kajian rutin masjid</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kajian
        </Button>
      </div>

      {/* Kajian Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          {kajianList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Belum ada jadwal kajian.</p>
              <Button variant="outline" className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Buat Jadwal Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Pemateri</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kajianList.map((kajian) => (
                  <TableRow key={kajian.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={DAY_COLORS[kajian.dayOfWeek]}
                      >
                        {DAYS[kajian.dayOfWeek]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{kajian.title}</TableCell>
                    <TableCell>{kajian.speaker}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {kajian.time} WIB
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {kajian.location || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={kajian.isActive ? "default" : "outline"}>
                        {kajian.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
