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
    <section className="py-24 md:py-32 relative bg-zinc-50 overflow-hidden">
      {/* Background Decor - Minimalist Grain/Line (Optional, keep clean for now) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-zinc-200 pb-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
               <span className="h-px w-12 bg-emerald-600"></span>
               <span className="text-emerald-800 font-medium tracking-widest text-xs uppercase">Layanan Digital</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-emerald-950">
              Ekosistem <span className="italic text-emerald-700">Umat</span>
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              Platform layanan digital terintegrasi untuk memudahkan jamaah dalam beribadah, belajar, dan berkontribusi secara modern.
            </p>
          </div>
          
          <Link href="/profil">
            <Button variant="outline" className="group rounded-full border-zinc-300 text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-300 transition-all duration-300">
              Semua Layanan
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          
          {/* 1. Main Feature - Jadwal Shalat (Large 2x2) */}
          <Link href="/jadwal-shalat" className="group relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 flex flex-col justify-between">
             {/* Subtle Pattern Background */}
             <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M1%201h2v2H1V1zm4%200h2v2H5V1zm4%200h2v2H9V1zM1%205h2v2H1V5zm4%200h2v2H5V5zm4%200h2v2H9V5zm-8%204h2v2H1V9zm4%200h2v2H5V9zm4%200h2v2H9V9zm-8%204h2v2H1v-2zm4%200h2v2H5v-2zm4%200h2v2H9v-2zm-8%204h2v2H1v-2zm4%200h2v2H5v-2zm4%200h2v2H9v-2z%22%20fill=%22%23064e3b%22%20fill-opacity=%221%22%20fill-rule=%22evenodd%22/%3E%3C/svg%3E')] mix-blend-multiply" />
             
             <div className="relative p-8 h-full flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                   <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Calendar className="h-8 w-8" />
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium tracking-wide">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                      </span>
                      LIVE SYNC
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-serif font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">Jadwal Shalat</h3>
                   <p className="text-zinc-500 max-w-sm font-light">
                      Waktu shalat akurat sesuai lokasi masjid dengan notifikasi hitung mundur adzan.
                   </p>
                   <div className="inline-flex items-center gap-2 text-emerald-700 font-medium group-hover:translate-x-2 transition-transform text-sm border-b border-transparent group-hover:border-emerald-700 pb-0.5">
                      Lihat Jadwal <ArrowRight className="h-4 w-4" />
                   </div>
                </div>
             </div>
          </Link>

          {/* 2. Agenda / Kajian (Tall 1x2) */}
          <Link href="/jadwal-kajian" className="group relative col-span-1 md:col-span-1 row-span-2 overflow-hidden rounded-3xl bg-emerald-900 text-white shadow-lg hover:shadow-2xl hover:bg-emerald-950 transition-all duration-500 flex flex-col">
             {/* Minimalist Decoration */}
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <BookOpen className="w-32 h-32 text-emerald-200 rotate-12" />
             </div>
             
             <div className="relative p-8 h-full flex flex-col z-10">
                <div className="mb-auto">
                   <div className="p-3 w-fit rounded-2xl bg-white/10 text-emerald-100 backdrop-blur-sm">
                      <Mic className="h-6 w-6" />
                   </div>
                </div>
                
                <div className="space-y-2 mt-8">
                   <h3 className="text-2xl font-serif font-bold text-white">Kajian Rutin</h3>
                   <p className="text-emerald-200/80 text-sm font-light leading-relaxed">Update jadwal kajian, khutbah Jumat, dan pemateri.</p>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-800/50">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-800 flex items-center justify-center font-bold font-serif text-lg border border-emerald-700 shadow-inner">12</div>
                      <div className="flex flex-col">
                         <span className="text-xs text-emerald-300 uppercase tracking-widest">Februari</span>
                         <span className="text-base font-medium text-white">Kajian Subuh</span>
                      </div>
                   </div>
                </div>
             </div>
          </Link>

          {/* 3. Finance (Wide 1x1) */}
          <Link href="/keuangan" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all duration-300">
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <Wallet className="h-5 w-5" />
                   </div>
                   <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-amber-600 transition-colors -rotate-45 group-hover:rotate-0" />
                </div>
                <div>
                   <h3 className="text-lg font-serif font-bold text-zinc-800 group-hover:text-amber-700 transition-colors">Laporan Keuangan</h3>
                   <p className="text-xs text-zinc-500 mt-1">Transparansi dana umat.</p>
                </div>
             </div>
          </Link>

          {/* 4. TPA (Standard 1x1) */}
          <Link href="/tpa" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-rose-400/50 transition-all duration-300">
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                      <GraduationCap className="h-5 w-5" />
                   </div>
                   <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-rose-600 transition-colors -rotate-45 group-hover:rotate-0" />
                </div>
                <div>
                   <h3 className="text-lg font-serif font-bold text-zinc-800 group-hover:text-rose-700 transition-colors">TPA / TPQ</h3>
                   <p className="text-xs text-zinc-500 mt-1">Pendidikan Al-Quran.</p>
                </div>
             </div>
          </Link>

           {/* 5. Articles (Standard 1x1) */}
           <Link href="/artikel" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-blue-400/50 transition-all duration-300">
             <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <FileText className="h-5 w-5" />
                   </div>
                   <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-600 transition-colors -rotate-45 group-hover:rotate-0" />
                </div>
                <div>
                   <h3 className="text-lg font-serif font-bold text-zinc-800 group-hover:text-blue-700 transition-colors">Artikel</h3>
                   <p className="text-xs text-zinc-500 mt-1">Bacaan Islami.</p>
                </div>
             </div>
          </Link>
          
           {/* 6. DKM (Wide 2x1) on LG */}
           <Link href="/struktur-dkm" className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-cyan-400/50 transition-all duration-500 flex items-center">
             <div className="relative h-full w-full p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-3.5 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-100">
                      <Users className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-serif font-bold text-zinc-800 group-hover:text-cyan-700 transition-colors">Struktur DKM & Pengurus</h3>
                      <p className="text-sm text-zinc-500 mt-1">Mengenal para khadimul ummah.</p>
                   </div>
                </div>
                <div className="hidden sm:flex h-10 w-10 rounded-full border border-zinc-200 items-center justify-center text-zinc-400 group-hover:bg-cyan-50 group-hover:text-cyan-700 group-hover:border-cyan-200 transition-all">
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
