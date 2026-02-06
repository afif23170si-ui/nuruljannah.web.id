"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { PrayerTimesWidget } from "./PrayerTimesWidget";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-end overflow-hidden">
      
      {/* Background Image */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-nj.webp"
          alt="Masjid Nurul Jannah"
          fill
          className="object-cover object-center will-change-transform"
          priority
          sizes="100vw"
          quality={70}
        />
        {/* Pattern Overlay - Geometric Islamic Pattern with Gold tint */ }
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23d97706%22%20fill-opacity=%220.03%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-[1] pointer-events-none" />
        
        {/* Cinematic Vignette - Darkens edges to frame the mosque naturally, removed white haze */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 z-[2] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] z-[2]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 container px-4 sm:px-6 flex flex-col items-start text-left pb-2 md:pb-4">
        


        {/* Title */}
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-4 leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] relative z-10 max-w-4xl">
          Masjid <span className="text-transparent bg-clip-text bg-gradient-to-tr from-white via-white to-white/80">Nurul Jannah</span>
        </h1>

        {/* Subtitle */}
        {/* Subtitle */}
        {/* Subtitle */}
        <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/80 mb-8 leading-relaxed font-light font-sans drop-shadow-md">
          Membentuk ukhuwah islamiyah melalui masjid yang inklusif, modern, 
          dan transparan bagi seluruh lapisan masyarakat.
        </p>

        {/* CTA Buttons */}
        {/* CTA Buttons */}
        <div className="flex flex-row gap-3 sm:gap-4">
          <Link href="/jadwal-kajian">
            <Button size="lg" className="h-10 sm:h-11 px-6 sm:px-8 rounded-full text-sm sm:text-base gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 transition-all border border-amber-400/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Jadwal Kajian
            </Button>
          </Link>
          <Link href="/profil">
            <Button size="lg" variant="outline" className="h-10 sm:h-11 px-6 sm:px-8 rounded-full text-sm sm:text-base gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 duration-300 shadow-lg">
              Profil Masjid
            </Button>
          </Link>
        </div>
      </div>

      {/* Prayer Times Widget */}
      <div className="relative z-20 w-full container px-4 pb-8 md:pb-12 mt-4 md:mt-8">
        <div className="w-full mx-auto">
          <PrayerTimesWidget location="Kota Dumai" />
        </div>
      </div>

    </section>
  );
}

export default HeroSection;
