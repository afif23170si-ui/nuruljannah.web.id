import { Metadata } from "next";
import { getSiteSettings } from "@/actions/settings";
import { ZiswafPaymentUI, BankAccount, EWallet } from "@/components/public/ZiswafPaymentUI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campaign ZISWAF - Masjid Nurul Jannah",
  description: "Dukung campaign dan program penggalangan dana di Masjid Nurul Jannah.",
};

export default async function CampaignPage() {
  const settingsData = await getSiteSettings();
  const settings = settingsData as any;

  const bankAccounts = (settings.bankAccounts as BankAccount[]) || [];
  const ewallets = (settings.ewallets as EWallet[]) || [];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-blue-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Program Campaign</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Dukung program-program penggalangan dana khusus untuk operasional, pembangunan, dan kegiatan sosial.
        </p>
      </section>
      
      <ZiswafPaymentUI 
        bankAccounts={bankAccounts}
        ewallets={ewallets}
        qrisImageUrl={settings.qrisImageUrl || null}
        title="Dukung Campaign"
        subtitle="Pilih opsi pembayaran di bawah ini untuk mendukung campaign program kami."
      />
    </div>
  );
}
