// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getTpaStats } from "@/actions/tpa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  Plus,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administrasi TPA",
  description: "Dashboard pengelolaan TPA Masjid Nurul Jannah",
};

export default async function TpaDashboardPage() {
  const stats = await getTpaStats();

  const menuItems = [
    {
      title: "Data Santri",
      description: "Kelola data santri, pendaftaran, dan kelas",
      icon: GraduationCap,
      href: "/admin/tpa/students",
      count: stats.students,
      label: "Total Santri",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Data Asatidz",
      description: "Kelola data pengajar dan penugasan",
      icon: Users,
      href: "/admin/tpa/teachers",
      count: stats.teachers,
      label: "Total Pengajar",
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      title: "Kelas & Jadwal",
      description: "Atur pembagian kelas dan jadwal pelajaran",
      icon: BookOpen,
      href: "/admin/tpa/classes",
      count: stats.classes,
      label: "Kelas Aktif",
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Absensi",
      description: "Catat kehadiran santri harian",
      icon: CalendarCheck,
      href: "/admin/tpa/attendance",
      count: null,
      label: "Input Kehadiran",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard TPA</h1>
        <p className="text-muted-foreground">
          Pusat pengelolaan Taman Pendidikan Al-Quran
        </p>
      </div>

      {/* Stats & Quick Access Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Card key={item.title} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              {item.count !== null ? (
                <div className="text-2xl font-bold">{item.count}</div>
              ) : (
                <div className="text-2xl font-bold">-</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {item.label}
              </p>
            </CardContent>
            <div className={`absolute bottom-0 left-0 w-full h-1 ${item.bg.replace("bg-", "bg-opacity-100 ")}`} />
          </Card>
        ))}
      </div>

      {/* Feature Menu */}
      <div className="grid gap-6 md:grid-cols-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Akses Menu <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
