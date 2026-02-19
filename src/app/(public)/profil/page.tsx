import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMosqueProfile } from "@/actions/public";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Target, Eye, History, Users, MessageCircle } from "lucide-react";
import { getDkmMembers } from "@/actions/public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SECTION_CONFIG: { key: string; label: string; type: "compact" | "cards" | "bidang" }[] = [
  { key: "PEMBINA", label: "Pembina", type: "compact" },
  { key: "PENASEHAT", label: "Penasehat", type: "compact" },
  { key: "BPH", label: "Badan Pengurus Harian", type: "cards" },
  { key: "IMAM", label: "Imam Masjid", type: "cards" },
  { key: "GHARIM", label: "Gharim (Petugas Harian)", type: "compact" },
  { key: "BIDANG_DAKWAH", label: "Bidang Dakwah", type: "bidang" },
  { key: "BIDANG_FARDHU_KIFAYAH", label: "Bidang Fardhu Kifayah", type: "bidang" },
  { key: "BIDANG_PENDIDIKAN", label: "Bidang Pendidikan", type: "bidang" },
  { key: "BIDANG_PEMBANGUNAN", label: "Bidang Pembangunan", type: "bidang" },
  { key: "BIDANG_REMAJA", label: "Bidang Remaja Masjid", type: "bidang" },
  { key: "BIDANG_KEBERSIHAN", label: "Bidang Kebersihan & Keamanan", type: "bidang" },
  { key: "BIDANG_SARANA", label: "Bidang Sarana & Prasarana", type: "bidang" },
  { key: "BIDANG_PERWIRITAN", label: "Bidang Perwiritan Ibu-Ibu", type: "bidang" },
];

