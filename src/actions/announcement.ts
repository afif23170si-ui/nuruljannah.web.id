"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";

// ==========================================
// PUBLIC
// ==========================================

export const getActiveAnnouncements = unstable_cache(
  async () => {
    const now = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });
    return announcements;
  },
  ["active-announcements"],
  { revalidate: 60, tags: ["announcements"] }
);

// ==========================================
// ADMIN
// ==========================================

export async function getAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return announcements;
}

export async function createAnnouncement(data: {
  message: string;
  type?: "INFO" | "WARNING" | "URGENT";
  priority?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  const announcement = await prisma.announcement.create({
    data: {
      message: data.message,
      type: data.type || "INFO",
      priority: data.priority || 0,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    },
  });
  revalidateTag("announcements", "max");
  return announcement;
}

export async function updateAnnouncement(
  id: string,
  data: {
    message?: string;
    type?: "INFO" | "WARNING" | "URGENT";
    isActive?: boolean;
    priority?: number;
    startDate?: Date | null;
    endDate?: Date | null;
  }
) {
  const announcement = await prisma.announcement.update({
    where: { id },
    data,
  });
  revalidateTag("announcements", "max");
  return announcement;
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  revalidateTag("announcements", "max");
}

export async function toggleAnnouncement(id: string) {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw new Error("Announcement not found");

  const updated = await prisma.announcement.update({
    where: { id },
    data: { isActive: !announcement.isActive },
  });
  revalidateTag("announcements", "max");
  return updated;
}
