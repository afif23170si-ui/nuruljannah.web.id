"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlbumForm from "@/components/admin/AlbumForm";
import ImageUploader from "@/components/admin/ImageUploader";
import { getAlbumById } from "@/actions/gallery";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

interface AlbumData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  coverImage: string | null;
  images: Array<{
    id: string;
    title: string | null;
    imageUrl: string;
    order: number;
  }>;
}

export default function EditAlbumPage({ params }: EditAlbumPageProps) {
  const router = useRouter();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [albumId, setAlbumId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setAlbumId(p.id));
  }, [params]);

  useEffect(() => {
    if (albumId) {
      loadAlbum();
    }
  }, [albumId]);

  const loadAlbum = async () => {
    if (!albumId) return;
    setLoading(true);
    const data = await getAlbumById(albumId);
    if (!data) {
      router.push("/admin/gallery");
      return;
    }
    setAlbum(data);
    setLoading(false);
  };

  if (loading || !album) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Album</h1>
          <p className="text-muted-foreground">{album.title}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AlbumForm album={album} />
        <ImageUploader
          albumId={album.id}
          albumCover={album.coverImage}
          images={album.images}
          onUpdate={loadAlbum}
        />
      </div>
    </div>
  );
}
