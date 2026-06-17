import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getActiveAlbums } from "@/actions/gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Camera } from "lucide-react";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto kegiatan dan dokumentasi Masjid Nurul Jannah",
};

export default async function GaleriPage() {
  const albums = await getActiveAlbums();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 md:px-0">
        <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-[15px] md:rounded-2xl w-[96%] max-w-7xl mx-auto bg-black">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-masjid.webp"
              alt="Masjid Nurul Jannah"
              fill
              className="object-cover opacity-80"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="container relative z-10 mx-auto text-center pb-8 md:pb-10 px-4">
            <Badge variant="outline" className="mb-3 md:mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
              <Images className="h-3 w-3 mr-1.5 inline-block" />
              Dokumentasi
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
              Galeri Foto
            </h1>
            <p className="text-white/70 text-sm md:text-base mt-2 md:mt-3 max-w-[90%] md:max-w-lg mx-auto">
              Merangkai kenangan, mengabadikan setiap momen penuh berkah dalam berbagai kegiatan dan syiar di Masjid Nurul Jannah.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto w-full md:w-[96%] max-w-7xl px-4 md:px-0 py-12 md:py-16">
        {albums.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum Ada Album</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Dokumentasi dan galeri foto kegiatan masjid akan segera hadir di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {albums.map((album) => (
              <Link key={album.id} href={`/galeri/${album.slug}`} className="block group flex flex-col gap-3 pb-2 pt-1">
                {/* Image Container (Hover Option 2 applied) */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-300">
                  {album.coverImage ? (
                    <Image src={album.coverImage} alt={album.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50"><Images className="h-10 w-10 text-gray-300" /></div>
                  )}
                  {/* Dark overlay that appears strongly on hover */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 pointer-events-none group-hover:bg-black/40" />
                  {/* View button that scales in */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-out delay-75">
                     <div className="bg-white/20 backdrop-blur-md text-white rounded-full p-3 border border-white/30">
                       <Images className="w-5 h-5" />
                     </div>
                  </div>
                </div>
                
                {/* Text Container (Minimalist Classic) */}
                <div className="flex items-start justify-between gap-4 px-1 mt-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-[15px] sm:text-base text-gray-900 dark:text-white leading-tight transition-colors line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {album.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {album.description || "Dokumentasi kegiatan masjid"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium shrink-0 pt-0.5">
                    <Camera className="w-4 h-4" />
                    <span>{album._count.images}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
