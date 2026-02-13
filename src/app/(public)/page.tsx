import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home";
import { getSiteSettingsPublic } from "@/actions/public";
import { getFinanceSummary } from "@/actions/finance";

const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), {
  loading: () => <div className="min-h-[600px] bg-white" />,
});

// Force dynamic rendering to avoid build-time database queries
export const dynamicParams = true; // explicitly set if needed, but "force-dynamic" below covers it
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSiteSettingsPublic();
  const finance = await getFinanceSummary();

  // Build location string from settings
  const location = settings?.mosqueCity || settings?.mosqueProvince || "Indonesia";

  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
