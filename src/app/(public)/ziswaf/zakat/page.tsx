import { Metadata } from "next";
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
      <section className="bg-emerald-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Layanan Zakat</h1>
        <p className="text-emerald-100/80 max-w-2xl mx-auto">
          "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka." (QS. At-Taubah: 103)
        </p>
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
