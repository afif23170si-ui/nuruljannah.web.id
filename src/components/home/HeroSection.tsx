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
        <Image
          src="/bg-nj.webp"
          alt="Masjid Nurul Jannah"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
        />
        {/* Dark Overlay 50% */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 z-[1]" />
        
        {/* Decorative Shape Bottom Right - Original Size & Opacity (Hidden on Mobile) */}
        <div className="hidden md:block absolute bottom-0 right-0 z-[2] w-auto pointer-events-none">
          <Image
            src="/shape-br.svg"
            alt="Decorative Shape"
            width={905}
            height={85}
            className="h-auto w-[60vw] md:w-auto max-w-[905px] object-contain object-bottom-right"
          />
        </div>

        {/* Animated Quran Quote Marquee (Hidden on Mobile) */}
        <div className="hidden md:block absolute bottom-0 md:bottom-3 left-0 md:left-[40%] right-0 z-[5] w-full md:w-[57%] overflow-hidden pointer-events-none opacity-80" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <motion.div 
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 10
            }}
          >
            <p className="text-emerald-800 text-sm md:text-lg font-serif italic tracking-wide px-4 drop-shadow-md mr-[100px]">
              "Sesungguhnya Aku ini adalah Allah, tidak ada Tuhan (yang hak) selain Aku, maka sembahlah Aku dan dirikanlah shalat untuk mengingat Aku." (QS. Ta-Ha: 14)
            </p>
            <p className="text-emerald-800 text-sm md:text-lg font-serif italic tracking-wide px-4 drop-shadow-md mr-[100px]">
              "Sesungguhnya Aku ini adalah Allah, tidak ada Tuhan (yang hak) selain Aku, maka sembahlah Aku dan dirikanlah shalat untuk mengingat Aku." (QS. Ta-Ha: 14)
            </p>
          </motion.div>
        </div>




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
        


        {/* Title */}
        {/* Title */}
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-3 md:mb-4 leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] relative z-10 max-w-4xl">
          Masjid <br />
          Nurul Jannah
        </h1>

        {/* CTA Buttons - Restored */}
        <div className="flex flex-row gap-3 sm:gap-4 w-full md:w-auto mb-8 md:mb-12 items-center md:items-start justify-center md:justify-start">
          <Link href="/jadwal-kajian" className="flex-1 md:flex-none">
            <Button size="lg" className="w-full md:w-auto h-11 md:h-11 px-4 sm:px-8 rounded-full text-xs sm:text-base gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 transition-all border border-amber-400/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] whitespace-nowrap">
              Jadwal Kajian
            </Button>
          </Link>
          <Link href="/profil" className="flex-1 md:flex-none">
            <Button size="lg" variant="outline" className="w-full md:w-auto h-11 md:h-11 px-4 sm:px-8 rounded-full text-xs sm:text-base gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 duration-300 shadow-lg whitespace-nowrap">
              Profil Masjid
            </Button>
          </Link>
        </div>

        {/* Bottom Content: Ramadan Card + Subtitle (moved here) */}
        <div className="mt-0 flex flex-col md:flex-row items-center md:items-end gap-6 w-full max-w-4xl">
            
            {/* Ramadan Countdown Card */}
            <div className="flex items-center gap-4 bg-white/95 backdrop-blur-sm p-3 pr-6 rounded-[15px] shadow-2xl shadow-black/20 w-full max-w-sm transform hover:scale-105 transition-all duration-300 cursor-default border border-white/20 shrink-0 mb-4 md:mb-8 text-left">
                <div className="h-[116px] w-[116px] relative rounded-[12px] overflow-hidden shrink-0 shadow-inner group">
                    <Image 
                      src="/ramadan-card.jpg" 
                      alt="Ramadhan" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="text-4xl font-bold font-sans text-emerald-950 leading-none tracking-tight">10</h3>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Hari Lagi</p>
                    <p className="text-xs text-zinc-500 font-medium leading-tight max-w-[140px]">
                       Menuju bulan suci Ramadhan 1447H
                    </p>
                </div>
            </div>

            {/* Subtitle (Repositioned Here) - Hidden on Mobile */}
            <p className="hidden md:block text-sm md:text-base text-white/90 leading-relaxed font-light font-sans drop-shadow-md max-w-[380px] pb-2 mb-24 ml-10 self-end text-left">
              Membentuk ukhuwah islamiyah melalui masjid yang inklusif, modern, 
              dan transparan bagi seluruh lapisan masyarakat.
            </p>

        </div>

      </div>

      {/* Prayer Times Widget - Desktop: Absolute Bottom Right (Shifted Left), Mobile: Relative Bottom */}
      <div className="relative md:absolute md:bottom-[122px] md:right-20 z-20 w-full md:w-auto px-4 md:px-0 pb-6 md:pb-0 mt-4 md:mt-0 flex flex-col items-center md:block">
         <PrayerTimesWidget location="Kota Dumai" />
      </div>

    </section>
  );
}

export default HeroSection;
