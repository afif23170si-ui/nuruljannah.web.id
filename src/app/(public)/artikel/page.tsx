import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/actions/public";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, ArrowRight, BookOpen, Newspaper, Bell, Mic } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel & Berita",
  description: "Artikel dakwah, berita terbaru, dan pengumuman dari Masjid Nurul Jannah.",
};

const CATEGORY_INFO: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  ARTIKEL: { label: "Artikel", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  BERITA: { label: "Berita", icon: Newspaper, color: "bg-green-500/10 text-green-600" },
  PENGUMUMAN: { label: "Pengumuman", icon: Bell, color: "bg-amber-500/10 text-amber-600" },
  KAJIAN: { label: "Ringkasan Kajian", icon: Mic, color: "bg-purple-500/10 text-purple-600" },
  KHUTBAH: { label: "Ringkasan Khutbah", icon: Mic, color: "bg-emerald-500/10 text-emerald-600" },
};

function PostCard({ post }: { post: Awaited<ReturnType<typeof getPublishedPosts>>[0] }) {
  const categoryInfo = CATEGORY_INFO[post.category] || CATEGORY_INFO.ARTIKEL;
  const CategoryIcon = categoryInfo.icon;

  return (
    <Card className="card-hover overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      <CardContent className="p-5">
        {/* Category Badge */}
        <Badge variant="outline" className={`mb-3 ${categoryInfo.color}`}>
          <CategoryIcon className="h-3 w-3 mr-1" />
          {categoryInfo.label}
        </Badge>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/artikel/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author.name}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(post.publishedAt), "d MMM yyyy", { locale: id })}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <Link href={`/artikel/${post.slug}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full gap-2">
            Baca Selengkapnya
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default async function ArtikelPage() {
  const allPosts = await getPublishedPosts();

  // Group posts by category for tabs
  const categories = ["ALL", "ARTIKEL", "BERITA", "PENGUMUMAN", "KAJIAN", "KHUTBAH"];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 md:px-0">
        <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-[15px] md:rounded-2xl w-[96%] max-w-7xl mx-auto bg-black">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-masjid.webp"
              alt="Masjid Nurul Jannah"
              fill
              className="object-cover opacity-80"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 text-center pb-8 md:pb-10">
            <Badge variant="outline" className="mb-3 md:mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
              <BookOpen className="h-3 w-3 mr-1.5 inline-block" />
              Media Dakwah
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
              Artikel & Berita
            </h1>
            <p className="text-white/70 text-sm md:text-base mt-2 md:mt-3 max-w-[90%] md:max-w-lg mx-auto">
              Artikel dakwah, berita kegiatan masjid, dan pengumuman penting
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {allPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <Tabs defaultValue="ALL" className="w-full">
            {/* Category Tabs */}
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent justify-center mb-8">
              {categories.map((cat) => {
                const count = cat === "ALL" 
                  ? allPosts.length 
                  : allPosts.filter((p) => p.category === cat).length;
                
                if (count === 0 && cat !== "ALL") return null;
                
                const info = cat === "ALL" 
                  ? { label: "Semua", color: "" } 
                  : CATEGORY_INFO[cat];
                
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {info?.label || cat} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Content */}
            {categories.map((cat) => {
              const posts = cat === "ALL" 
                ? allPosts 
                : allPosts.filter((p) => p.category === cat);
              
              if (posts.length === 0 && cat !== "ALL") return null;
              
              return (
                <TabsContent key={cat} value={cat}>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}
