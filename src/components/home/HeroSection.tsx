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
    <section className="relative w-[calc(100%-40px)] h-[calc(100vh-40px)] m-[20px] flex flex-col items-center justify-end overflow-hidden rounded-[35px]">
      
      {/* Background Image */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-emerald-950">
        <Image
          src="/bg-nj.webp"
          alt="Masjid Nurul Jannah"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay 50% */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />




        {/* Revalo Style - White Liquid Curve (Buzzer Curve) */}
        <div className="hidden md:block absolute top-0 left-0 right-0 h-[80px] z-[3] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
             {/* iPhone Notch Style (Dynamic Island) - Deepened for 10px Margin */}
             <path 
              d="M 400,0 C 420,0 440,0 450,20 C 460,40 460,66 490,66 L 950,66 C 980,66 980,40 990,20 C 1000,0 1020,0 1040,0 Z" 
              fill="#ffffff" 
            />
          </svg>
        </div>
        

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
