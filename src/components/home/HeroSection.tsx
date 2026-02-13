"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { PrayerTimesWidget } from "./PrayerTimesWidget";
import { DateDisplay } from "./DateDisplay";
import { IslamicCountdown } from "./IslamicCountdown";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  return (
    <section className="relative w-full min-h-[calc(100vh-69px)] [.has-announcement_&]:min-h-[calc(100vh-105px)] h-auto m-0 flex flex-col items-center justify-end overflow-hidden transition-[min-height] duration-500 ease-in-out">
      
      {/* Background Image */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-emerald-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-masjid.jpg"
        >
          <source src="/hero-masjid.webm" type="video/webm" />
          <source src="/hero-masjid.mp4" type="video/mp4" />
          {/* Fallback image if video fails or not supported */}
          <Image
            src="/hero-masjid.jpg"
            alt="Masjid Nurul Jannah"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </video>
        {/* Dark Overlay 40% */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 z-[1]" />






        {/* Date Display - Desktop (below notch, centered) */}
        <div className="hidden md:flex absolute top-[30px] left-0 right-0 z-[4] justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 pointer-events-auto">
            <DateDisplay variant="hero" />
          </div>
        </div>
        

      </div>

      {/* Centered Content with Space Between for Widget */}
      <div className="relative z-10 container px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-end justify-between h-full pb-20 md:pb-12 pt-28 md:pt-0 w-full">
        
        {/* Left Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">

          {/* Date Display - Mobile Only */}
          <div className="md:hidden mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <DateDisplay variant="hero" />
            </div>
          </div>

          {/* Islamic Event Countdown */}
          <div className="mb-4 md:mb-6">
            <IslamicCountdown />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-3 md:mb-4 leading-[1.1] relative z-10 max-w-4xl">
            Cahaya Ibadah dalam <br />
            Kehangatan Ukhuwah
          </h1>

          <p className="text-base md:text-lg text-white/90 leading-relaxed font-light font-sans drop-shadow-md max-w-2xl mb-6 md:mb-10 text-center md:text-left">
            Membentuk ukhuwah islamiyah melalui masjid yang inklusif, modern, 
            dan transparan bagi seluruh lapisan masyarakat.
          </p>

          <div className="flex flex-row gap-3 sm:gap-4 w-full md:w-auto items-center md:items-start justify-center md:justify-start mb-8 md:mb-0">
            <Link href="/profil" className="flex-1 md:flex-none">
              <Button size="lg" className="w-full md:w-auto h-11 md:h-11 px-8 rounded-full text-base gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all hover:scale-105 border-0">
                Profil Masjid
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content: Prayer Times Widget */}
        <div className="relative z-20 w-full md:w-auto flex flex-col items-center md:items-end mt-auto md:mt-0 md:ml-auto">
           <PrayerTimesWidget location="Kota Dumai" />
        </div>

      </div>

    </section>
  );
}

export default HeroSection;
