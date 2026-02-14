"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Get Mosque Profile
export const getMosqueProfile = unstable_cache(
  async () => {
    // First try to get from SiteSettings (new)
    const siteSettings = await prisma.siteSettings.findFirst();
    
    // Fallback to MosqueProfile (legacy)
    const profile = await prisma.mosqueProfile.findFirst();
    
    // Merge data - prefer SiteSettings for address/contact
    if (siteSettings) {
      const fullAddress = [
        siteSettings.mosqueAddress,
        siteSettings.mosqueCity,
        siteSettings.mosqueProvince,
        siteSettings.mosquePostcode
      ].filter(Boolean).join(", ");
      
      return {
        ...profile,
        name: siteSettings.mosqueName || profile?.name || "Masjid Nurul Jannah",
        address: fullAddress || profile?.address,
        phone: siteSettings.phone || siteSettings.whatsapp || profile?.phone,
        email: siteSettings.email || profile?.email,
        description: siteSettings.mosqueDescription || profile?.description,
      };
    }
    
    return profile;
  },
  ["mosque-profile"],
  { revalidate: 60, tags: ["mosque-profile", "site-settings"] }
);

// Get Site Settings for public use
export const getSiteSettingsPublic = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  },
  ["site-settings-public"],
  { revalidate: 60, tags: ["site-settings"] }
);

// Get DKM Members
export const getDkmMembers = unstable_cache(
  async () => {
    const members = await prisma.dkmMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return members;
  },
  ["dkm-members"],
  { revalidate: 3600, tags: ["dkm-members"] }
);

// Get Kajian Schedules
export const getKajianSchedules = unstable_cache(
  async () => {
    const schedules = await prisma.kajianSchedule.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: "asc" },
    });
    return schedules;
  },
  ["kajian-schedules"],
  { revalidate: 3600, tags: ["kajian-schedules"] }
);

// Get Active Mosque Events (Agenda Masjid)
export const getActiveEvents = async (category?: string) => {
  const cacheKey = category ? `mosque-events-${category}` : "mosque-events-all";
  const fetchEvents = unstable_cache(
    async () => {
      const events = await prisma.mosqueEvent.findMany({
        where: {
          isActive: true,
          ...(category ? { category: category as "KAJIAN_RUTIN" | "PROGRAM_RUTIN" | "EVENT_BESAR" | "SOSIAL" | "INTERNAL_DKM" } : {}),
        },
        orderBy: [{ isRecurring: "desc" }, { dayOfWeek: "asc" }, { date: "asc" }, { time: "asc" }],
      });
      return events;
    },
    [cacheKey],
    { revalidate: 3600, tags: ["mosque-events"] }
  );
  return fetchEvents();
};

// Get Published Posts
export const getPublishedPosts = unstable_cache(
  async (category?: string, limit?: number) => {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { category: category as never } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: limit || 10,
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    return posts;
  },
  ["published-posts"],
  { revalidate: 300, tags: ["posts"] }
);

// Get Single Post by Slug
export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    return post;
  },
  ["post-by-slug"],
  { revalidate: 300, tags: ["posts"] }
);

// Get TPA Info
export const getTpaInfo = unstable_cache(
  async () => {
    const [classes, teachers, announcements] = await Promise.all([
      prisma.tpaClass.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.tpaTeacher.findMany({
        where: { isActive: true },
      }),
      prisma.tpaAnnouncement.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
    ]);

    return { classes, teachers, announcements };
  },
  ["tpa-info"],
  { revalidate: 3600, tags: ["tpa"] }
);
