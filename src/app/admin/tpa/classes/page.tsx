import { Metadata } from "next";
import Link from "next/link";
import { getClasses, deleteClass } from "@/actions/tpa";
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
import { Plus, MoreHorizontal, Edit, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Data Kelas",
  description: "Manajemen data kelas dan jadwal TPA",
};

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Kelas</h1>
          <p className="text-muted-foreground">
            Daftar kelas dan jadwal pengajaran
          </p>
        </div>
        <Link href="/admin/tpa/classes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kelas
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kelas</TableHead>
              <TableHead>Wali Kelas</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Jumlah Santri</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Belum ada data kelas.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">
                    <div>{cls.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {cls.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cls.teacher?.name || <span className="text-muted-foreground italic">Belum ditentukan</span>}
                  </TableCell>
                  <TableCell>{cls.schedule || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{cls._count.students} Santri</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {cls.isActive ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Non-Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/tpa/classes/${cls.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <form action={async () => {
                          "use server";
                          await deleteClass(cls.id);
                        }}>
                          <button type="submit" className="w-full">
                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
