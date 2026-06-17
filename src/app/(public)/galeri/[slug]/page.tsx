import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlbumBySlug } from "@/actions/gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Camera, Play } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import GalleryViewer from "./GalleryViewer";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  
  if (!album) {
    return { title: "Album Tidak Ditemukan" };
  }

  return {
    title: album.title,
    description: album.description || `Galeri foto ${album.title}`,
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Hero Section - Option A: Minimalist Split */}
      <section className="px-4 md:px-6 pt-8 pb-4 md:pt-12 md:pb-8 w-full md:w-[96%] max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Link href="/galeri" className="inline-block mb-6 md:mb-10 group">
          <Button variant="ghost" size="sm" className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm rounded-full px-4 h-9 text-[13px] font-medium transition-all group-hover:-translate-x-1">
            <ArrowLeft className="mr-2 h-4 w-4 text-emerald-600" />
            Kembali ke Galeri
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left / Top: Content Box */}
          <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[54px] font-bold text-gray-900 dark:text-white tracking-tight mb-4 leading-[1.1]">
              {album.title}
            </h1>
            
            {album.description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                {album.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-md">
                <Camera className="h-4 w-4 text-emerald-500" />
                <span>{album.images.length} Foto</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-md">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>{format(new Date(album.createdAt), "d MMMM yyyy", { locale: id })}</span>
              </div>
            </div>
          </div>

          {/* Right / Bottom: Cover Image */}
          <div className="md:col-span-7 relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg order-1 md:order-2">
            {album.coverImage ? (
              <Image
                src={album.coverImage}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                 <Camera className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
            )}
            {/* Subtle inner shadow/border overlay */}
            <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* Gallery Grid */}
      <div className="mx-auto w-full md:w-[96%] max-w-7xl px-4 md:px-0 py-10 md:py-16">
        {album.images.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Camera className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada foto di album ini</p>
          </div>
        ) : (
          <GalleryViewer images={album.images} />
        )}
      </div>
    </div>
  );
}
