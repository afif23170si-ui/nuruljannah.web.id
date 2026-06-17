import { Metadata } from "next";
import Image from "next/image";
import { getSiteSettings } from "@/actions/settings";
import { ZiswafPaymentUI, BankAccount, EWallet } from "@/components/public/ZiswafPaymentUI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Qurban - Masjid Nurul Jannah",
  description: "Program Qurban Masjid Nurul Jannah.",
};

export default async function QurbanPage() {
  const settingsData = await getSiteSettings();
  const settings = settingsData as any;

  const bankAccounts = (settings.bankAccounts as BankAccount[]) || [];
  const ewallets = (settings.ewallets as EWallet[]) || [];

  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 md:px-0">
        <div className="relative h-[250px] md:h-[300px] flex flex-col justify-center items-center overflow-hidden rounded-[15px] md:rounded-2xl w-[96%] max-w-7xl mx-auto bg-black p-6">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-masjid.webp"
              alt="Program Qurban"
              fill
              className="object-cover opacity-60"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          </div>
          
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-2 md:mb-4 text-white drop-shadow-sm">Program Qurban</h1>
            <p className="text-white/80 max-w-[90%] md:max-w-2xl mx-auto text-sm md:text-base mt-2 md:mt-3">
              Mari berpartisipasi dalam program Qurban tahun ini bersama Masjid Nurul Jannah.
            </p>
          </div>
        </div>
      </section>
      
      <ZiswafPaymentUI 
        bankAccounts={bankAccounts}
        ewallets={ewallets}
        qrisImageUrl={settings.qrisImageUrl || null}
        title="Pembayaran Qurban"
        subtitle="Transfer dana qurban melalui opsi pembayaran di bawah ini dan lakukan konfirmasi ke panitia."
      />
    </div>
  );
}
