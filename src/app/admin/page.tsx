// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Wallet,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Dashboard admin Masjid Nurul Jannah",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di panel admin Masjid Nurul Jannah
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/artikel/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Artikel Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Artikel
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} dipublikasikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">pengguna terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Santri TPA
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">santri aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Kas
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.balance)}
            </div>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatCurrency(stats.income)}
              </Badge>
              <Badge variant="outline" className="text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                {formatCurrency(stats.expense)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Artikel Terbaru</CardTitle>
            <Link href="/admin/artikel">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada artikel
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/artikel/${post.id}`}
                        className="font-medium text-sm hover:text-primary line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {post.status === "PUBLISHED"
                            ? "Dipublikasikan"
                            : post.status === "DRAFT"
                            ? "Draft"
                            : "Diarsipkan"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.createdAt), "d MMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Finance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaksi Terbaru</CardTitle>
            <Link href="/admin/keuangan">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentFinance.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentFinance.map((finance) => (
                  <div
                    key={finance.id}
                    className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {finance.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {finance.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(finance.date), "d MMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        finance.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {finance.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(Number(finance.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
