import nextDynamic from "next/dynamic";
import { HeroSection } from "@/components/home";
import { getSiteSettingsPublic } from "@/actions/public";
import { getFinanceSummary } from "@/actions/finance";

const FeaturesSection = nextDynamic(() => import("@/components/home/FeaturesSection"), {
  loading: () => <div className="min-h-[600px] bg-white" />,
});

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSiteSettingsPublic();
  const finance = await getFinanceSummary();

  // Build location string from settings
  const location = settings?.city || settings?.province || "Indonesia";

  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}

