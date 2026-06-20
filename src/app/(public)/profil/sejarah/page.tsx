export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMosqueProfile } from "@/actions/public";
import { History, ArrowLeft, Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Sejarah Masjid",
  description: "Sejarah dan perjalanan Masjid Nurul Jannah",
};

export default async function SejarahPage() {
  const profile = await getMosqueProfile();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Floating Style */}
      <section className="relative w-auto h-[300px] md:h-[400px] mt-[10px] mx-[10px] mb-[10px] md:mt-[20px] md:mx-[20px] md:mb-[20px] flex flex-col items-center justify-center overflow-hidden rounded-[16px] md:rounded-[24px] isolate bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px] md:rounded-[24px]">
          <Image
            src="/hero-masjid.jpg"
            alt="Hero Background"
            fill
            className="object-cover object-[center_25%] opacity-80"
            priority
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-[2]" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center pt-[73px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-3 md:mb-4">
            <Landmark className="h-4 w-4 text-white/80" />
            <span className="text-white/90 text-xs font-medium tracking-wider uppercase">
              {profile?.name || "Masjid Nurul Jannah"}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
            Sejarah Masjid
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-2 md:mt-3 max-w-[90%] md:max-w-lg mx-auto drop-shadow-sm">
            Perjalanan dan kisah berdirinya masjid yang penuh berkah
          </p>
        </div>
      </section>

      {/* Back link + Content */}
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Profil
        </Link>

        {profile?.history ? (
          <article className="bg-white rounded-2xl md:rounded-[24px] border border-gray-200 p-6 md:p-12">
            {/* Section Header */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-500 font-bold text-lg">//</span>
                <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Sejarah Masjid</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 mb-2">
                Kisah Perjalanan {profile.name || "Masjid Nurul Jannah"}
              </h2>
            </div>

            {/* History Content */}
            <div
              className="prose prose-zinc max-w-none prose-headings:text-zinc-900 prose-h1:text-2xl prose-h1:font-serif prose-h1:font-bold prose-h2:text-xl prose-h2:font-serif prose-h2:font-semibold prose-h3:text-lg prose-h3:font-semibold prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-[15px] sm:prose-p:text-base prose-li:text-zinc-600 prose-li:text-[15px] sm:prose-li:text-base prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:text-zinc-700 prose-blockquote:not-italic prose-strong:text-zinc-900"
              dangerouslySetInnerHTML={{ __html: profile.history }}
            />
          </article>
        ) : (
          <div className="bg-white rounded-2xl md:rounded-[24px] border border-gray-200 p-10 md:p-16 text-center">
            <div className="bg-zinc-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <History className="h-10 w-10 text-zinc-300" />
            </div>
            <p className="text-zinc-500 text-sm">
              Sejarah masjid belum tersedia.
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              Silakan isi di Admin → Pengaturan → Informasi Masjid.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
