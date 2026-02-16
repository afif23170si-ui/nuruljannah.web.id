// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { getTpaStats } from "@/actions/tpa";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administrasi TPA - Metronic Admin",
  description: "Dashboard pengelolaan TPA Masjid Nurul Jannah",
};

export default async function TpaDashboardPage() {
  const stats = await getTpaStats();

  const menuItems = [
    {
      title: "Data Santri",
      description: "Kelola data santri, pendaftaran, dan data kelas",
      icon: GraduationCap,
      href: "/admin/tpa/students",
      count: stats.students,
      label: "Total Santri",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Data Asatidz",
      description: "Kelola data pengajar dan penugasan",
      icon: Users,
      href: "/admin/tpa/teachers",
      count: stats.teachers,
      label: "Total Pengajar",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Kelas & Jadwal",
      description: "Atur pembagian kelas dan jadwal pelajaran",
      icon: BookOpen,
      href: "/admin/tpa/classes",
      count: stats.classes,
      label: "Kelas Aktif",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Absensi",
      description: "Catat kehadiran santri harian",
      icon: CalendarCheck,
      href: "/admin/tpa/attendance",
      count: null,
      label: "Input Kehadiran",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Dashboard TPA" 
        description="Pusat pengelolaan Taman Pendidikan Al-Quran"
      />

      {/* Stats & Quick Access Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {menuItems.map((item) => (
          <div key={item.title} className="metron-card p-6 flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
             <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <item.icon className="h-24 w-24 -mr-8 -mt-8" />
             </div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                   <div className={`h-12 w-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-6 w-6" />
                   </div>
                </div>
                
                {item.count !== null ? (
                   <div className="text-3xl font-bold text-gray-900 mb-1">{item.count}</div>
                ) : (
                   <div className="text-3xl font-bold text-gray-900 mb-1">-</div>
                )}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                   {item.label}
                </p>
             </div>
          </div>
        ))}
      </div>

      {/* Feature Menu */}
      <div className="grid gap-6 md:grid-cols-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <AdminCard className="h-full hover:border-blue-300 transition-colors group cursor-pointer">
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-xl ${item.bg} shrink-0`}>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm font-bold text-blue-600">
                      Akses Menu <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
