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
import {
  ChevronDown,
  Menu,
  MessageCircle,
  ArrowUpRight,
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
  Sparkles,
  HeadphonesIcon,
  Megaphone,
  Newspaper,
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
      { name: "Struktur Organisasi", href: "/profil#struktur-dkm", icon: Users },
      { name: "Sejarah", href: "/profil/sejarah", icon: Calendar },
    ]
  },
  { name: "Ibadah", href: "/ibadah", icon: Clock },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { 
    name: "ZISWAF", 
    href: "/infaq", 
    icon: Heart,
    children: [
      { name: "Donasi & Infaq", href: "/infaq", icon: Heart },
      { name: "Laporan Transparansi", href: "/keuangan", icon: BookOpen },
    ]
  },
  { 
    name: "Informasi", 
    href: "/artikel", 
    icon: Newspaper,
    children: [
      { name: "Artikel & Berita", href: "/artikel", icon: Newspaper },
      { name: "Galeri", href: "/galeri", icon: Images },
    ]
  },
];

interface HeaderProps {
  logoUrl?: string | null;
  mosqueName?: string;
}

export function Header({ logoUrl, mosqueName = "Nurul Jannah" }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string | null>(null);
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

  // Reset expanded items when mobile menu closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setExpandedItems(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isHome = pathname === "/";
  const isTransparentHeroPage = !pathname.startsWith("/login") && !pathname.startsWith("/galeri/");
  const isTransparent = isTransparentHeroPage && !scrolled;

  return (
    <>
    <header 
      suppressHydrationWarning 
      className={cn(
        "fixed z-50 transition-all duration-300",
        isTransparent ? "top-[10px] md:top-[20px] left-0 right-0" : "top-0 left-0 right-0"
      )}
    >
      <div className={cn(
        "w-full transition-all duration-500",
        isTransparent ? "bg-transparent" : "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200"
      )}>
        <div className={cn(
          "mx-auto flex items-center justify-between w-[96%] max-w-7xl px-6 transition-all duration-500",
          isTransparent ? "py-5 md:py-6" : "py-4"
        )}>
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className={cn("relative h-8 w-8 overflow-hidden rounded-full ring-1 shadow-sm transition-transform group-hover:scale-105", isTransparent ? "ring-white/30" : "ring-emerald-900/10")}>
                <Image 
                  src={logoUrl || "/logo.webp"} 
                  alt={`Logo ${mosqueName}`} 
                  fill 
                  sizes="32px"
                  className="object-cover"
                  priority
                />
              </div>
              <span className={cn("font-serif font-bold text-lg tracking-tight", isTransparent ? "text-white drop-shadow-md" : "text-emerald-950")}>
                {mosqueName}
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
              const isHovered = hoveredItem === item.name;

              // Removed disabled items rendering logic
              
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
                            ? (isTransparent ? "border-white/20 text-white bg-white/15 backdrop-blur-md" : "border-transparent text-emerald-950 bg-zinc-100/80")
                            : (isTransparent ? "border-transparent text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm" : "border-transparent text-slate-600 hover:text-emerald-900 hover:bg-slate-50")
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          isHovered ? (isTransparent ? "rotate-180 text-white" : "rotate-180 text-emerald-900") : (isTransparent ? "text-white/60" : "text-slate-400")
                        )} />
                      </DropdownMenuTrigger>
                      <AnimatePresence>
                        {isHovered && (
                          <DropdownMenuContent 
                            forceMount
                            align="start" 
                            sideOffset={8}
                            className={cn(
                              "w-48 p-1 shadow-xl shadow-emerald-900/5 rounded-2xl border !animate-none",
                              isTransparent 
                                ? "bg-white/10 backdrop-blur-md border-white/20 text-white" 
                                : "bg-white/95 backdrop-blur-xl border-white/20 text-slate-800"
                            )}
                            onMouseEnter={() => handleMouseEnter(item.name)}
                            onMouseLeave={handleMouseLeave}
                            asChild
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                            >
                              {item.children.map((child) => (
                                  <Link key={child.name} href={child.href}>
                                    <DropdownMenuItem className={cn(
                                      "cursor-pointer rounded-xl transition-colors py-2.5 px-3 focus:outline-none",
                                      isTransparent
                                        ? "hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white"
                                        : "hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900"
                                    )}>
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
                            ? (isTransparent ? "border-white/20 text-white bg-white/15 backdrop-blur-md" : "border-transparent text-emerald-950 bg-zinc-100/80")
                            : (isTransparent ? "border-transparent text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm" : "border-transparent text-slate-600 hover:text-emerald-900 hover:bg-slate-50")
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
              <Link href="#kontak" className="hidden sm:block">
                 <Button className={cn("text-white transition-all rounded-full pl-5 pr-1.5 gap-2.5", isTransparent ? "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-md" : "bg-emerald-600 hover:bg-emerald-700")}>
                   <span className="font-medium">Kontak</span>
                   <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 shrink-0 shadow-sm">
                     <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                   </div>
                </Button>
              </Link>
            )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full transition-all", isTransparent ? "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-md" : "text-white bg-emerald-600 hover:bg-emerald-700 border-none")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col h-full bg-white/95 backdrop-blur-xl border-l border-white/20">
               <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              
              {/* Header inside Mobile Menu */}
              <div className="flex items-center gap-4 p-6 pb-5 border-b border-slate-100/50">
                <div className="relative h-9 w-9 overflow-hidden shrink-0">
                  <Image 
                    src={logoUrl || "/logo.webp"} 
                    alt={`Logo ${mosqueName}`} 
                    fill 
                    sizes="36px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold font-serif leading-tight text-emerald-950">Masjid {mosqueName}</h2>
                  <p className="text-xs text-emerald-700/80 font-medium mt-0.5">Menu Navigasi Utama</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-2 px-4 scrollbar-hide">
                <nav className="flex flex-col pb-6 px-2">
                  {navigation.map((item) => {
                    // Handle "Profil" sub-items as a grouped section
                    if (item.children) {
                      return (
                        <div key={item.name} className="flex flex-col border-b border-slate-100/60 last:border-b-0">
                          <button 
                            onClick={() => {
                              setExpandedItems(prev => prev === item.name ? null : item.name);
                            }}
                            className="flex items-center justify-between w-full py-3.5 text-left group"
                          >
                            <span className="text-[15px] font-medium text-slate-800 group-hover:text-emerald-700 transition-colors">
                              {item.name}
                            </span>
                            <ChevronDown className={cn("h-4.5 w-4.5 text-slate-400 transition-transform duration-300", expandedItems === item.name && "rotate-180")} />
                          </button>
                          
                          <div className={cn(
                            "grid transition-all duration-300 ease-in-out",
                            expandedItems === item.name ? "grid-rows-[1fr] opacity-100 pb-3" : "grid-rows-[0fr] opacity-0"
                          )}>
                            <div className="overflow-hidden flex flex-col gap-1 pl-4">
                              {item.children.map(child => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                      "py-2 transition-all text-[14px] block",
                                      isChildActive
                                        ? "text-emerald-700 font-semibold"
                                        : "text-slate-500 hover:text-emerald-600"
                                    )}
                                  >
                                    {child.name}
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
                          "py-3.5 transition-all border-b border-slate-100/60 last:border-b-0 text-[15px] font-medium block",
                          isActive
                            ? "text-emerald-700 font-semibold"
                            : "text-slate-800 hover:text-emerald-700"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Compact footer: user + actions anchored at bottom */}
              <div className="mt-auto p-6 bg-white border-t border-slate-100">
                {mounted && session?.user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-sm">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</span>
                        <span className="text-[12px] text-slate-500 truncate">{session.user.role}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button className="w-auto px-5 h-10 rounded-full text-[14px] font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Panel
                        </Button>
                      </Link>

                      <Button 
                        variant="outline"
                        className="h-10 w-10 p-0 rounded-full text-red-500 border-slate-200 hover:bg-red-50 hover:text-red-600 shrink-0 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href="#kontak" onClick={() => setIsOpen(false)} className="inline-block">
                    <Button className="w-auto h-11 rounded-full pl-5 pr-1.5 gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex justify-center items-center group">
                      <span className="font-medium text-[14px]">Hubungi Kami</span>
                      <div className="flex items-center justify-center bg-white rounded-full w-7 h-7 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </header>
    {/* Spacer for fixed header on non-transparent pages */}
    {!isTransparentHeroPage && <div className="h-[73px] w-full" />}
    </>
  );
}

export default Header;
