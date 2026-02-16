
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Wallet,
  Users,
  GraduationCap,
  Settings,
  Images,
  Megaphone,
  Moon,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "BENDAHARA", "TAKMIR", "PENGELOLA_TPA"],
  },
  {
    name: "Artikel & Berita",
    href: "/admin/artikel",
    icon: FileText,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Pengumuman",
    href: "/admin/pengumuman",
    icon: Megaphone,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Agenda Masjid",
    href: "/admin/kajian",
    icon: Calendar,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Ibadah",
    href: "/admin/ibadah",
    icon: Moon,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Keuangan",
    href: "/admin/keuangan",
    icon: Wallet,
    roles: ["ADMIN", "BENDAHARA"],
  },
  {
    name: "TPA / TPQ",
    href: "/admin/tpa",
    icon: GraduationCap,
    roles: ["ADMIN", "PENGELOLA_TPA"],
  },
  {
    name: "Galeri",
    href: "/admin/gallery",
    icon: Images,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
];
