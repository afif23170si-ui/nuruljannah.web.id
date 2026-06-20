"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUpRight,
  MessageCircle
} from "lucide-react";

interface FooterProps {
  logoUrl?: string | null;
  mosqueName?: string;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  contacts?: Array<{ label: string; phone: string; link?: string }> | null;
}

export function Footer({ 
  logoUrl, 
  mosqueName = "Nurul Jannah",
  address,
  phone,
  whatsapp,
  email,
  contacts,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="relative bg-white text-zinc-900 overflow-hidden pt-20 pb-10 border-t border-zinc-200">
      {/* Background Pattern - Subtle Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
      

      


      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
             <div className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-full group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src={logoUrl || "/logo.webp"} 
                  alt={`Logo ${mosqueName}`} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl tracking-tight text-emerald-950">{mosqueName}</h3>
                <p className="text-emerald-700 text-xs font-medium tracking-wide uppercase">Masjid Ikatan Umat</p>
              </div>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-sm">
              Membangun peradaban umat melalui masjid yang inklusif, transparan, dan modern. Menjadi pusat dakwah yang mencerahkan dan menyejukkan hati.
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { imgSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png", href: "#", label: "Facebook", imgClass: "h-6 w-6" },
                { imgSrc: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg", href: "#", label: "Instagram", imgClass: "h-[22px] w-[22px]" },
                { imgSrc: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png", href: "#", label: "Youtube", imgClass: "h-[18px] w-auto" },
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href}
                  className="hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center h-6"
                  aria-label={social.label}
                >
                  <img 
                    src={social.imgSrc} 
                    alt={social.label} 
                    className={`${social.imgClass} object-contain`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer (Span 1) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Navigation (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-xl mb-6 text-emerald-950">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Profil Masjid", href: "/profil" },
                { name: "Ibadah", href: "/ibadah" },
                { name: "Agenda", href: "/agenda" },
                { name: "Infaq", href: "/infaq" },
                { name: "Galeri", href: "/galeri" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center text-zinc-600 hover:text-emerald-700 transition-colors group text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-xl mb-6 text-emerald-950">Layanan</h4>
            <ul className="space-y-4">
              {[
                { name: "Laporan Keuangan", href: "/keuangan" },
                { name: "TPA / TPQ", href: "/tpa" },
                { name: "Artikel & Berita", href: "/artikel" },
                { name: "Struktur Organisasi", href: "/profil#struktur-dkm" },
                { name: "Sejarah Masjid", href: "/profil/sejarah" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center text-zinc-600 hover:text-emerald-700 transition-colors group text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (Span 4) */}
          <div className="lg:col-span-4">
             <h4 className="font-serif font-bold text-xl mb-6 text-emerald-950">Hubungi Kami</h4>
             <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="block text-zinc-600 text-sm leading-relaxed">
                  {address || "Jl. Sriwedari Ujung Gg. Tanjung II, Kel. Tanjung Palas, Kec. Dumai Timur, Kota Dumai, Riau, 28826"}
                </span>
              </li>
              
              {/* Dynamic Contacts (Pengurus Inti) */}
              {contacts && contacts.length > 0 ? (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-3 w-full">
                      {contacts.map((contact, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm w-full group">
                          <div>
                            <span className="font-medium text-zinc-700 block">{contact.label}</span>
                            <span className="text-zinc-500">{contact.phone}</span>
                          </div>
                          {contact.link && (
                            <a
                              href={contact.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex-shrink-0"
                              aria-label={`WhatsApp ${contact.label}`}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </li>
              ) : (phone || whatsapp) ? (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="block text-zinc-600 text-sm mt-0.5">{whatsapp || phone}</span>
                </li>
              ) : null}

              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="block text-zinc-600 text-sm mt-0.5">{email || "masjidnuruljannahtp@gmail.com"}</span>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-600 text-sm mt-0.5">Buka setiap hari, 24 jam</span>
                  <span className="block text-zinc-500 text-xs mt-1">Sekretariat: Senin – Jumat, 08.00 – 16.00 WIB</span>
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
