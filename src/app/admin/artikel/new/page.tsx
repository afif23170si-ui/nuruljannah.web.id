// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export const metadata: Metadata = {
  title: "Buat Artikel Baru",
  description: "Buat artikel baru",
};

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Buat Artikel Baru" 
        description="Tulis artikel, berita, atau pengumuman baru"
        breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Artikel", href: "/admin/artikel" },
            { label: "Buat Baru" }
        ]}
      />
      <ArticleForm />
    </div>
  );
}
