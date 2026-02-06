"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
  { name: "Profil", href: "/profil", icon: Info },
  { name: "DKM", href: "/struktur-dkm", icon: Users },
  { name: "Shalat", href: "/jadwal-shalat", icon: Calendar },
  { name: "Kajian", href: "/jadwal-kajian", icon: BookOpen },
  { name: "Galeri", href: "/galeri", icon: Images },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  // We can keep the scroll listener if we want subtle effects, but user asked for static.
  // We'll keep it just in case we need a tiny border or shadow later, but for now we won't use it for layout morphing.
  const [scrolled, setScrolled] = useState(false);

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
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
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
          <span className="font-serif font-bold text-lg sm:text-xl tracking-tight hidden sm:block text-white drop-shadow-md shadow-black/50">
            Nurul Jannah
          </span>
        </Link>

        {/* Desktop Navigation - Glass Pill */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-1 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-lg shadow-black/5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full hover:text-white",
                  isActive 
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-white/80 hover:bg-white/5"
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
            <SheetContent side="top" className="w-full rounded-b-3xl glass-nav border-b-0">
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

                <nav className="grid grid-cols-2 gap-3">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-colors border border-transparent",
                          isActive
                            ? "bg-primary/10 text-primary border-primary/20 font-medium"
                            : "bg-muted/50 text-muted-foreground font-normal hover:bg-primary/5 hover:text-primary hover:border-primary/10"
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-xl py-6 text-base">Masuk Sebagai Pengurus</Button>
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