function MemberAvatar({ name, photo, size = "md" }: { name: string; photo: string | null; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-20 w-20" : size === "md" ? "h-14 w-14" : "h-9 w-9";
  const textSize = size === "lg" ? "text-xl" : size === "md" ? "text-sm" : "text-xs";
  return (
    <Avatar className={`${sizeClass} ring-2 ring-white shadow-sm`}>
      <AvatarImage src={photo || ""} alt={name} />
      <AvatarFallback className={`bg-emerald-50 text-emerald-600 font-bold ${textSize}`}>
        {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

async function DkmSection() {
  const members = await getDkmMembers();

  if (members.length === 0) {
    return <p className="text-gray-400 italic">Data pengurus belum tersedia.</p>;
  }

  // Group members by section
  const grouped = SECTION_CONFIG.map(({ key, label, type }) => ({
    key,
    label,
    type,
    members: members.filter((m: any) => m.section === key),
  })).filter((g) => g.members.length > 0);

  return (
    <div className="space-y-10">
      {/* Period Badge */}
      {members[0]?.period && (
        <div className="text-center">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 px-5 py-1.5 text-xs font-semibold">
            Periode {members[0].period}
          </Badge>
        </div>
      )}

      {grouped.map(({ key, label, type, members: sectionMembers }) => (
        <div key={key}>
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{label}</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
          </div>

          {/* Compact type: simple inline list */}
          {type === "compact" && (
            <div className="text-center space-y-1">
              {sectionMembers.map((m: any) => (
                <p key={m.id} className="text-sm text-gray-700">
                  <span className="font-medium">{m.name}</span>
                  {m.position !== label && m.position !== "Pembina" && m.position !== "Penasehat" && (
                    <span className="text-gray-400 ml-1.5">— {m.position}</span>
                  )}
                </p>
              ))}
            </div>
          )}

          {/* Cards type: prominent member cards (BPH, Imam) */}
          {type === "cards" && (
            <div className={`grid gap-3 ${sectionMembers.length <= 2 ? "md:grid-cols-2" : sectionMembers.length <= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {sectionMembers.map((m: any) => (
                <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-emerald-100 hover:shadow-sm transition-all group">
                  <MemberAvatar name={m.name} photo={m.photo} size={key === "BPH" ? "lg" : "md"} />
                  <h4 className="font-bold text-gray-900 mt-3 mb-1 text-sm">{m.name}</h4>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {m.position}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bidang type: coordinator + members */}
          {type === "bidang" && (() => {
            const koordinator = sectionMembers.find((m: any) => m.position === "Koordinator");
            const anggota = sectionMembers.filter((m: any) => m.position !== "Koordinator");
            return (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Koordinator */}
                  {koordinator && (
                    <div className="flex items-center gap-3 sm:min-w-[200px]">
                      <MemberAvatar name={koordinator.name} photo={koordinator.photo} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{koordinator.name}</p>
                        <p className="text-[11px] text-emerald-600 font-medium">Koordinator</p>
                      </div>
                    </div>
                  )}
                  {/* Divider */}
                  {koordinator && anggota.length > 0 && (
                    <div className="hidden sm:block w-px h-10 bg-gray-100 mx-2" />
                  )}
                  {/* Anggota */}
                  {anggota.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {anggota.map((m: any) => (
                        <span key={m.id} className="text-sm text-gray-600">{m.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ))}
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
      {/* Hero Section - Floating Style - Mobile: px-4, Desktop: w-[96%] */}
      <section className="px-4 md:px-0 pt-4 md:pt-6">
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-3xl w-full md:w-[96%] max-w-7xl mx-auto bg-black">
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
          <div className="container relative z-10 mx-auto px-4 text-center pb-10">
            <Badge variant="outline" className="mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
              Tentang Kami
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 md:mb-4 drop-shadow-sm">{profile.name}</h1>
            <p className="text-white/70 text-sm md:text-base mt-3 max-w-lg mx-auto">
              Pusat Ibadah, Dakwah, dan Pendidikan Islam
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto w-full md:w-[96%] max-w-7xl px-4 md:px-0 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {profile.description && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <History className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tentang Masjid</h2>
                </div>
                <div
                  className="prose prose-gray max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-headings:text-gray-900 prose-li:text-gray-600 prose-li:text-sm md:prose-li:text-base prose-img:rounded-lg prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: profile.description }}
                />
              </div>
            )}

            {/* Vision */}
            {profile.vision && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Visi</h2>
                </div>
                <div
                  className="prose prose-gray max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-headings:text-gray-900 prose-li:text-gray-600 prose-li:text-sm md:prose-li:text-base prose-img:rounded-lg prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: profile.vision }}
                />
              </div>
            )}

            {/* Mission */}
            {profile.mission && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Misi</h2>
                </div>
                <div
                  className="prose prose-gray max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-headings:text-gray-900 prose-li:text-gray-600 prose-li:text-sm md:prose-li:text-base prose-img:rounded-lg prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: profile.mission }}
                />
              </div>
            )}

            {/* History - Link to dedicated page */}
            {profile.history && (
              <Link href="/profil/sejarah" className="block group">
                <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 hover:border-purple-200 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Sejarah Masjid</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Kisah perjalanan {profile.name}</p>
                      </div>
                    </div>
                    <span className="text-purple-500 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                      Selengkapnya →
                    </span>
                  </div>
                </div>
              </Link>
            )}
            
            {/* Struktur DKM Section */}
            <div id="struktur-dkm" className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Struktur DKM</h2>
                </div>
                <DkmSection />
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Informasi Kontak</h3>
              <div className="space-y-5">
                {profile.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Alamat</p>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {profile.address}
                      </p>
                    </div>
                  </div>
                )}

                {profile.contacts && profile.contacts.length > 0 ? (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Kontak Pengurus</p>
                      <div className="space-y-2 mt-1">
                        {profile.contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-500 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">{contact.label}:</span>{" "}
                              <span>{contact.phone}</span>
                            </div>
                            {contact.link && (
                              <a
                                href={contact.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors flex-shrink-0"
                                aria-label={`WhatsApp ${contact.label}`}
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : profile.phone ? (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Telepon</p>
                      <p className="text-gray-500 text-sm">
                        {profile.phone}
                      </p>
                    </div>
                  </div>
                ) : null}

                {profile.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Email</p>
                      <p className="text-gray-500 text-sm">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Map Embed */}
                <div className="pt-4 border-t border-gray-50 mt-2">
                  <p className="font-medium text-sm text-gray-900 mb-3">Lokasi</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
