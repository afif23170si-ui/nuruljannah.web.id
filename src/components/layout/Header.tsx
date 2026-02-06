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
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300">
      <div className="w-full flex justify-center container px-2 sm:px-4">
        <div 
          className={cn(
            "pointer-events-auto flex items-center justify-between p-2 pl-4 sm:pl-6 pr-2 sm:pr-3 rounded-full w-full transition-all duration-500 ease-in-out border",
            scrolled 
              ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5" 
              : "bg-transparent border-transparent"
          )}
        >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
            <Image 
              src="/logo-mnj.png" 
              alt="Logo Nurul Jannah" 
              fill 
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <span className={cn(
            "font-serif font-bold text-lg sm:text-xl tracking-tight hidden sm:block transition-colors duration-300",
            scrolled ? "text-emerald-950" : "text-white drop-shadow-sm"
          )}>
            Nurul Jannah
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 text-sm transition-all rounded-full group overflow-hidden",
                  isActive 
                    ? (scrolled ? "font-medium text-emerald-700" : "font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-sm") 
                    : (scrolled ? "text-emerald-900/70 hover:text-emerald-700" : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-md hover:border hover:border-white/10 relative border border-transparent")
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && scrolled && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          
          {/* Login Button - Desktop */}
          <Link href="/login" className="hidden lg:block">
             <Button className={cn(
               "transition-all",
               scrolled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-white text-emerald-950 hover:bg-white/90 shadow-md"
            )}>
              Masuk
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={cn(
                "h-9 w-9 rounded-full",
                scrolled ? "text-emerald-950" : "text-white hover:bg-white/20"
              )}>
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
      </div>
    </header>
  );
}

export default Header;
