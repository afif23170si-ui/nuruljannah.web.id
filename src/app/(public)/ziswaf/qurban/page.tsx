import { Metadata } from "next";
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
      <section className="bg-stone-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Program Qurban</h1>
        <p className="text-stone-300 max-w-2xl mx-auto">
          Mari berpartisipasi dalam program Qurban tahun ini bersama Masjid Nurul Jannah.
        </p>
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
