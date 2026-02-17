"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  ArrowUpRight
} from "lucide-react";

interface FooterProps {
  logoUrl?: string | null;
  mosqueName?: string;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

export function Footer({ 
  logoUrl, 
  mosqueName = "Nurul Jannah",
  address,
  phone,
  whatsapp,
  email,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white text-zinc-900 overflow-hidden pt-20 pb-10 border-t border-zinc-200">
      {/* Background Pattern - Subtle Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
      

      


      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center gap-4 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src={logoUrl || "/logo.webp"} 
                  alt={`Logo ${mosqueName}`} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl tracking-tight text-emerald-950">{mosqueName}</h3>
                <p className="text-emerald-700 text-sm font-medium tracking-wide uppercase">Masjid Ikatan Umat</p>
              </div>
            </div>
            <p className="text-zinc-600 text-base leading-relaxed max-w-sm font-light">
              Membangun peradaban umat melalui masjid yang inklusif, transparan, dan modern. Menjadi pusat dakwah yang mencerahkan dan menyejukkan hati.
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "Youtube" },
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm hover:border-emerald-500 hover:text-white hover:bg-emerald-600 text-zinc-500 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer (Span 1) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Navigation (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-xl mb-6 text-emerald-950">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Profil Masjid", href: "/profil" },
                { name: "Ibadah", href: "/ibadah" },
                { name: "Agenda Masjid", href: "/agenda" },
                { name: "Galeri Kegiatan", href: "/galeri" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors group text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-xl mb-6 text-emerald-950">Layanan</h4>
            <ul className="space-y-4">
              {[
                { name: "Infaq Online", href: "/infaq" },
                { name: "TPA / TPQ", href: "/tpa" },
                { name: "Laporan Keuangan", href: "/keuangan" },
                { name: "Struktur DKM", href: "/profil#struktur-dkm" },
                { name: "Artikel Islami", href: "/artikel" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors group text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (Span 3) */}
          <div className="lg:col-span-3">
             <h4 className="font-serif font-semibold text-xl mb-6 text-emerald-950">Hubungi Kami</h4>
             <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs text-emerald-700 uppercase tracking-wider font-bold">Alamat</span>
                  <span className="block text-zinc-600 text-sm leading-relaxed">
                    {address || "Jl. Sriwedari Ujung Gg. Tanjung II, Kel. Tanjung Palas, Kec. Dumai Timur, Kota Dumai, Riau, 28826"}
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs text-emerald-700 uppercase tracking-wider font-bold">Telepon / WhatsApp</span>
                   <span className="block text-zinc-600 text-sm">{whatsapp || phone || "+62 812-3456-7890"}</span>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                 <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs text-emerald-700 uppercase tracking-wider font-bold">Email</span>
                  <span className="block text-zinc-600 text-sm">{email || "info@nuruljannah.or.id"}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Separator */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-zinc-500 text-xs tracking-wide">
              © {currentYear} Masjid {mosqueName}
            </p>
            <div className="hidden md:block h-1 w-1 rounded-full bg-zinc-300"></div>
            <p className="text-zinc-500 text-xs tracking-wide hover:text-emerald-700 transition-colors cursor-default">
              Hak Cipta Dilindungi Undang-Undang
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-zinc-500 text-xs tracking-wide">
              Dibuat dengan <span className="text-red-500 animate-pulse">❤️</span> untuk Umat
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
