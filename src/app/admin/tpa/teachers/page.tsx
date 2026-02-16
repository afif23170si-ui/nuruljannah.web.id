// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getTeachers, deleteTeacher } from "@/actions/tpa";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminCard } from "@/components/admin/shared/AdminCard";

export const metadata: Metadata = {
  title: "Data Asatidz",
  description: "Manajemen data pengajar TPA",
};

export default async function TeachersPage() {
  const teachers = await getTeachers();

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Data Asatidz" 
        description="Daftar pengajar TPA Masjid Nurul Jannah"
        breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "TPA", href: "/admin/tpa" },
            { label: "Asatidz" }
        ]}
        action={
          <Link href="/admin/tpa/teachers/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pengajar
            </Button>
          </Link>
        }
      />

      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Jumlah Kelas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Belum ada data pengajar.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={teacher.photo || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary uppercase">
                        {teacher.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{teacher.phone || "-"}</div>
                    <div className="text-xs text-muted-foreground">{teacher.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{teacher._count.classes} Kelas</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {teacher.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        Non-Aktif
                      </span>
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
                          <Link href={`/admin/tpa/teachers/${teacher.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <form action={async () => {
                          "use server";
                          await deleteTeacher(teacher.id);
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
      </AdminCard>
    </div>
  );
}
