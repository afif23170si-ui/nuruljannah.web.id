import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getPublishedPosts } from "@/actions/public";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";
const CATEGORY_LABELS: Record<string, string> = {
  ARTIKEL: "Artikel",
  BERITA: "Berita",
  PENGUMUMAN: "Pengumuman",
  KAJIAN: "Ringkasan Kajian",
  KHUTBAH: "Ringkasan Khutbah",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: post.title,
    description: post.excerpt || `Baca artikel ${post.title} di Masjid Nurul Jannah`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Get related posts
  const allPosts = await getPublishedPosts(post.category, 4);
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cover */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4">
          {/* Back Button */}
          <Link href="/artikel" className="inline-flex mb-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Artikel
            </Button>
          </Link>

          {/* Category */}
          <Badge variant="outline" className="mb-4">
            {CATEGORY_LABELS[post.category] || post.category}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishedAt), "EEEE, d MMMM yyyy", {
                  locale: id,
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video relative rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                Bagikan artikel ini
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Artikel Terkait
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="card-hover">
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-3 text-xs">
                      {CATEGORY_LABELS[relatedPost.category]}
                    </Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/artikel/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.publishedAt && (
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(relatedPost.publishedAt), "d MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
