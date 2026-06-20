import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMosqueProfile } from "@/actions/public";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Target, Eye, History, Users, MessageCircle, Calendar, UserCheck, Map } from "lucide-react";
import { getDkmMembers } from "@/actions/public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AboutSection } from "@/components/home/AboutSection";
import { OrgChartScaler } from "@/components/profil/OrgChartScaler";

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
  const sizeClass = size === "lg" ? "h-16 w-16" : size === "md" ? "h-12 w-12" : "h-9 w-9";
  const textSize = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs";
  return (
    <Avatar className={`${sizeClass} border-2 border-emerald-500`}>
      <AvatarImage src={photo || ""} alt={name} className="object-cover" />
      <AvatarFallback className={`bg-emerald-50 text-emerald-600 font-bold ${textSize}`}>
        {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

const VLine = ({ h = "h-8" }: { h?: string }) => (
  <div className={`w-px ${h} bg-white/40 mx-auto`} />
);

async function DkmSection() {
  const members = await getDkmMembers();

  if (members.length === 0) {
    return <p className="text-zinc-400 italic text-center py-10">Data pengurus belum tersedia.</p>;
  }

  const getSection = (key: string) => members.filter((m: any) => m.section === key);

  const pembina = getSection("PEMBINA");
  const penasehat = getSection("PENASEHAT");
  const bph = getSection("BPH");
  const imam = getSection("IMAM");
  const gharim = getSection("GHARIM");
  
  const bidangKeys = [
    "BIDANG_DAKWAH", "BIDANG_FARDHU_KIFAYAH", "BIDANG_PENDIDIKAN", 
    "BIDANG_PEMBANGUNAN", "BIDANG_REMAJA", "BIDANG_KEBERSIHAN", 
    "BIDANG_SARANA", "BIDANG_PERWIRITAN"
  ];
  
  const bidangs = bidangKeys.map((key, index) => ({
    key,
    index: index + 1,
    label: SECTION_CONFIG.find(c => c.key === key)?.label || key,
    members: getSection(key)
  })).filter(b => b.members.length > 0);

  return (
    <OrgChartScaler>
        
        {/* Periode */}
        {members[0]?.period && (
          <div className="mb-8 relative z-10">
            <span style={{border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.375rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase'}}>
              Periode {members[0].period}
            </span>
          </div>
        )}

        {/* LEVEL 1: Pembina & Penasehat */}
        {(pembina.length > 0 || penasehat.length > 0) && (
          <div className="w-full flex flex-col items-center relative">
            <div className="flex gap-16 justify-center items-stretch">
              
              {pembina.length > 0 && (
                <div className="flex flex-col items-center relative">
                  <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-5 w-64 text-center relative z-10 flex-1">
                    <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-widest pb-3 mb-4">Pembina</h3>
                    <div className="space-y-2">
                      {pembina.map((m: any) => (
                        <p key={m.id} style={{color: '#18181b'}} className="font-semibold text-[15px]">{m.name}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="h-8 flex-shrink-0" />
                </div>
              )}

              {penasehat.length > 0 && (
                <div className="flex flex-col items-center relative">
                  <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-5 w-64 text-center relative z-10 flex-1">
                    <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-widest pb-3 mb-4">Penasehat</h3>
                    <div className="space-y-2">
                      {penasehat.map((m: any) => (
                        <p key={m.id} style={{color: '#18181b'}} className="font-semibold text-[15px]">{m.name}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="h-8 flex-shrink-0" />
                </div>
              )}
            </div>

            {/* Horizontal Line connecting Pembina and Penasehat down to BPH */}
            <div style={{width: '320px', height: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} />
            <VLine h="h-8" />
          </div>
        )}

        {/* LEVEL 2: BPH */}
        {bph.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-8 w-full max-w-3xl relative z-10">
               <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-widest text-center pb-4 mb-8">Badan Pengurus Harian (BPH)</h3>
               <div className="flex justify-center gap-12">
                  {bph.map((m: any) => (
                    <div key={m.id} className="flex flex-col items-center text-center">
                      <MemberAvatar name={m.name} photo={m.photo} size="lg" />
                      <h4 style={{color: '#18181b'}} className="font-bold mt-4 mb-1 text-[15px]">{m.name}</h4>
                      <span style={{color: '#52525b'}} className="text-xs font-medium">{m.position}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* LEVEL 3: Imam & Gharim */}
        {(imam.length > 0 || gharim.length > 0) && (
          <div className="w-full flex flex-col items-center relative">
            <VLine h="h-8" />
            
            {/* Horizontal branch for Imam & Gharim */}
            <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="w-[464px] block" />

            <div className="w-full max-w-4xl grid grid-cols-2 gap-8 pt-6 px-4">
              {/* Imam */}
              {imam.length > 0 && (
                <div className="flex flex-col items-center relative">
                  <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="absolute -top-6 left-1/2 h-6 block" />
                  <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-5 w-full h-full text-left relative z-10">
                    <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-wide pb-3 mb-4">Imam Masjid</h3>
                    <div className="text-[14px] leading-relaxed">
                      {imam.map((m: any) => (
                        <div key={m.id} className="mb-1">
                          <strong style={{color: '#52525b'}} className="font-semibold">{m.position}:</strong> <span style={{color: '#18181b'}}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Gharim */}
              {gharim.length > 0 && (
                <div className="flex flex-col items-center relative">
                  <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="absolute -top-6 left-1/2 h-6 block" />
                  <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-5 w-full h-full text-left relative z-10">
                    <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-wide pb-3 mb-4">Gharim / Petugas</h3>
                    <div className="text-[14px] leading-relaxed">
                      {gharim.map((m: any) => (
                        <div key={m.id} className="mb-1">
                          <strong style={{color: '#52525b'}} className="font-semibold">{m.position}:</strong> <span style={{color: '#18181b'}}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Trunk continuing down to Bidang */}
            <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="absolute left-1/2 top-8 h-[calc(100%-32px)] -z-0 block" />
          </div>
        )}

        {/* LEVEL 4: Bidang-Bidang */}
        {bidangs.length > 0 && (
          <div className="w-full flex flex-col items-center relative">
            <VLine h="h-8" />
            
            {/* The main horizontal branch for the Bidang Grid */}
            <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className="w-[calc(66.666%-16px)] block" />

            <div className="w-full flex flex-wrap justify-center gap-6 pt-6 px-4">
              
              {bidangs.map((b, idx) => {
                const koordinator = b.members.find((m: any) => m.position.toLowerCase().includes("koordinator") || m.position.toLowerCase().includes("ketua"));
                const anggota = b.members.filter((m: any) => m.id !== koordinator?.id);
                const anggotaNames = anggota.map((m: any) => m.name).join(", ");
                
                return (
                  <div key={b.key} className="flex flex-col items-center relative w-[calc(33.333%-16px)]">
                    <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.4)'}} className={`absolute -top-6 left-1/2 h-6 block ${idx >= 3 ? 'hidden' : ''}`} />
                    
                    <div style={{backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} className="p-5 w-full h-full text-left relative z-10">
                      <h3 style={{color: '#064e3b', borderBottom: '1px solid rgba(0,0,0,0.1)'}} className="text-[13px] font-bold uppercase tracking-wide pb-3 mb-4">{b.index}. {b.label}</h3>
                      
                      <div className="text-[14px] leading-relaxed">
                        {koordinator && (
                           <div className="mb-1">
                             <strong style={{color: '#52525b'}} className="font-semibold">Koordinator:</strong> <span style={{color: '#18181b'}}>{koordinator.name}</span>
                           </div>
                        )}
                        {anggota.length > 0 && (
                           <div style={{color: '#3f3f46'}}>
                             <strong style={{color: '#52525b'}} className="font-semibold">Anggota:</strong> {anggotaNames}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}
    </OrgChartScaler>
  );
}

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Masjid",
  description: "Profil lengkap Masjid Nurul Jannah - Sejarah, visi, misi, dan informasi kontak.",
};

export default async function ProfilPage() {
  const [profile, dkmMembers] = await Promise.all([
    getMosqueProfile(),
    getDkmMembers()
  ]);
  const totalPengurus = dkmMembers.length;

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Profil masjid belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Floating Style matching Homepage */}
      <section className="relative w-auto h-[300px] md:h-[400px] mt-[10px] mx-[10px] mb-[10px] md:mt-[20px] md:mx-[20px] md:mb-[20px] flex flex-col items-center justify-center overflow-hidden rounded-[16px] md:rounded-[24px] isolate bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px] md:rounded-[24px]">
          <Image
            src="/hero-masjid.jpg"
            alt="Masjid Nurul Jannah"
            fill
            className="object-cover object-[center_25%] opacity-80"
            priority
            sizes="100vw"
          />
          {/* Dark Overlay (Flat like Homepage) */}
          <div className="absolute inset-0 bg-black/50 z-[2]" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center pt-[73px]">
          <Badge variant="outline" className="mb-3 md:mb-4 py-1.5 px-3 md:px-4 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-emerald-50 font-normal uppercase tracking-widest text-[9px] md:text-[10px]">
            Tentang Kami
          </Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
            {profile.name}
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-2 md:mt-3 max-w-[90%] md:max-w-lg mx-auto drop-shadow-sm">
            Pusat Ibadah, Dakwah, dan Pendidikan Islam
          </p>
        </div>
      </section>

      <AboutSection hideImage={true} description={profile.description} />

      {/* Metrics Section */}
      <section className="py-12 md:py-16 bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            
            {/* Metric 1 */}
            <div className="bg-zinc-100 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
              <div className="text-right text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-800 tracking-tight">2015</div>
              <div className="mt-auto text-left">
                <div className="text-[14px] sm:text-[15px] md:text-base font-medium text-gray-800 mb-1 sm:mb-1.5 leading-tight">Tahun Berdiri</div>
                <div className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed font-light">Sejak 2015, hadir membina umat.</div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-emerald-600 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
                <div className="text-right text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white tracking-tight">150+</div>
              <div className="mt-auto text-left">
                <div className="text-[14px] sm:text-[15px] md:text-base font-medium text-white mb-1 sm:mb-1.5 leading-tight">Kapasitas Jamaah</div>
                <div className="text-[12px] sm:text-[13px] text-emerald-50/90 leading-relaxed font-light">Mampu menampung lebih dari 150 jamaah.</div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-zinc-100 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
              <div className="text-right text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-800 tracking-tight">132</div>
              <div className="mt-auto text-left">
                <div className="text-[14px] sm:text-[15px] md:text-base font-medium text-gray-800 mb-1 sm:mb-1.5 leading-tight">Luas Area (m²)</div>
                <div className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed font-light">Kawasan luas dukung kegiatan.</div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-emerald-600 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
                <div className="text-right text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white tracking-tight">{totalPengurus}</div>
              <div className="mt-auto text-left">
                <div className="text-[14px] sm:text-[15px] md:text-base font-medium text-white mb-1 sm:mb-1.5 leading-tight">Pengurus Aktif</div>
                <div className="text-[12px] sm:text-[13px] text-emerald-50/90 leading-relaxed font-light">Dikelola oleh puluhan relawan.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visi & Misi Section (Cards) */}
      {(profile.vision || profile.mission) && (
        <section className="pt-10 md:pt-16 pb-12 md:pb-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
              <div className="border border-zinc-200 rounded-2xl md:rounded-[24px] overflow-hidden bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
                  
                  {/* Visi Column */}
                  {profile.vision && (
                    <div className="flex flex-col p-6 sm:p-8 md:p-12">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-500 font-bold text-lg">//</span>
                        <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Visi Kami</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 mb-6">
                        Pusat Peradaban
                      </h2>
                      <div
                        className="text-zinc-600 text-[15px] sm:text-base leading-relaxed font-light prose prose-zinc max-w-none prose-p:my-0 prose-strong:text-zinc-900"
                        dangerouslySetInnerHTML={{ __html: profile.vision }}
                      />
                    </div>
                  )}

                  {/* Misi Column */}
                  {profile.mission && (
                    <div className="flex flex-col p-6 sm:p-8 md:p-12 bg-zinc-50/30">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-500 font-bold text-lg">//</span>
                        <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Misi Kami</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 mb-6">
                        Langkah Nyata
                      </h2>
                      <div
                        className="text-zinc-600 text-[15px] sm:text-base leading-relaxed font-light prose prose-zinc max-w-none prose-p:my-0 prose-li:my-1 prose-ul:my-2 prose-ul:list-disc prose-ol:my-2 prose-strong:text-zinc-900"
                        dangerouslySetInnerHTML={{ 
                          __html: (() => {
                            let html = profile.mission || '';
                            html = html.replace(/<ol/g, '<ul').replace(/<\/ol>/g, '</ul>');
                            if (html.includes('1. ') && html.includes('2. ')) {
                              const cleanText = html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
                              const items = cleanText.split(/\d+\.\s+/).filter(Boolean);
                              if (items.length > 1) {
                                return `<ul class="list-disc pl-5 space-y-2">` + items.map(item => `<li>${item.trim()}</li>`).join('') + `</ul>`;
                              }
                            }
                            return html;
                          })()
                        }}
                      />
                    </div>
                  )}

                </div>
              </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-8 md:pt-12 pb-12 md:pb-16 space-y-12">
        {/* Main Content (Sejarah & Struktur) */}
        <div className="space-y-8">



            {/* Struktur DKM Section */}
            <div id="struktur-dkm" className="w-full p-6 md:p-12 relative overflow-hidden rounded-2xl md:rounded-[24px] border border-emerald-800">
                {/* Background Image with Blur */}
                <div 
                  className="absolute inset-0 z-0 bg-[url('/ramadan-card.jpg')] bg-[length:100%_100%] md:bg-cover bg-center blur-md md:blur-[16px] scale-105 md:scale-110"
                />
                {/* Dark Overlay to ensure text readability */}
                <div className="absolute inset-0 z-0 bg-emerald-900/40" />

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3 text-center">
                    <span style={{color: '#ffffff'}} className="font-bold text-lg">//</span>
                    <span style={{color: '#ffffff'}} className="font-medium text-[15px] tracking-wide">Pengurus Masjid</span>
                  </div>
                  <h2 style={{color: '#ffffff'}} className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-10 text-center leading-tight">
                    Struktur Organisasi
                  </h2>
                  <DkmSection />
                </div>
            </div>
        </div>

        {/* Map Section */}
        {/* Map Section */}
        <div id="lokasi" className="mt-8 md:mt-12">
            <div className="bg-white rounded-2xl md:rounded-[24px] border border-gray-200 p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
              
              {/* Left Column: Text */}
              <div className="w-full lg:w-auto lg:max-w-sm flex-shrink-0 flex flex-col justify-start">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-500 font-bold text-lg">//</span>
                  <span className="text-zinc-600 font-medium text-[15px] tracking-wide">Peta Lokasi</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 mb-4">
                  Lokasi Masjid Nurul Jannah
                </h2>
                <p className="text-zinc-600 text-[15px] sm:text-base leading-relaxed font-light">
                  Kunjungi kami untuk beribadah, mengikuti kajian rutin, atau bersilaturahmi. Masjid kami terbuka lebar untuk seluruh jamaah yang ingin memakmurkan rumah Allah bersama-sama.
                </p>
                {profile.address && (
                  <div className="mt-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <p className="text-[14px] text-emerald-900 font-medium leading-relaxed">{profile.address}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Map */}
              <div className="w-full lg:flex-1 h-[350px] md:h-[450px] min-h-[350px] md:min-h-[450px] rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31905.02528780722!2d101.47609448681641!3d1.6677856430902873!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d3afc6fd238d29%3A0xde7b2557466c5100!2sMasjid%20Nurul%20Jannah!5e0!3m2!1sid!2sid!4v1770197713908!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>

            </div>
        </div>
      </div>
    </div>
  );
}
