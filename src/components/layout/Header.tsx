"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import {
  Menu,
  Home,
  Info,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Images,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
  { name: "Beranda", href: "/", icon: Home },
  { 
    name: "Profil", 
    href: "/profil", 
    icon: Info,
    children: [
      { name: "Tentang Masjid", href: "/profil", icon: Info },
      { name: "Visi & Misi", href: "/profil", icon: BookOpen },
      { name: "Struktur DKM", href: "/profil#struktur-dkm", icon: Users },
      { name: "Sejarah", href: "/profil/sejarah", icon: Calendar },
    ]
  },
  { name: "Ibadah", href: "/ibadah", icon: Clock },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Infaq", href: "/infaq", icon: Heart },
  { name: "Galeri", href: "/galeri", icon: Images },
];

interface HeaderProps {
  logoUrl?: string | null;
  mosqueName?: string;
}

export function Header({ logoUrl, mosqueName = "Nurul Jannah" }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  // We can keep the scroll listener if we want subtle effects, but user asked for static.
  // We'll keep it just in case we need a tiny border or shadow later, but for now we won't use it for layout morphing.
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredItem(name);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
  };

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header suppressHydrationWarning className="sticky top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className={cn(
        "w-full transition-all duration-500",
        "bg-white/90 backdrop-blur-xl",
        scrolled && "bg-white/95 shadow-sm border-b border-white/20"
      )}>
        <div className="mx-auto w-[96%] max-w-7xl px-6 py-4 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-emerald-900/10 shadow-sm transition-transform group-hover:scale-105">
                <Image 
                  src={logoUrl || "/logo.webp"} 
                  alt={`Logo ${mosqueName}`} 
                  fill 
                  sizes="32px"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-emerald-950">
                {mosqueName}
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
              const isHovered = hoveredItem === item.name;
              
              return (
                <div 
                  key={item.name} 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.children ? (
                    <DropdownMenu 
                      open={isHovered} 
                      onOpenChange={(open) => {
                        if (!open) handleMouseLeave();
                      }} 
                      modal={false}
                    >
                      <DropdownMenuTrigger 
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full outline-none border",
                          isActive
                            ? "text-emerald-950 bg-emerald-50 border-emerald-200"
                            : "text-slate-600 hover:text-emerald-900 hover:bg-slate-50 border-transparent"
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          isHovered ? "rotate-180 text-emerald-900" : "text-slate-400"
                        )} />
                      </DropdownMenuTrigger>
                      <AnimatePresence>
                        {isHovered && (
                          <DropdownMenuContent 
                            align="start" 
                            sideOffset={8}
                            className="w-48 p-1 border-white/20 bg-white/95 backdrop-blur-xl shadow-xl shadow-emerald-900/5 rounded-2xl"
                            onMouseEnter={() => handleMouseEnter(item.name)}
                            onMouseLeave={handleMouseLeave}
                            asChild
                          >
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.children.map((child) => (
                                <Link key={child.name} href={child.href}>
                                  <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900 transition-colors py-2.5 px-3">
                                    <child.icon className="mr-2 h-4 w-4 opacity-70" />
                                    <span className="font-medium">{child.name}</span>
                                  </DropdownMenuItem>
                                </Link>
                              ))}
                            </motion.div>
                          </DropdownMenuContent>
                        )}
                      </AnimatePresence>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors rounded-full border",
                        isActive
                          ? "text-emerald-950 bg-emerald-50 border-emerald-200"
                          : "text-slate-600 hover:text-emerald-900 hover:bg-slate-50 border-transparent"
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {mounted && session?.user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="hidden sm:block outline-none">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform hover:scale-105">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-900 font-medium">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl bg-white/95 backdrop-blur-xl border-white/20 shadow-xl shadow-emerald-900/5">
                  <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-emerald-50/50">
                    <Avatar className="h-10 w-10 border border-emerald-100">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-900">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-emerald-950 truncate">{session.user.name}</span>
                      <span className="text-xs text-emerald-600 truncate">{session.user.email}</span>
                    </div>
                  </div>
                  
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer rounded-lg text-slate-600 focus:text-emerald-900 focus:bg-emerald-50 py-2.5">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 py-2.5 mt-1"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block">
                 <Button size="sm" className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-md transition-all rounded-full px-5 h-9">
                   Masuk
                </Button>
              </Link>
            )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white bg-emerald-600 shadow-md hover:bg-emerald-700 border-none transition-transform hover:scale-105">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full rounded-b-3xl glass-nav border-b-0 max-h-[85vh] overflow-y-auto">
               <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <div className="flex flex-col gap-6 pt-4 pb-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image 
                    src={logoUrl || "/logo.webp"} 
                    alt={`Logo ${mosqueName}`} 
                    fill 
                    sizes="48px"
                    className="object-cover"
                    priority
                  />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif">Masjid {mosqueName}</h2>
                    <p className="text-xs text-muted-foreground">Menu Navigasi</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => {
                    // Handle "Profil" sub-items as a grouped section
                    if (item.children) {
                      return (
                        <div key={item.name} className="flex flex-col mt-2 mb-2 bg-slate-50/50 rounded-2xl border border-slate-100/50 overflow-hidden">
                          <button 
                            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                            className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                              <item.icon className="h-5 w-5 text-slate-400" />
                              {item.name}
                            </span>
                            <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isProfileExpanded && "rotate-180")} />
                          </button>
                          
                          <div className={cn(
                            "grid transition-all duration-300 ease-in-out",
                            isProfileExpanded ? "grid-rows-[1fr] opacity-100 pb-2" : "grid-rows-[0fr] opacity-0"
                          )}>
                            <div className="overflow-hidden flex flex-col gap-1 px-2">
                              {item.children.map(child => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ml-2",
                                      isChildActive
                                        ? "bg-white shadow-sm text-emerald-700 font-medium border border-emerald-100"
                                        : "text-slate-500 hover:bg-white/60 hover:text-slate-900"
                                    )}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    <span className="text-sm">{child.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          isActive
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4 px-2">
                  {mounted && session?.user ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                          <AvatarFallback className="bg-emerald-200 text-emerald-800 font-bold">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-emerald-950 truncate">{session.user.name}</span>
                          <span className="text-xs text-emerald-600 truncate">{session.user.role}</span>
                        </div>
                      </div>

                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start rounded-xl h-12 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-emerald-900">
                          <LayoutDashboard className="mr-2 h-5 w-5" />
                          Dashboard
                        </Button>
                      </Link>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start rounded-xl h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Keluar
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button className="w-full rounded-full h-12 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]">
                        Masuk Sebagai Pengurus
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
