// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getStudents, deleteStudent } from "@/actions/tpa";
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
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Data Santri",
  description: "Manajemen data santri TPA",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Santri</h1>
          <p className="text-muted-foreground">
            Daftar santri TPA Masjid Nurul Jannah
          </p>
        </div>
        <Link href="/admin/tpa/students/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Daftar Santri Baru
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Orang Tua</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Belum ada data santri.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    {student.class?.name ? (
                      <Badge variant="outline">{student.class.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Belum masuk kelas</span>
                    )}
                  </TableCell>
                  <TableCell>{student.parentName || "-"}</TableCell>
                  <TableCell>{student.parentPhone || "-"}</TableCell>
                  <TableCell>
                    {student.status === "ACTIVE" ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">Aktif</Badge>
                    ) : student.status === "GRADUATED" ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Lulus</Badge>
                    ) : (
                      <Badge variant="destructive">Non-Aktif</Badge>
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
                          <Link href={`/admin/tpa/students/${student.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <form action={async () => {
                          "use server";
                          await deleteStudent(student.id);
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
