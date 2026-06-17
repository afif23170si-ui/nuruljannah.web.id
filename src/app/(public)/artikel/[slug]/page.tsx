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
      <section className="px-4 md:px-0">
        <div className="relative h-[300px] md:h-[400px] flex flex-col justify-end overflow-hidden rounded-[15px] md:rounded-2xl w-[96%] max-w-7xl mx-auto bg-black p-6 md:p-10">
          {/* Background Image (Using Post Cover or fallback) */}
          <div className="absolute inset-0 z-0">
            <Image
              src={post.coverImage || "/hero-masjid.webp"}
              alt={post.title}
              fill
              className="object-cover opacity-50"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Dark Overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
          </div>
          
          {/* Content Box */}
          <div className="relative z-10 w-full mt-auto">
            <Link href="/artikel" className="inline-block mb-3 md:mb-6">
              <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full px-4 h-8 text-xs font-medium">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Kembali
              </Button>
            </Link>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <Badge variant="outline" className="py-1 px-3 bg-white/10 border-white/20 text-white backdrop-blur-md text-[10px] sm:text-xs">
                {CATEGORY_LABELS[post.category] || post.category}
              </Badge>
              {post.publishedAt && (
                <Badge variant="outline" className="py-1 px-3 bg-black/30 border-white/10 text-white/80 backdrop-blur-md text-[10px] sm:text-xs">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                  {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: id })}
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 md:mb-4 max-w-[90%] md:max-w-4xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-white/80 text-sm mt-2 md:mt-3">
               <User className="h-4 w-4" />
               {post.author.name}
            </div>
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
