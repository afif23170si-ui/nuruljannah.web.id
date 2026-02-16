// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import AlbumForm from "@/components/admin/AlbumForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
       <AdminPageHeader 
          title="Album Baru" 
          description="Buat album baru untuk mengelompokkan foto"
          breadcrumbs={[
              { label: "Dashboard", href: "/admin" },
              { label: "Galeri", href: "/admin/gallery" },
              { label: "Buat Baru" }
          ]}
        />
      <AlbumForm />
    </div>
  );
}
