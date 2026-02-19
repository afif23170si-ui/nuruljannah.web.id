
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Wallet,
  Users,
  UsersRound,
  GraduationCap,
  Settings,
  Images,
  Megaphone,
  Moon,
  Sparkles,
  BookOpen,
  HeadphonesIcon,
  Beef,
  Heart,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  disabled?: boolean;
  badge?: string;
}

export const navigation: NavItem[] = [
  // --- Core ---
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "BENDAHARA", "TAKMIR", "PENGELOLA_TPA"],
  },
  // --- Ibadah & Keagamaan ---
  {
    name: "Ibadah",
    href: "/admin/ibadah",
    icon: Moon,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Ramadhan",
    href: "/admin/ramadhan",
    icon: Sparkles,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
  },
  // --- Kegiatan & Program ---
  {
    name: "Agenda Masjid",
    href: "/admin/kajian",
    icon: Calendar,
    roles: ["ADMIN", "TAKMIR"],
  },
  {
    name: "Program",
    href: "/admin/program",
    icon: BookOpen,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
  },
  {
    name: "TPA / TPQ",
    href: "/admin/tpa",
    icon: GraduationCap,
    roles: ["ADMIN", "PENGELOLA_TPA"],
  },
  // --- Layanan ---
  {
    name: "Layanan Jamaah",
    href: "/admin/layanan",
    icon: HeadphonesIcon,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
  },
  // --- Keuangan & Donasi ---
  {
    name: "Keuangan",
    href: "/admin/keuangan",
    icon: Wallet,
    roles: ["ADMIN", "BENDAHARA"],
  },
  {
    name: "Kampanye Donasi",
    href: "/admin/kampanye",
    icon: Heart,
    roles: ["ADMIN", "BENDAHARA"],
    disabled: true,
    badge: "Segera",
  },
  {
    name: "Qurban",
    href: "/admin/qurban",
    icon: Beef,
    roles: ["ADMIN", "BENDAHARA"],
    disabled: true,
    badge: "Segera",
  },
  // --- Informasi & Media ---
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
    name: "Galeri",
    href: "/admin/gallery",
    icon: Images,
    roles: ["ADMIN", "TAKMIR"],
  },
  // --- Organisasi ---
  {
    name: "Struktur DKM",
    href: "/admin/dkm",
    icon: UsersRound,
    roles: ["ADMIN", "TAKMIR"],
  },
  // --- System ---
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
