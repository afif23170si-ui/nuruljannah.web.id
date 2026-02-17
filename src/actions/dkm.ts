"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

// Get all DKM members (including inactive for admin)
export async function getAllDkmMembers() {
  return prisma.dkmMember.findMany({
    orderBy: { order: "asc" },
  });
}

// Create a new DKM member
export async function createDkmMember(data: {
  name: string;
  position: string;
  photo?: string;
  order?: number;
  period?: string;
}) {
  const member = await prisma.dkmMember.create({ data });
  revalidatePath("/admin/dkm");
  revalidatePath("/profil");
  revalidateTag("dkm-members", "max");
  return member;
}

// Update an existing DKM member
export async function updateDkmMember(
  id: string,
  data: {
    name?: string;
    position?: string;
    photo?: string;
    order?: number;
    isActive?: boolean;
    period?: string;
  }
) {
  const member = await prisma.dkmMember.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/dkm");
  revalidatePath("/profil");
  revalidateTag("dkm-members", "max");
  return member;
}

// Delete a DKM member
export async function deleteDkmMember(id: string) {
  await prisma.dkmMember.delete({ where: { id } });
  revalidatePath("/admin/dkm");
  revalidatePath("/profil");
  revalidateTag("dkm-members", "max");
}

// Reorder DKM members
export async function reorderDkmMembers(
  members: { id: string; order: number }[]
) {
  await prisma.$transaction(
    members.map((m) =>
      prisma.dkmMember.update({
        where: { id: m.id },
        data: { order: m.order },
      })
    )
  );
  revalidatePath("/admin/dkm");
  revalidatePath("/profil");
  revalidateTag("dkm-members", "max");
}
