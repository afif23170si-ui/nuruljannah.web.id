import { Metadata } from "next";
import { InfaqPageClient } from "./InfaqPageClient";

export const metadata: Metadata = {
  title: "Infaq Online - Masjid Nurul Jannah",
  description:
    "Salurkan infaq dan donasi Anda secara digital untuk pembangunan dan operasional Masjid Nurul Jannah.",
};

export default function InfaqPage() {
  return <InfaqPageClient />;
}
