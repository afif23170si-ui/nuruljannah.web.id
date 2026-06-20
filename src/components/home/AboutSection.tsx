"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutSection({ hideImage = false, description, heading }: { hideImage?: boolean; description?: string | null; heading?: string | null }) {
  return (
    <section className={`${hideImage ? 'py-10 md:py-16' : 'py-20 md:py-32'} bg-white`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className={`flex flex-col ${hideImage ? '' : 'lg:flex-row gap-16 lg:gap-24 items-center'}`}>
          
          {/* Left Side: Clean Image */}
          {!hideImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-zinc-100">
                <Image 
                  src="/hero-masjid.webp" 
                  alt="Tentang Masjid Nurul Jannah" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Right Side: Minimalist Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className={`w-full ${hideImage ? 'flex flex-col lg:flex-row gap-6 lg:gap-20 items-start' : 'lg:w-1/2 flex flex-col items-start'}`}
          >
            
            <div className={hideImage ? 'w-full lg:w-5/12 flex flex-col items-start' : 'w-full flex flex-col items-start mb-6'}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-500 font-bold text-lg">//</span>
                <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Tentang Kami</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 leading-tight">
                {heading || (<>Menyemai Kebaikan, <br className="hidden lg:block" />Membangun Ukhuwah.</>)}
              </h2>
            </div>
            
            <div className={hideImage ? 'w-full lg:w-7/12 flex flex-col items-start' : 'w-full'}>
              <div className="space-y-4 sm:space-y-5 text-zinc-600 text-[15px] sm:text-base leading-relaxed font-light mb-8">
                {description ? (
                  <div
                    className="prose prose-zinc max-w-none prose-p:my-0 prose-p:text-zinc-600 prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-relaxed prose-p:font-light"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <>
                    <p>
                      Masjid Nurul Jannah bukan sekadar bangunan fisik tempat bersujud. Kami adalah ruang temu bagi masyarakat untuk merawat keimanan, mempererat tali persaudaraan, dan menebar manfaat ke lingkungan sekitar.
                    </p>
                    <p>
                      Dengan pendekatan yang modern dan inklusif, kami berkomitmen menghadirkan pengelolaan masjid yang transparan serta berbagai program pendidikan yang relevan untuk generasi masa depan.
                    </p>
                  </>
                )}
              </div>

              <Link href="/profil/sejarah">
                <Button className="rounded-full pl-5 pr-1.5 gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                  <span className="font-medium">Baca selengkapnya</span>
                  <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 shrink-0 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  </div>
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;
