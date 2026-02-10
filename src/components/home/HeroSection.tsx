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
    <section className="relative w-[calc(100%-20px)] md:w-[calc(100%-40px)] h-[calc(100vh-20px)] md:h-[calc(100vh-40px)] m-[10px] md:m-[20px] flex flex-col items-center justify-end overflow-hidden rounded-[20px] md:rounded-[35px]">
      
      {/* Background Image */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-emerald-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/bg-sw.webm" type="video/webm" />
        </video>
        {/* Dark Overlay 40% */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 z-[1]" />




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
      <div className="relative z-10 container px-4 sm:px-6 flex flex-col items-center md:items-start text-center md:text-left pb-0 md:pb-4 justify-end h-full md:h-auto mb-4 md:mb-0">
        


        {/* Ramadan Countdown Card - Moved Above Title */}
        {/* Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs md:text-sm font-medium text-white/90 tracking-wide">
            Selamat datang di website Nurul Jannah
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-3 md:mb-4 leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] relative z-10 max-w-4xl">
          Cahaya Ibadah dalam <br />
          Kehangatan Ukhuwah
        </h1>

        {/* Subtitle (Repositioned Here) */}
        <p className="text-base md:text-lg text-white/90 leading-relaxed font-light font-sans drop-shadow-md max-w-2xl mb-8 md:mb-10 text-center md:text-left">
          Membentuk ukhuwah islamiyah melalui masjid yang inklusif, modern, 
          dan transparan bagi seluruh lapisan masyarakat.
        </p>

        {/* CTA Buttons - Restored */}
        <div className="flex flex-row gap-3 sm:gap-4 w-full md:w-auto mb-8 md:mb-12 items-center md:items-start justify-center md:justify-start">
          <Link href="/profil" className="flex-1 md:flex-none">
            <Button size="lg" className="w-full md:w-auto h-11 md:h-11 px-8 rounded-full text-base gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all hover:scale-105 border-0">
              Profil Masjid
            </Button>
          </Link>
        </div>

        {/* Bottom Content Area - Can be used for something else later */}
        <div className="mt-0 flex flex-col md:flex-row items-center md:items-end gap-6 w-full max-w-4xl">
        </div>

      </div>

      {/* Prayer Times Widget - Desktop: Absolute Bottom Right (Shifted Left), Mobile: Relative Bottom */}
      <div className="relative md:absolute md:bottom-[50px] md:right-20 z-20 w-full md:w-auto px-4 md:px-0 pb-6 md:pb-0 mt-4 md:mt-0 flex flex-col items-center md:block">
         <PrayerTimesWidget location="Kota Dumai" />
      </div>

    </section>
  );
}

export default HeroSection;
