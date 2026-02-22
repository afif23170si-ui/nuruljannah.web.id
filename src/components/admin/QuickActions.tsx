"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Megaphone, 
  Wallet, 
  GraduationCap,
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Artikel Baru",
      href: "/admin/artikel/new",
      icon: Plus,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Pengumuman",
      href: "/admin/pengumuman",
      icon: Megaphone,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Keuangan",
      href: "/admin/keuangan/new",
      icon: Wallet,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Absensi TPA",
      href: "/admin/tpa/attendance",
      icon: GraduationCap,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href} className="flex-1">
          <Button 
            className="w-full h-auto py-2.5 md:py-4 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 transition-all rounded-lg md:rounded-xl"
            variant="ghost"
          >
            <div className={`p-1.5 md:p-2.5 rounded-md md:rounded-lg ${action.iconBg} ${action.iconColor}`}>
               <action.icon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] md:text-sm font-bold text-center leading-none md:leading-tight">{action.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}
