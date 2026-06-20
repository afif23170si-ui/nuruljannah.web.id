import { Metadata } from "next";
import Image from "next/image";
import { getSiteSettings } from "@/actions/settings";
import { ZiswafPaymentUI, BankAccount, EWallet } from "@/components/public/ZiswafPaymentUI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zakat - Masjid Nurul Jannah",
  description: "Tunaikan zakat maal dan zakat fitrah Anda melalui platform resmi Masjid Nurul Jannah.",
};

export default async function ZakatPage() {
  const settingsData = await getSiteSettings();
  const settings = settingsData as any;

  const bankAccounts = (settings.bankAccounts as BankAccount[]) || [];
  const ewallets = (settings.ewallets as EWallet[]) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Floating Style */}
      <section className="relative w-auto h-[300px] md:h-[400px] mt-[10px] mx-[10px] mb-[10px] md:mt-[20px] md:mx-[20px] md:mb-[20px] flex flex-col items-center justify-center overflow-hidden rounded-[16px] md:rounded-[24px] isolate bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px] md:rounded-[24px]">
          <Image
            src="/hero-masjid.jpg"
            alt="Hero Background"
            fill
            className="object-cover object-[center_25%] opacity-80"
            priority
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-[2]" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center pt-[73px]">
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 drop-shadow-sm">
            Layanan Zakat
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-2 md:mt-3 max-w-[90%] md:max-w-lg mx-auto drop-shadow-sm">
            "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka." (QS. At-Taubah: 103)
          </p>
        </div>
      </section>
      
      <ZiswafPaymentUI 
        bankAccounts={bankAccounts}
        ewallets={ewallets}
        qrisImageUrl={settings.qrisImageUrl || null}
        title="Salurkan Zakat Anda"
        subtitle="Sempurnakan ibadah Anda dengan menunaikan zakat melalui rekening resmi Masjid Nurul Jannah."
      />
    </div>
  );
}
