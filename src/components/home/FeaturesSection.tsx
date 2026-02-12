"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mic,
  Wallet,
  GraduationCap,
  FileText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

// ── Service data ──────────────────────────────────────────────
interface Service {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;      // tailwind bg-*
  iconColor: string;  // tailwind text-*
  borderHover: string; // tailwind hover:border-*
}

const services: Service[] = [
  {
    title: "Jadwal Shalat",
    description:
      "Waktu shalat akurat sesuai lokasi masjid dengan notifikasi hitung mundur adzan.",
    href: "/jadwal-shalat",
    icon: Clock,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Kajian Rutin",
    description:
      "Jadwal kajian, khutbah Jumat, dan informasi pemateri terkini.",
    href: "/jadwal-kajian",
    icon: Mic,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Laporan Keuangan",
    description:
      "Transparansi pengelolaan dana infaq, sedekah, dan operasional masjid.",
    href: "/keuangan",
    icon: Wallet,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "TPA / TPQ",
    description:
      "Program pendidikan Al-Quran untuk anak-anak dengan kurikulum terstruktur.",
    href: "/tpa",
    icon: GraduationCap,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Artikel Islami",
    description:
      "Kumpulan tulisan seputar keislaman, fiqih, dan motivasi harian.",
    href: "/artikel",
    icon: FileText,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    title: "Struktur DKM",
    description:
      "Mengenal para pengurus dan khadimul ummah Masjid Nurul Jannah.",
    href: "/profil#struktur-dkm",
    icon: Users,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
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
    <section className="py-20 md:py-32 relative bg-white overflow-hidden">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-emerald-200" />

      <div className="container mx-auto px-4 sm:px-6">

        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <span className="inline-flex items-center gap-2 text-emerald-700 font-medium tracking-widest text-xs uppercase mb-4">
            <span className="h-px w-6 bg-emerald-400" />
            Layanan Digital
            <span className="h-px w-6 bg-emerald-400" />
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-emerald-950 mb-4">
            Ekosistem Digital{" "}
            <span className="italic text-emerald-700">Umat</span>
          </h2>
          <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto">
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
  const Icon = service.icon;

  return (
    <motion.div variants={cardVariants}>
      <Link
        href={service.href}
        className={`group relative flex flex-col gap-5 p-6 md:p-7 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${service.borderHover} hover:shadow-lg transition-all duration-300`}
      >
        {/* Icon */}
        <div className="flex items-start justify-between">
          <div
            className={`${service.color} ${service.iconColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-lg font-serif font-bold text-zinc-900 mb-1.5 group-hover:text-emerald-800 transition-colors">
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
