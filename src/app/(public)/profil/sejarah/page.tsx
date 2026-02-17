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
      {/* Hero Section */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-masjid.webp"
              alt="Masjid Nurul Jannah"
              fill
              className="object-cover opacity-60"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Landmark className="h-4 w-4 text-white/80" />
              <span className="text-white/90 text-xs font-medium tracking-wider uppercase">
                {profile?.name || "Masjid Nurul Jannah"}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
              Sejarah Masjid
            </h1>
            <p className="text-white/70 text-sm md:text-base mt-3 max-w-lg mx-auto">
              Perjalanan dan kisah berdirinya masjid yang penuh berkah
            </p>
          </div>
        </div>
      </section>

      {/* Back link + Content */}
      <section className="px-4 md:px-0 w-full md:w-[96%] max-w-4xl mx-auto py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Profil
        </Link>

        {profile?.history ? (
          <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sejarah Masjid
                </h2>
                <p className="text-sm text-gray-400">
                  Kisah perjalanan {profile.name || "Masjid Nurul Jannah"}
                </p>
              </div>
            </div>

            {/* History Content */}
            <div
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-semibold prose-h3:text-lg prose-h3:font-semibold prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-li:text-gray-600 prose-li:text-sm md:prose-li:text-base prose-blockquote:border-l-purple-300 prose-blockquote:text-gray-500 prose-strong:text-gray-800"
              dangerouslySetInnerHTML={{ __html: profile.history }}
            />
          </article>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <History className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">
              Sejarah masjid belum tersedia.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Silakan isi di Admin → Pengaturan → Informasi Masjid.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
