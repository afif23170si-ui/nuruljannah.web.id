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
  BookOpen,
  Images,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Beranda", href: "/", icon: Home },
  { 
    name: "Profil", 
    href: "/profil", 
    icon: Info,
    children: [
      { name: "Profil Masjid", href: "/profil", icon: Info },
      { name: "Visi & Misi", href: "/profil", icon: BookOpen },
      { name: "Struktur DKM", href: "/profil#struktur-dkm", icon: Users },
      { name: "Sejarah", href: "/profil", icon: Calendar }, // Using Calendar as placeholder or maybe I should import History icon if available, but for now reuse existing or generic
    ]
  },
  { name: "Shalat", href: "/jadwal-shalat", icon: Calendar },
  { name: "Kajian", href: "/jadwal-kajian", icon: BookOpen },
  { name: "Infaq", href: "/infaq", icon: Heart },
  { name: "Galeri", href: "/galeri", icon: Images },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  // We can keep the scroll listener if we want subtle effects, but user asked for static.
  // We'll keep it just in case we need a tiny border or shadow later, but for now we won't use it for layout morphing.
  const [scrolled, setScrolled] = useState(false);
  const [headerTop, setHeaderTop] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Smoothly follow banner as it scrolls away
      const hasBanner = document.body.classList.contains("has-announcement");
      if (hasBanner) {
        const bannerHeight = 36;
        setHeaderTop(Math.max(0, bannerHeight - window.scrollY));
      } else {
        setHeaderTop(0);
      }
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
    <header
      className="fixed left-0 right-0 z-50"
      style={{ top: `${headerTop}px` }}
    >
      <div className="mx-auto w-[96%] max-w-7xl">
        <div className={cn(
          "relative flex items-center justify-between px-6 py-3 rounded-b-[2rem] transition-all duration-500",
          "bg-white/90 backdrop-blur-xl border-x border-b border-white/20 shadow-sm",
          scrolled && "shadow-md bg-white/95"
        )}>
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-emerald-900/10 shadow-sm transition-transform group-hover:scale-105">
                <Image 
                  src="/logo-mnj.png" 
                  alt="Logo Nurul Jannah" 
                  fill 
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-emerald-950 hidden sm:block">
                Nurul Jannah
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
                          "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full outline-none",
                          isActive
                            ? "text-emerald-950 bg-emerald-50"
                            : "text-slate-600 hover:text-emerald-900 hover:bg-slate-50"
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
                        "px-4 py-2 text-sm font-medium transition-colors rounded-full",
                        isActive
                          ? "text-emerald-950 bg-emerald-50"
                          : "text-slate-600 hover:text-emerald-900 hover:bg-slate-50"
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
            <Link href="/login" className="hidden sm:block">
               <Button size="sm" className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-md transition-all rounded-full px-5 h-9">
                 Masuk
              </Button>
            </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-emerald-950 bg-white/70 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/80">
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
                      src="/logo-mnj.png" 
                      alt="Logo Nurul Jannah" 
                      fill 
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif">Masjid Nurul Jannah</h2>
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
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                    <Button className="w-full rounded-full h-12 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]">
                      Masuk Sebagai Pengurus
                    </Button>
                  </Link>
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
