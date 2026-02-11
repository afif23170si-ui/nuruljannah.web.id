"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-[34px] left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full flex justify-between items-center container px-4 sm:px-6">
        
        {/* Logo */}
        <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/20 shadow-lg">
            <Image 
              src="/logo-mnj.png" 
              alt="Logo Nurul Jannah" 
              fill 
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white drop-shadow-md shadow-black/50">
            Nurul Jannah
          </span>
        </Link>

        {/* Desktop Navigation - Glass Pill (Centered) */}
        <nav className={cn(
          "hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300",
          scrolled 
            ? "bg-white/80 backdrop-blur-xl border border-white/20 shadow-md"
            : "bg-white/20 backdrop-blur-xl border border-white/20"
        )}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
            
            if (item.children) {
              const isHovered = hoveredItem === item.name;
              return (
                <DropdownMenu 
                  key={item.name} 
                  open={isHovered} 
                  onOpenChange={(open) => {
                    if (!open) handleMouseLeave();
                  }} 
                  modal={false}
                >
                  <DropdownMenuTrigger 
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full hover:text-emerald-950 outline-none",
                      isActive || isHovered
                        ? "text-emerald-950 bg-white/40"
                        : "text-emerald-900/60"
                    )}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="w-48 p-1 border-white/20 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.href}>
                        <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/50 focus:bg-white/50">
                          <child.icon className="mr-2 h-4 w-4" />
                          <span>{child.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
// ...

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full hover:text-emerald-950",
                  isActive 
                    ? "text-emerald-950"
                    : "text-emerald-900/60"
                )}
              >
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Login Button - Desktop */}
          <Link href="/login" className="hidden lg:block">
             <Button className="bg-white/90 text-emerald-950 hover:bg-white shadow-lg backdrop-blur-sm transition-all rounded-full px-6">
               Masuk
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30">
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
    </header>
  );
}

export default Header;
