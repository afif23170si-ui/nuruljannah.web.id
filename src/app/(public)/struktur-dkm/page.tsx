import { Metadata } from "next";
import Image from "next/image";
import { getDkmMembers } from "@/actions/public";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Struktur DKM",
  description: "Struktur organisasi Dewan Kemakmuran Masjid Nurul Jannah.",
};

export default async function StrukturDkmPage() {
  const members = await getDkmMembers();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Users className="h-3 w-3 mr-1" />
            Pengurus Masjid
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Struktur DKM</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dewan Kemakmuran Masjid Nurul Jannah yang bertugas mengelola dan memakmurkan masjid
          </p>
        </div>
      </section>

      {/* Members Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {members.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Data pengurus belum tersedia.
          </div>
        ) : (
          <>
            {/* Period Badge */}
            {members[0]?.period && (
              <div className="text-center mb-10">
                <Badge variant="secondary" className="text-sm px-4 py-1">
                  Periode {members[0].period}
                </Badge>
              </div>
            )}

            {/* Leadership - First 2 members */}
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-10">
              {members.slice(0, 2).map((member) => (
                <Card
                  key={member.id}
                  className="card-hover border-2 border-primary/10"
                >
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                      <AvatarImage src={member.photo || ""} alt={member.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <Badge variant="default" className="mb-3">
                      {member.position}
                    </Badge>
                    {member.phone && (
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Other members */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.slice(2).map((member) => (
                <Card key={member.id} className="card-hover">
                  <CardContent className="p-5 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={member.photo || ""} alt={member.name} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
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
          </>
        )}
      </div>
    </div>
  );
}
