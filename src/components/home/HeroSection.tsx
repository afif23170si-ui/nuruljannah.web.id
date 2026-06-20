"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import BlurText from "@/components/ui/blur-text";

// Dynamic imports with matching skeletons for zero Layout Shift (CLS)
const DateDisplay = dynamic(() => import("./DateDisplay"), {
  ssr: false,
  loading: () => <div className="h-4 w-32 bg-white/5 animate-pulse rounded-full" />,
});

const IslamicCountdown = dynamic(() => import("./IslamicCountdown"), {
  ssr: false,
  loading: () => <div className="w-full md:w-[280px] h-[58px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl animate-pulse" />,
});

const PrayerTimesWidget = dynamic(() => import("./PrayerTimesWidget").then((mod) => mod.PrayerTimesWidget), {
  ssr: false,
  loading: () => <div className="w-full md:w-[280px] h-[130px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl animate-pulse" />,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const rightContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" as const } 
  },
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.8]);

  return (
    <section ref={ref} className="relative w-auto min-h-[calc(100vh-20px)] md:min-h-[calc(100vh-40px)] mt-[10px] mx-[10px] mb-[10px] md:mt-[20px] md:mx-[20px] md:mb-[20px] flex flex-col items-center justify-center overflow-hidden transition-[min-height] duration-500 ease-in-out rounded-[16px] md:rounded-[24px] isolate">

      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0 bg-emerald-950 overflow-hidden rounded-[16px] md:rounded-[24px]">
        <motion.div className="absolute inset-0 origin-top" style={{ scale, y }}>
          <Image
            src="/hero-masjid.jpg"
            alt="Masjid Nurul Jannah Fallback"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            // @ts-ignore
            fetchPriority="high"
          />
        </motion.div>



        {/* Dark Overlay 40% - 50% */}
        <motion.div className="absolute inset-0 bg-black z-[2]" style={{ opacity: overlayOpacity }} />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20 pt-[100px] md:pt-[120px] pb-10 relative z-10 flex-1 px-4">

        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto"
        >

          {/* Date Display */}
          <div className="mb-5 md:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <DateDisplay variant="hero" />
            </div>
          </div>

          <BlurText 
            text="Cahaya Ibadah dalam <br/> Kehangatan Ukhuwah"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-4 md:mb-6 leading-[1.1] relative z-10 max-w-4xl justify-center md:justify-start"
          />

          <motion.p variants={itemVariants} className="text-[15px] sm:text-base text-white/90 leading-relaxed font-light font-sans drop-shadow-md max-w-2xl mb-8 md:mb-10 text-center md:text-left">
            Membentuk ukhuwah islamiyah melalui masjid yang inklusif, <br className="hidden md:block" />
            modern, dan transparan bagi seluruh lapisan masyarakat.
          </motion.p>

          <div className="flex flex-row gap-3 sm:gap-4 w-full md:w-auto items-center justify-center">
            <Link href="/infaq" className="flex-1 md:flex-none">
              <Button className="w-full md:w-auto rounded-full pl-5 pr-1.5 gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                <span className="font-medium">Salurkan Infaq</span>
                <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 shrink-0 shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                </div>
              </Button>
            </Link>
            <Link href="/profil" className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full md:w-auto rounded-full gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
                Profil Masjid
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Content: Islamic Countdown & Prayer Times Dashboard */}
        <div className="relative z-20 w-full md:w-auto flex flex-col items-center md:items-end gap-4 md:ml-auto">
          <div className="w-full">
            <IslamicCountdown />
          </div>
          <div className="w-full">
            <PrayerTimesWidget />
          </div>
        </div>

      </div>

    </section>
  );
}

export default HeroSection;
