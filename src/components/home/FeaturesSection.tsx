"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BookOpen,
  Wallet,
  Users,
  GraduationCap,
  ArrowRight,
  Clock,
  Mic,
  FileText,
  ChevronRight,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 relative bg-background overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
               <span className="h-px w-8 bg-emerald-500"></span>
               <span className="text-emerald-600 font-medium tracking-wide text-sm uppercase">Layanan Digital</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Ekosistem <span className="text-gradient-primary">Umat</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Platform layanan digital terintegrasi untuk memudahkan jamaah dalam beribadah, belajar, dan berkontribusi.
            </p>
          </div>
          
          <Link href="/profil">
            <Button variant="ghost" className="group text-lg gap-2 hover:bg-transparent hover:text-primary">
              Semua Layanan
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          
          {/* 1. Main Feature - Jadwal Shalat (Large 2x2) */}
          <Link href="/jadwal-shalat" className="group relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-3xl border border-border/40 bg-muted/20 hover:border-emerald-500/30 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22%20opacity=%221%22/%3E%3C/svg%3E')] opacity-[0.05] mix-blend-overlay" />
             
             <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                      <Calendar className="h-8 w-8" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border/50 text-xs font-medium backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      </span>
                      Live Sync
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-bold group-hover:text-emerald-600 transition-colors">Jadwal Shalat & Imsakiyah</h3>
                   <p className="text-muted-foreground max-w-sm">
                      Waktu shalat akurat sesuai lokasi masjid dengan notifikasi hitung mundur adzan.
                   </p>
                   <div className="flex items-center gap-2 text-emerald-600 font-medium group-hover:translate-x-2 transition-transform">
                      Lihat Jadwal <ArrowRight className="h-4 w-4" />
                   </div>
                </div>
             </div>
             
             {/* Decor */}
             <Calendar className="absolute -bottom-10 -right-10 h-64 w-64 text-emerald-500/5 rotate-[-15deg] group-hover:rotate-[-5deg] transition-transform duration-700" />
          </Link>

          {/* 2. Agenda / Kajian (Tall 1x2) */}
          <Link href="/jadwal-kajian" className="group relative col-span-1 md:col-span-1 row-span-2 overflow-hidden rounded-3xl border border-border/40 bg-zinc-900 text-white hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="relative h-full p-6 flex flex-col">
                <div className="mb-auto p-3 w-fit rounded-2xl bg-white/10 text-purple-300">
                   <Mic className="h-6 w-6" />
                </div>
                
                <div className="space-y-2 mt-8">
                   <h3 className="text-xl font-bold">Kajian Rutin</h3>
                   <p className="text-zinc-400 text-sm">Update jadwal kajian, khutbah Jumat, dan pemateri.</p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-bold">12</div>
                      <div className="flex flex-col">
                         <span className="text-xs text-purple-300 uppercase">Februari</span>
                         <span className="text-sm font-medium">Kajian Subuh</span>
                      </div>
                   </div>
                </div>
             </div>
          </Link>

          {/* 3. Finance (Wide 2x1) */}
          <Link href="/keuangan" className="group relative col-span-1 md:col-span-1 lg:col-span-1 row-span-1 overflow-hidden rounded-3xl border border-border/40 bg-muted/20 hover:border-gold/50 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-2 rounded-xl bg-gold/10 text-gold-600 dark:text-gold">
                      <Wallet className="h-5 w-5" />
                   </div>
                   <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors -rotate-45 group-hover:rotate-0" />
                </div>
                <div>
                   <h3 className="text-lg font-bold group-hover:text-gold-600 dark:group-hover:text-gold transition-colors">Laporan Keuangan</h3>
                   <p className="text-xs text-muted-foreground mt-1">Transparansi dana umat.</p>
                </div>
             </div>
          </Link>

          {/* 4. TPA (Standard 1x1) */}
          <Link href="/tpa" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl border border-border/40 bg-muted/20 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-500">
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="p-2 w-fit rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                   <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold group-hover:text-rose-600 transition-colors">TPA / TPQ</h3>
                   <p className="text-xs text-muted-foreground mt-1">Pendidikan Al-Quran.</p>
                </div>
             </div>
          </Link>

           {/* 5. Articles (Standard 1x1) */}
           <Link href="/artikel" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl border border-border/40 bg-muted/20 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-500">
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="p-2 w-fit rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                   <FileText className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">Artikel</h3>
                   <p className="text-xs text-muted-foreground mt-1">Bacaan Islami.</p>
                </div>
             </div>
          </Link>
          
           {/* 6. DKM (Wide 2x1) on LG */}
           <Link href="/struktur-dkm" className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 overflow-hidden rounded-3xl border border-border/40 bg-muted/20 hover:border-cyan-500/30 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative h-full p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600">
                      <Users className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold group-hover:text-cyan-600 transition-colors">Struktur DKM & Pengurus</h3>
                      <p className="text-sm text-muted-foreground mt-1">Mengenal para khadimul ummah.</p>
                   </div>
                </div>
                <div className="hidden sm:flex h-10 w-10 rounded-full border border-border/50 items-center justify-center group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all">
                   <ChevronRight className="h-5 w-5" />
                </div>
             </div>
          </Link>

        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
