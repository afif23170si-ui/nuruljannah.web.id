// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';
  
import Link from "next/link";
import { getUsers, deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users, ShieldCheck, UserCheck, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ResponsiveDataList } from "@/components/admin/shared/ResponsiveDataList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4 mb-8">
        <div className="metron-card p-4 md:p-6 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{users.length}</span>
                <div className="bg-blue-50 text-blue-600 h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Total Users</span>
        </div>

        <div className="metron-card p-4 md:p-6 flex flex-col justify-between hover:border-red-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{adminCount}</span>
                <div className="bg-red-50 text-red-600 h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Administrator</span>
        </div>

        <div className="metron-card p-4 md:p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{staffCount}</span>
                <div className="bg-emerald-50 text-emerald-600 h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Pengurus</span>
        </div>

        <div className="metron-card p-4 md:p-6 flex flex-col justify-between hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{jamaahCount}</span>
                <div className="bg-gray-100 text-gray-600 h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Jamaah</span>
        </div>
        </div>

        {/* Users Table */}
        <AdminCard title={`Daftar Pengguna (${users.length})`}>
            <ResponsiveDataList 
                data={users}
                keyExtractor={(user) => user.id}
                columns={[
                    {
                        header: "Nama & Email",
                        cell: (user) => (
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-gray-100">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className={`text-white font-bold ${
                                        user.role === 'ADMIN' ? 'bg-red-500' : 
                                        user.role === 'JAMAAH' ? 'bg-gray-400' : 'bg-emerald-500'
                                    }`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-900">{user.name}</span>
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: "Role",
                        cell: (user) => (
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
                        )
                    },
                    {
                        header: "Aktivitas",
                        cell: (user) => (
                            <div className="flex flex-col gap-1 text-xs font-medium text-gray-500">
                                {user._count.posts > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{user._count.posts} Artikel</span>}
                                {user._count.finances > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{user._count.finances} Transaksi</span>}
                                {user._count.posts === 0 && user._count.finances === 0 && <span className="opacity-50">-</span>}
                            </div>
                        )
                    },
                    {
                        header: "Terdaftar",
                        cell: (user) => format(new Date(user.createdAt), "dd MMM yyyy", { locale: id })
                    },
                    {
                        header: "Aksi",
                        cell: (user) => (
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
                        ),
                        className: "text-right"
                    }
                ]}
                renderMobileItem={(user) => (
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                         <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-gray-100">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className={`text-white font-bold ${
                                        user.role === 'ADMIN' ? 'bg-red-500' : 
                                        user.role === 'JAMAAH' ? 'bg-gray-400' : 'bg-emerald-500'
                                    }`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                             </div>
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
                         </div>
                         
                         <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                             <div className="text-xs text-gray-500">
                                 Terdaftar: {format(new Date(user.createdAt), "dd MMM yyyy", { locale: id })}
                             </div>
                             <div className="flex items-center">
                                <Link href={`/admin/users/${user.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:bg-blue-50">
                                        Edit
                                    </Button>
                                </Link>
                             </div>
                         </div>
                    </div>
                )}
            />
        </AdminCard>
    </div>
    );
}
