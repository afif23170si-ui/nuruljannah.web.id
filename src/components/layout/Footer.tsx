import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-background pt-20 pb-10 overflow-hidden border-t border-border/40">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pattern-overlay" />
      
      {/* Big Watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[10vw] md:text-[12vw] font-bold text-foreground/[0.03] whitespace-nowrap pointer-events-none select-none font-serif">
        Nurul Jannah
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3">
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
                <p className="text-sm text-muted-foreground">Pusat Ibadah & Dakwah</p>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Membangun masyarakat madani yang berlandaskan Al-Quran dan As-Sunnah melalui pelayanan umat yang profesional dan amanah.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-red-500 hover:text-white transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-2 lg:col-start-6 space-y-6">
            <h3 className="font-bold text-lg">Layanan</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jadwal-shalat" className="text-muted-foreground hover:text-emerald-600 transition-colors">Jadwal Shalat</Link>
              </li>
              <li>
                <Link href="/jadwal-kajian" className="text-muted-foreground hover:text-emerald-600 transition-colors">Jadwal Kajian</Link>
              </li>
              <li>
                <Link href="/tpa" className="text-muted-foreground hover:text-emerald-600 transition-colors">Pendidikan TPA</Link>
              </li>
              <li>
                <Link href="/zakat" className="text-muted-foreground hover:text-emerald-600 transition-colors">Layanan Zakat</Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg">Informasi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/profil" className="text-muted-foreground hover:text-emerald-600 transition-colors">Profil Masjid</Link>
              </li>
              <li>
                <Link href="/struktur-dkm" className="text-muted-foreground hover:text-emerald-600 transition-colors">Struktur DKM</Link>
              </li>
              <li>
                <Link href="/keuangan" className="text-muted-foreground hover:text-emerald-600 transition-colors">Laporan Keuangan</Link>
              </li>
              <li>
                <Link href="/galeri" className="text-muted-foreground hover:text-emerald-600 transition-colors">Galeri Foto</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-bold text-lg">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm">Jl. Masjid Nurul Jannah, Kota Dumai, Riau</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm">info@nuruljannah.id</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Masjid Nurul Jannah. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
             <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
             <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
