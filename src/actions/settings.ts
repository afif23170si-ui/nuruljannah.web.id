"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get or create site settings (singleton)
export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        mosqueName: "Masjid Nurul Jannah",
      },
    });
  }
  
  return settings;
}

// Update site settings
export async function updateSiteSettings(data: {
  mosqueName?: string;
  tagline?: string;
  description?: string;
  address?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  logoUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  history?: string;
  vision?: string;
  mission?: string;
  latitude?: number;
  longitude?: number;
  bankAccounts?: Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>;
}) {
  const settings = await getSiteSettings();
  
  const updated = await prisma.siteSettings.update({
    where: { id: settings.id },
    data: {
      mosqueName: data.mosqueName,
      tagline: data.tagline,
      description: data.description,
      address: data.address,
      village: data.village,
      district: data.district,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      logoUrl: data.logoUrl,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      facebook: data.facebook,
      instagram: data.instagram,
      twitter: data.twitter,
      youtube: data.youtube,
      history: data.history,
      vision: data.vision,
      mission: data.mission,
      latitude: data.latitude,
      longitude: data.longitude,
      bankAccounts: data.bankAccounts,
    },
  });
  
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return updated;
}
