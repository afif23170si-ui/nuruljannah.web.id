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
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";

// Navigation Data
import { getGroupedNavigation } from "@/components/admin/navigation-data";

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

  const groups = getGroupedNavigation(userRole);

  const isExpanded = !collapsed || (collapsed && hovered);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
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
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
        <div className="space-y-3">
          {groups.map((group, gi) => (
            <div key={group.label || "core"}>
              {/* Group label */}
              {group.label && (
                <div className={cn(
                  "mb-1 transition-opacity duration-200",
                  !isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                )}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2.5">
                    {group.label}
                  </span>
                </div>
              )}
              {/* Collapsed: thin divider between groups */}
              {!isExpanded && gi > 0 && (
                <div className="mx-2 mb-1.5 border-t border-gray-100" />
              )}
              {/* Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  if (item.disabled) {
                    return (
                      <div key={item.name} className="relative group/item">
                        <div
                          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap overflow-hidden text-gray-300 cursor-not-allowed"
                          title={!isExpanded ? `${item.name} (${item.badge})` : undefined}
                        >
                          <item.icon className="h-[18px] w-[18px] shrink-0 text-gray-300" />
                          <span className={cn(
                            "transition-opacity duration-200 flex-1",
                            !isExpanded ? "opacity-0 w-0" : "opacity-100"
                          )}>{item.name}</span>
                          {isExpanded && item.badge && (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.name} className="relative group/item">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-all duration-200 whitespace-nowrap overflow-hidden",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        )}
                        title={!isExpanded ? item.name : undefined}
                      >
                        <item.icon className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
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
            </div>
          ))}
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

import { MobileSidebar } from "@/components/admin/shared/MobileSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";

interface HeaderProps {
   collapsed: boolean;
   setCollapsed: (v: boolean) => void;
   logoUrl?: string | null;
}

export function AdminHeader({ collapsed, setCollapsed, logoUrl }: HeaderProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={cn(
       "sticky top-0 z-40 flex h-[70px] items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8 transition-all duration-300",
    )}>
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Sidebar */}
        <div className="lg:hidden">
           <MobileSidebar logoUrl={logoUrl} />
        </div>

        {/* Desktop Command Palette Trigger */}
        <CommandPalette />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Live Website */}
        <Link href="/" target="_blank">
          <Button variant="ghost" className="text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-lg gap-1.5 h-9 px-2 md:px-3 text-xs md:text-sm">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Website</span>
          </Button>
        </Link>
        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* Notification dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h4 className="text-sm font-bold text-gray-800">Notifikasi</h4>
                </div>
                <div className="px-4 py-10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Belum ada notifikasi</p>
                  <p className="text-xs text-gray-400 mt-1">Notifikasi baru akan muncul di sini</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-50 h-9 w-9 p-0">
                <Avatar className="h-9 w-9 border border-gray-200 rounded-lg">
                  <AvatarImage src={session?.user?.image || ""} className="rounded-lg" />
                  <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-bold">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-gray-100 shadow-lg p-2">
              {/* User info inside dropdown */}
              <div className="flex items-center gap-3 px-2 py-2 mb-1">
                <Avatar className="h-9 w-9 border border-gray-200 rounded-lg shrink-0">
                  <AvatarImage src={session?.user?.image || ""} className="rounded-lg" />
                  <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{session?.user?.name}</div>
                  <div className="text-[11px] text-gray-500 font-medium">{session?.user?.role}</div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-100 my-1" />
              <Link href="/admin/settings">
                <DropdownMenuItem className="rounded-lg focus:bg-blue-50 focus:text-blue-600 cursor-pointer px-2 py-2">
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                </DropdownMenuItem>
              </Link>
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
          <Avatar className="h-9 w-9 border border-gray-200 rounded-lg">
            <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-bold">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}

