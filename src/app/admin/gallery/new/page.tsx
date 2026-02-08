// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import AlbumForm from "@/components/admin/AlbumForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Album Baru</h1>
          <p className="text-muted-foreground">
            Buat album baru untuk mengelompokkan foto
          </p>
        </div>
      </div>

      <AlbumForm />
    </div>
  );
}
