"use client";

import Link from "next/link";
import { 
  Plus, 
  Megaphone, 
  Wallet, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    {
      title: "Artikel Baru",
      href: "/admin/artikel/new",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white"
    },
    {
      title: "Pengumuman",
      href: "/admin/pengumuman", // Assuming creation is handled there or via modal for now
      icon: Megaphone,
      color: "bg-white hover:bg-gray-50 border-gray-200 border", // Secondary style
      textColor: "text-gray-700"
    },
    {
      title: "Keuangan",
      href: "/admin/keuangan",
      icon: Wallet,
      color: "bg-white hover:bg-gray-50 border-gray-200 border",
      textColor: "text-gray-700"
    },
    {
      title: "Absensi TPA",
      href: "/admin/tpa/attendance",
      icon: GraduationCap,
      color: "bg-white hover:bg-gray-50 border-gray-200 border",
      textColor: "text-gray-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {actions.map((action) => (
        <Link key={action.title} href={action.href} className="flex-1">
          <Button 
            className={`w-full h-auto py-4 flex flex-col items-center justify-center gap-2 shadow-sm ${action.color} ${action.textColor}`}
            variant="ghost" // Using ghost base to override styles easier or remove default shadcn valid styles conflicting
          >
            <div className={`p-2 rounded-lg ${action.textColor === 'text-white' ? 'bg-white/20' : 'bg-gray-100'}`}>
               <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{action.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}
