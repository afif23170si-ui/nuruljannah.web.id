import { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/actions/admin";
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
import { Plus, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Kelola Artikel",
  description: "Kelola artikel dan berita masjid",
};

const CATEGORY_LABELS: Record<string, string> = {
  ARTIKEL: "Artikel",
  BERITA: "Berita",
  PENGUMUMAN: "Pengumuman",
  KAJIAN: "Ringkasan Kajian",
  KHUTBAH: "Ringkasan Khutbah",
};

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PUBLISHED: { label: "Dipublikasikan", variant: "default" },
  DRAFT: { label: "Draft", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function ArticlesAdminPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artikel & Berita</h1>
          <p className="text-muted-foreground">
            Kelola konten artikel, berita, dan pengumuman
          </p>
        </div>
        <Link href="/admin/artikel/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Belum ada artikel.</p>
              <Link href="/admin/artikel/new" className="mt-4 inline-block">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Buat Artikel Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Link
                        href={`/admin/artikel/${article.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CATEGORY_LABELS[article.category] || article.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_LABELS[article.status]?.variant || "secondary"}>
                        {STATUS_LABELS[article.status]?.label || article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {article.author.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(article.createdAt), "d MMM yyyy", { locale: id })}
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
                            <Link href={`/artikel/${article.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/artikel/${article.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
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
