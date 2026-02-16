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
  mosqueAddress?: string;
  mosqueCity?: string;
  mosqueProvince?: string;
  mosquePostcode?: string;
  mosqueDescription?: string;
  mosqueLogo?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
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
      mosqueAddress: data.mosqueAddress,
      mosqueCity: data.mosqueCity,
      mosqueProvince: data.mosqueProvince,
      mosquePostcode: data.mosquePostcode,
      mosqueDescription: data.mosqueDescription,
      mosqueLogo: data.mosqueLogo,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      facebook: data.facebook,
      instagram: data.instagram,
      youtube: data.youtube,
      tiktok: data.tiktok,
      bankAccounts: data.bankAccounts,
    },
  });
  
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return updated;
}
