import { Metadata } from "next";
import { InfaqPageClient } from "./InfaqPageClient";
import { getSiteSettings } from "@/actions/settings";
import { getRecentDonations, getInfaqStats } from "@/actions/finance";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Infaq Online - Masjid Nurul Jannah",
  description:
    "Salurkan infaq dan donasi Anda secara digital untuk pembangunan dan operasional Masjid Nurul Jannah.",
};

export default async function InfaqPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year) : now.getFullYear();

  const [settingsData, recentDonations, stats] = await Promise.all([
    getSiteSettings(),
    getRecentDonations(8, month, year),
    getInfaqStats(month, year),
  ]);

  const settings = settingsData as any;

  const bankAccounts = (settings.bankAccounts as Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>) || [];

  const ewallets = (settings.ewallets as Array<{
    name: string;
    number: string;
    logo: string;
  }>) || [];

  return (
    <InfaqPageClient
      bankAccounts={bankAccounts}
      ewallets={ewallets}
      qrisImageUrl={settings.qrisImageUrl || null}
      recentDonations={recentDonations}
      stats={stats}
      month={month}
      year={year}
    />
  );
}

