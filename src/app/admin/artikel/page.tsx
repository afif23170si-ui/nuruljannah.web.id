import { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/actions/admin";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
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
import { Plus, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Kelola Artikel - Metronic Admin",
  description: "Kelola artikel dan berita masjid",
};

// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  ARTIKEL: "Artikel",
  BERITA: "Berita",
  PENGUMUMAN: "Pengumuman",
  KAJIAN: "Ringkasan Kajian",
  KHUTBAH: "Ringkasan Khutbah",
};

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PUBLISHED: { label: "Dipublikasikan", variant: "default" },
  DRAFT: { label: "Draft", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function ArticlesAdminPage() {
  const articles = await getArticles();

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Artikel & Berita" 
        description="Kelola konten artikel, berita, dan publikasi masjid"
        action={
          <Link href="/admin/artikel/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Artikel
            </Button>
          </Link>
        }
      />

      <AdminCard title={`Daftar Artikel (${articles.length})`}>
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                 <Plus className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada artikel</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Mulai menulis artikel atau berita untuk dibagikan kepada jamaah.</p>
              <Link href="/admin/artikel/new">
                <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  Buat Artikel Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Judul</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Kategori</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Penulis</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Tanggal</TableHead>
                  <TableHead className="w-[70px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <TableCell className="py-4 font-bold text-gray-800">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/artikel/${article.id}`}
                          className="hover:text-blue-600 line-clamp-1 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="font-semibold text-gray-600 border-gray-200">
                        {CATEGORY_LABELS[article.category] || article.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        className={
                          article.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 hover:bg-green-100 border-none' : 
                          article.status === 'DRAFT' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-none' :
                          'bg-amber-50 text-amber-700 hover:bg-amber-100 border-none'
                        }
                      >
                        {STATUS_LABELS[article.status]?.label || article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                            {article.author.name.charAt(0)}
                         </div>
                         {article.author.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      {format(new Date(article.createdAt), "d MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 border-gray-100 shadow-lg rounded-xl">
                          <DropdownMenuItem asChild className="focus:bg-gray-50 cursor-pointer">
                            <Link href={`/artikel/${article.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4 text-gray-500" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-gray-50 cursor-pointer">
                            <Link href={`/admin/artikel/${article.id}`}>
                              <Edit className="mr-2 h-4 w-4 text-blue-500" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
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
      </AdminCard>
    </div>
  );
}
