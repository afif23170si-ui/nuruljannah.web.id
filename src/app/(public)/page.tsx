import { HeroSection, FeaturesSection } from "@/components/home";
import { getSiteSettingsPublic } from "@/actions/public";

export default async function HomePage() {
  const settings = await getSiteSettingsPublic();
  
  // Build location string from settings
  const location = settings?.mosqueCity || settings?.mosqueProvince || "Indonesia";

  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
