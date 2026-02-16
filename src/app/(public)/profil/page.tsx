import { Metadata } from "next";
import Image from "next/image";
import { getMosqueProfile } from "@/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Target, Eye, History, Users } from "lucide-react";
import { getDkmMembers } from "@/actions/public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function DkmSection() {
  const members = await getDkmMembers();

  if (members.length === 0) {
    return <p className="text-muted-foreground">Data pengurus belum tersedia.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Period Badge */}
      {members[0]?.period && (
        <div className="text-center">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            Periode {members[0].period}
          </Badge>
        </div>
      )}

      {/* Leadership - First 2 members */}
      <div className="grid gap-6 md:grid-cols-2">
        {members.slice(0, 2).map((member) => (
          <Card key={member.id} className="card-hover border-2 border-primary/10">
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                <AvatarImage src={member.photo || ""} alt={member.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <Badge variant="default" className="mb-3">
                {member.position}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Other members */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.slice(2).map((member) => (
          <Card key={member.id} className="card-hover">
            <CardContent className="p-5 text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={member.photo || ""} alt={member.name} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold mb-1">{member.name}</h3>
              <Badge variant="outline" className="text-xs">
                {member.position}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Masjid",
  description: "Profil lengkap Masjid Nurul Jannah - Sejarah, visi, misi, dan informasi kontak.",
};

export default async function ProfilPage() {
  const profile = await getMosqueProfile();

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Profil masjid belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/bg-nj.webp"
          alt="Masjid Nurul Jannah"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-white/30 text-white bg-white/10 backdrop-blur-sm">
            Tentang Kami
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white drop-shadow-lg">{profile.name}</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light">
            Pusat Ibadah, Dakwah, dan Pendidikan Islam
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {profile.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Tentang Masjid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Vision */}
            {profile.vision && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.vision}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mission */}
            {profile.mission && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Misi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.mission}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* History */}
            {profile.history && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Sejarah Masjid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.history}
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Struktur DKM Section */}
            <div id="struktur-dkm">
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Struktur DKM
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DkmSection />
                </CardContent>
                </Card>
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Alamat</p>
                      <p className="text-muted-foreground text-sm">
                        {profile.address}
                      </p>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Telepon</p>
                      <p className="text-muted-foreground text-sm">
                        {profile.phone}
                      </p>
                    </div>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-muted-foreground text-sm">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Map Embed */}
                <div className="pt-4 border-t">
                  <p className="font-medium text-sm mb-3">Lokasi</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31905.02528780722!2d101.47609448681641!3d1.6677856430902873!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d3afc6fd238d29%3A0xde7b2557466c5100!2sMasjid%20Nurul%20Jannah!5e0!3m2!1sid!2sid!4v1770197713908!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
