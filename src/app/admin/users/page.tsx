// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';
  
import Link from "next/link";
import { getUsers, deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users, ShieldCheck, UserCheck, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
    ADMIN: "Administrator",
    BENDAHARA: "Bendahara",
    TAKMIR: "Takmir",
    PENGELOLA_TPA: "Pengelola TPA",
    JAMAAH: "Jamaah",
    };
    return labels[role] || role;
}

export default async function UsersPage() {
    const users = await getUsers();


    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const staffCount = users.filter((u) => ["BENDAHARA", "TAKMIR", "PENGELOLA_TPA"].includes(u.role)).length;
    const jamaahCount = users.filter((u) => u.role === "JAMAAH").length;


    return (
    <div className="animate-fade-in">
        <AdminPageHeader 
        title="Manajemen User" 
        description="Kelola akun pengguna, hak akses, dan peran sistem"
        action={
            <Link href="/admin/users/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah User
            </Button>
            </Link>
        }
        />

        {/* Stats Cards Metronic Style */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="metron-card p-6 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-3xl font-bold text-gray-900">{users.length}</span>
                <div className="bg-blue-50 text-blue-600 h-10 w-10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5" />
                </div>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Users</span>
        </div>

        <div className="metron-card p-6 flex flex-col justify-between hover:border-red-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-3xl font-bold text-gray-900">{adminCount}</span>
                <div className="bg-red-50 text-red-600 h-10 w-10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                </div>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Administrator</span>
        </div>

        <div className="metron-card p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-3xl font-bold text-gray-900">{staffCount}</span>
                <div className="bg-emerald-50 text-emerald-600 h-10 w-10 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                </div>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Staff & Pengurus</span>
        </div>

        <div className="metron-card p-6 flex flex-col justify-between hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-3xl font-bold text-gray-900">{jamaahCount}</span>
                <div className="bg-gray-100 text-gray-600 h-10 w-10 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5" />
                </div>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Jamaah</span>
        </div>
        </div>

        {/* Users Table */}
        <AdminCard title={`Daftar Pengguna (${users.length})`}>
        {users.length === 0 ? (
            <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada user</h3>
                <p className="text-gray-500 mb-6">Tambahkan user untuk mengelola sistem.</p>
                <Link href="/admin/users/new">
                <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                    Tambah User Pertama
                </Button>
                </Link>
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Nama & Email</TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Role</TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Aktivitas</TableHead>
                <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Terdaftar</TableHead>
                <TableHead className="text-right py-4 w-[100px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                            user.role === 'ADMIN' ? 'bg-red-500' : 
                            user.role === 'JAMAAH' ? 'bg-gray-400' : 'bg-emerald-500'
                        }`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-900">{user.name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="py-4">
                    <Badge 
                        variant="outline" 
                        className={
                            user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-none font-semibold' :
                            user.role === 'JAMAAH' ? 'bg-gray-100 text-gray-600 border-none font-semibold' :
                            'bg-emerald-50 text-emerald-700 border-none font-semibold'
                        }
                    >
                        {getRoleLabel(user.role)}
                    </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-medium text-gray-500">
                    <div className="flex flex-col gap-1">
                        {user._count.posts > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{user._count.posts} Artikel</span>}
                        {user._count.finances > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{user._count.finances} Transaksi</span>}
                        {user._count.posts === 0 && user._count.finances === 0 && <span className="opacity-50">-</span>}
                    </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                    {format(new Date(user.createdAt), "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-1">
                        <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        </Link>
                        <form
                        action={async () => {
                            "use server";
                            await deleteUser(user.id);
                        }}
                        >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            type="submit"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
        </AdminCard>
    </div>
    );
}
