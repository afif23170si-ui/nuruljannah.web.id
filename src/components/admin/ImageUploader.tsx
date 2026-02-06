"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addImageToAlbum, deleteImage, setAlbumCover } from "@/actions/gallery";
import { createClient } from "@supabase/supabase-js";
import { 
  Upload, 
  Loader2, 
  Trash2, 
  Image as ImageIcon, 
  Star,
  X,
} from "lucide-react";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GalleryImage {
  id: string;
  title: string | null;
  imageUrl: string;
  order: number;
}

interface ImageUploaderProps {
  albumId: string;
  albumCover: string | null;
  images: GalleryImage[];
  onUpdate: () => void;
}

export default function ImageUploader({
  albumId,
  albumCover,
  images,
  onUpdate,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gallery/${albumId}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Gagal upload ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        // Save to database
        await addImageToAlbum(albumId, urlData.publicUrl, file.name);
      }

      toast.success(`${files.length} gambar berhasil diupload`);
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Hapus gambar ini?")) return;

    setDeleting(image.id);
    try {
      // Extract path from URL for Supabase deletion
      const url = new URL(image.imageUrl);
      const pathParts = url.pathname.split("/storage/v1/object/public/media/");
      if (pathParts.length > 1) {
        await supabase.storage.from("media").remove([pathParts[1]]);
      }

      await deleteImage(image.id);
      toast.success("Gambar berhasil dihapus");
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus gambar");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetCover = async (imageUrl: string) => {
    try {
      await setAlbumCover(albumId, imageUrl);
      toast.success("Cover album diperbarui");
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah cover");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Gambar ({images.length})
          </span>
          <div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Gambar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada gambar di album ini</p>
            <p className="text-sm">Klik tombol Upload untuk menambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title || "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {/* Cover badge */}
                {albumCover === image.imageUrl && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Cover
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {albumCover !== image.imageUrl && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetCover(image.imageUrl)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image)}
                    disabled={deleting === image.id}
                  >
                    {deleting === image.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
