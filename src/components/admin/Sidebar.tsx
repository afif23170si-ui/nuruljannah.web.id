"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Wallet,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Bell,
  Search,
  Images,
  Megaphone,
} from "lucide-react";
import { useState, useEffect } from "react";

// Navigation Data
const navigation = [
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

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  logoUrl?: string | null;
}

export function AdminSidebar({ collapsed, setCollapsed, logoUrl }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [hovered, setHovered] = useState(false);
  const userRole = session?.user?.role || "JAMAAH";

  // Filter navigation based on role
  const filteredNav = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  // Logic: 
  // If NOT collapsed -> Width 280px (w-[280px])
  // If collapsed AND hovered -> Width 280px (w-[280px]) but overlaying (shadow)
  // If collapsed AND NOT hovered -> Width 80px (w-[80px])

  const isExpanded = !collapsed || (collapsed && hovered);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        isExpanded ? "w-[280px]" : "w-[80px]",
        (collapsed && hovered) && "shadow-2xl"
      )}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header / Logo */}
      <div className={cn(
        "flex h-[70px] items-center px-6 border-b border-gray-100 transition-all",
        !isExpanded && "justify-center px-0"
      )}>
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden relative",
            !logoUrl ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "bg-transparent"
          )}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">M</span>
            )}
          </div>
          <div className={cn(
             "flex flex-col transition-opacity duration-200",
             !isExpanded ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            <span className="font-bold text-gray-900 leading-tight">Nurul Jannah</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
        <div className="space-y-1">
          {filteredNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <div key={item.name} className="relative group/item">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-semibold transition-all duration-200 mb-1 whitespace-nowrap overflow-hidden",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover/item:text-blue-600"
                  )} />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isExpanded ? "opacity-0 w-0" : "opacity-100"
                  )}>{item.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Floating Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setCollapsed(!collapsed);
          setHovered(false);
        }}
        className={cn(
          "absolute -right-3 top-6 z-50 h-6 w-6 rounded-md border border-dashed border-gray-300 bg-white text-gray-400 shadow-sm hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-all",
          collapsed && "rotate-180"
        )}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
         {isExpanded && (
            <div className="text-xs text-center text-gray-400">
               v2.0.0 &copy; 2026
            </div>
         )}
      </div>
    </aside>
  );
}

interface HeaderProps {
   collapsed: boolean;
   setCollapsed: (v: boolean) => void;
}

export function AdminHeader({ collapsed, setCollapsed }: HeaderProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={cn(
       "sticky top-0 z-40 flex h-[70px] items-center justify-between border-b border-gray-200 bg-white px-8 transition-all duration-300",
       // Note: Header width/margin is handled by the layout wrapper, so we just set height/style here.
    )}>
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <Button 
           variant="ghost" 
           size="icon" 
           className="lg:hidden text-gray-500 hover:bg-gray-100"
           onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex items-center gap-2 text-gray-400">
           <Search className="h-4 w-4" />
           <span className="text-sm">Search (Ctrl + K)</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        {/* User Profile */}
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-2 pr-1 gap-3 rounded-lg hover:bg-gray-50 h-auto py-1">
                <div className="text-right hidden md:block">
                   <div className="text-sm font-bold text-gray-800">{session?.user?.name}</div>
                   <div className="text-xs text-gray-500 font-medium">{session?.user?.role}</div>
                </div>
                <Avatar className="h-9 w-9 border border-gray-200 rounded-lg">
                  <AvatarImage src={session?.user?.image || ""} className="rounded-lg" />
                  <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-bold">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-gray-100 shadow-lg p-2">
              <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase px-2 py-1.5">My Account</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-lg focus:bg-blue-50 focus:text-blue-600 cursor-pointer px-2 py-2">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 my-1" />
              <DropdownMenuItem 
                 className="rounded-lg focus:bg-red-50 text-red-600 focus:text-red-700 cursor-pointer px-2 py-2"
                 onClick={() => signOut({ callbackUrl: "/" })}
              >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="pl-2 pr-1 gap-3 flex items-center h-auto py-1">
            <div className="text-right hidden md:block">
               <div className="text-sm font-bold text-gray-800">{session?.user?.name}</div>
               <div className="text-xs text-gray-500 font-medium">{session?.user?.role}</div>
            </div>
            <Avatar className="h-9 w-9 border border-gray-200 rounded-lg">
              <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-bold">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
