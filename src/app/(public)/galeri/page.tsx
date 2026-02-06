import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getActiveAlbums } from "@/actions/gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            Dokumentasi
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Foto</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dokumentasi kegiatan dan momen berharga di Masjid Nurul Jannah
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {albums.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Album</h3>
            <p className="text-muted-foreground">
              Album foto akan ditampilkan di sini
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link key={album.id} href={`/galeri/${album.slug}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  {/* Cover Image */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Images className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Photo count */}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        <Camera className="h-3 w-3 mr-1" />
                        {album._count.images} foto
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                      {album.title}
                    </CardTitle>
                    {album.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {album.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
