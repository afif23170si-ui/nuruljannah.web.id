
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
  group: string;
}

export interface NavGroup {
  label: string | null; // null = no label (e.g. Dashboard)
  items: NavItem[];
}

export const navigation: NavItem[] = [
  // --- Core ---
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "BENDAHARA", "TAKMIR", "PENGELOLA_TPA"],
    group: "core",
  },
  // --- Ibadah & Kegiatan ---
  {
    name: "Ibadah",
    href: "/admin/ibadah",
    icon: Moon,
    roles: ["ADMIN", "TAKMIR"],
    group: "ibadah",
  },
  {
    name: "Ramadhan",
    href: "/admin/ramadhan",
    icon: Sparkles,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
    group: "ibadah",
  },
  {
    name: "Agenda Masjid",
    href: "/admin/kajian",
    icon: Calendar,
    roles: ["ADMIN", "TAKMIR"],
    group: "ibadah",
  },
  {
    name: "Program",
    href: "/admin/program",
    icon: BookOpen,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
    group: "ibadah",
  },
  {
    name: "TPA / TPQ",
    href: "/admin/tpa",
    icon: GraduationCap,
    roles: ["ADMIN", "PENGELOLA_TPA"],
    group: "ibadah",
  },
  {
    name: "Layanan Jamaah",
    href: "/admin/layanan",
    icon: HeadphonesIcon,
    roles: ["ADMIN", "TAKMIR"],
    disabled: true,
    badge: "Segera",
    group: "ibadah",
  },
  // --- Keuangan & Donasi ---
  {
    name: "Master Dana",
    href: "/admin/funds",
    icon: Wallet,
    roles: ["ADMIN", "BENDAHARA"],
    group: "keuangan",
  },
  {
    name: "Keuangan",
    href: "/admin/keuangan",
    icon: Wallet,
    roles: ["ADMIN", "BENDAHARA"],
    group: "keuangan",
  },
  {
    name: "Donasi Masuk",
    href: "/admin/donasi",
    icon: Heart,
    roles: ["ADMIN", "BENDAHARA"],
    group: "keuangan",
  },
  {
    name: "Qurban",
    href: "/admin/qurban",
    icon: Beef,
    roles: ["ADMIN", "BENDAHARA"],
    disabled: true,
    badge: "Segera",
    group: "keuangan",
  },
  // --- Konten & Media ---
  {
    name: "Artikel & Berita",
    href: "/admin/artikel",
    icon: FileText,
    roles: ["ADMIN", "TAKMIR"],
    group: "konten",
  },
  {
    name: "Pengumuman",
    href: "/admin/pengumuman",
    icon: Megaphone,
    roles: ["ADMIN", "TAKMIR"],
    group: "konten",
  },
  {
    name: "Galeri",
    href: "/admin/gallery",
    icon: Images,
    roles: ["ADMIN", "TAKMIR"],
    group: "konten",
  },
  // --- Organisasi & Sistem ---
  {
    name: "Struktur DKM",
    href: "/admin/dkm",
    icon: UsersRound,
    roles: ["ADMIN", "TAKMIR"],
    group: "sistem",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
    group: "sistem",
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"],
    group: "sistem",
  },
];

// Group labels mapping
const groupLabels: Record<string, string | null> = {
  core: null,
  ibadah: "Ibadah & Kegiatan",
  keuangan: "Keuangan & Donasi",
  konten: "Konten & Media",
  sistem: "Organisasi & Sistem",
};

// Group order
const groupOrder = ["core", "ibadah", "keuangan", "konten", "sistem"];

// Helper to get grouped navigation filtered by role
export function getGroupedNavigation(userRole: string): NavGroup[] {
  const filtered = navigation.filter((item) => item.roles.includes(userRole));

  return groupOrder
    .map((groupKey) => ({
      label: groupLabels[groupKey] ?? null,
      items: filtered.filter((item) => item.group === groupKey),
    }))
    .filter((group) => group.items.length > 0);
}
