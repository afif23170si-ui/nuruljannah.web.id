// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = {
  title: "Buat Artikel Baru",
  description: "Buat artikel baru",
};

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/artikel">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Buat Artikel Baru</h1>
          <p className="text-muted-foreground">
            Tulis artikel, berita, atau pengumuman baru
          </p>
        </div>
      </div>

      {/* Form */}
      <ArticleForm />
    </div>
  );
}
