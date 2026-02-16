// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getAlbums, deleteAlbum } from "@/actions/gallery";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Images, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Galeri Foto" 
        description="Kelola album dan dokumentasi kegiatan masjid"
        action={
          <Link href="/admin/gallery/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Album
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="metron-card p-6 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Album</p>
               <h3 className="text-3xl font-bold text-gray-900">{albums.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <Images className="h-6 w-6" />
            </div>
        </div>
        <div className="metron-card p-6 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Album Aktif</p>
               <h3 className="text-3xl font-bold text-gray-900">{albums.filter((a) => a.isActive).length}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <Eye className="h-6 w-6" />
            </div>
        </div>
        <div className="metron-card p-6 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Foto</p>
               <h3 className="text-3xl font-bold text-gray-900">{albums.reduce((sum, a) => sum + a._count.images, 0)}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
               <Images className="h-6 w-6" />
            </div>
        </div>
      </div>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <AdminCard title="Daftar Album">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mb-4">
               <Images className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Album</h3>
            <p className="text-gray-500 mb-6">
              Buat album pertama untuk mulai mengupload foto kegiatan
            </p>
            <Link href="/admin/gallery/new">
              <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Buat Album Pertama
              </Button>
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.id} className="metron-card overflow-hidden group hover:border-blue-200 transition-all duration-300 hover:shadow-md">
              {/* Cover Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Images className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={`border-none ${album.isActive ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`}>
                    {album.isActive ? (
                      <div className="flex items-center gap-1"><Eye className="h-3 w-3" /> Aktif</div>
                    ) : (
                      <div className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Draft</div>
                    )}
                  </Badge>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 mb-1">{album.title}</h3>
                    <p className="text-gray-200 text-xs line-clamp-1 opacity-90">{album.description || "Tidak ada deskripsi"}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-white">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {album._count.images} FOTO
                </span>
                <div className="flex gap-1">
                  <Link href={`/admin/gallery/${album.id}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAlbum(album.id);
                    }}
                  >
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
