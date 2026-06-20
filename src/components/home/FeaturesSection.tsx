"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Image from "next/image";

// ── Service data ──────────────────────────────────────────────
interface Service {
  title: string;
  description: string;
  href: string;
  illustration: string;
  borderHover: string; // tailwind hover:border-*
}

const services: Service[] = [
  {
    title: "Ibadah",
    description:
      "Jadwal shalat harian, adzan & iqomah, info shalat Jumat, dan petugas ibadah.",
    href: "/ibadah",
    illustration: "/illustrations/ibadah.png",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Agenda Masjid",
    description:
      "Jadwal kajian rutin, kegiatan sosial, dan seluruh agenda masjid terkini.",
    href: "/agenda",
    illustration: "/illustrations/agenda.png",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Infaq & Keuangan",
    description:
      "Donasi infaq online dan transparansi laporan keuangan masjid secara berkala.",
    href: "/infaq",
    illustration: "/illustrations/infaq.png",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "TPA / TPQ",
    description:
      "Program pendidikan Al-Quran untuk anak-anak dengan kurikulum terstruktur.",
    href: "/tpa",
    illustration: "/illustrations/tpa.png",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Informasi & Berita",
    description:
      "Artikel islami, berita terkini seputar masjid, dan dokumentasi galeri kegiatan.",
    href: "/artikel",
    illustration: "/illustrations/berita.png",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Profil Masjid",
    description:
      "Sejarah, visi misi, struktur kepengurusan DKM, dan informasi lengkap masjid.",
    href: "/profil",
    illustration: "/illustrations/profil.png",
    borderHover: "hover:border-emerald-300",
  },
];

// ── Animation variants ────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ── Component ─────────────────────────────────────────────────
export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">

        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-emerald-500 font-bold text-lg">//</span>
            <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Layanan Digital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 mb-3 leading-tight">
            Ekosistem Digital Umat
          </h2>
          <p className="text-zinc-600 text-[15px] sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            Platform layanan terintegrasi untuk memudahkan jamaah dalam
            beribadah, belajar, dan berkontribusi.
          </p>
        </div>

        {/* ── Service Grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Card Component ────────────────────────────────────────────
function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div variants={cardVariants}>
      <Link
        href={service.href}
        className={`group relative flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 hover:border-emerald-200 transition-all duration-500`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-50/50 rounded-2xl -z-10" />
        
        <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-zinc-200 group-hover:text-emerald-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />

        {/* 3D Illustration with Faded Edges (All 4 Sides) */}
        <div 
          className="relative w-24 h-24 mb-4 transition-transform duration-500"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            maskComposite: "intersect"
          }}
        >
          <Image
            src={service.illustration}
            alt={service.title}
            fill
            className="object-cover scale-110"
          />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-lg font-serif font-bold text-zinc-900 mb-2 group-hover:text-emerald-800 transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-light">
            {service.description}
          </p>
        </div>

        {/* Bottom accent line (reveals on hover) */}
        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
      </Link>
    </motion.div>
  );
}

export default FeaturesSection;
