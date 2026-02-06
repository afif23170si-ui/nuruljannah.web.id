import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlbumBySlug } from "@/actions/gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Camera } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4">
          <Link href="/galeri">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Galeri
            </Button>
          </Link>
          
          <Badge variant="outline" className="mb-4">
            <Camera className="h-3 w-3 mr-1" />
            {album.images.length} Foto
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{album.title}</h1>
          
          {album.description && (
            <p className="text-muted-foreground max-w-2xl text-lg mb-4">
              {album.description}
            </p>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(album.createdAt), "d MMMM yyyy", { locale: id })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {album.images.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada foto di album ini</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {album.images.map((image: { id: string; imageUrl: string; title: string | null }, index: number) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title || `Foto ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  {image.title && (
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {image.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
