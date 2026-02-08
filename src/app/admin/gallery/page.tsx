import Link from "next/link";
import { getAlbums, deleteAlbum } from "@/actions/gallery";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Images, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Images className="h-8 w-8 text-emerald-600" />
            Galeri
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola album dan foto kegiatan masjid
          </p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Album
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Album</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Album Aktif</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {albums.filter((a) => a.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Foto</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {albums.reduce((sum, a) => sum + a._count.images, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Images className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Album</h3>
            <p className="text-muted-foreground text-center mb-4">
              Buat album pertama untuk mulai mengupload foto kegiatan
            </p>
            <Link href="/admin/gallery/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Album Pertama
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden">
              {/* Cover Image */}
              <div className="relative aspect-video bg-muted">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Images className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant={album.isActive ? "default" : "secondary"}>
                    {album.isActive ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <EyeOff className="h-3 w-3 mr-1" />
                    )}
                    {album.isActive ? "Aktif" : "Draft"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-1">{album.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {album.description || "Tidak ada deskripsi"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {album._count.images} foto
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/gallery/${album.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteAlbum(album.id);
                      }}
                    >
                      <Button size="sm" variant="outline" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
