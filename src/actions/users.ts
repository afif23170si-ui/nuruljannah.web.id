"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Get all users
export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          finances: true,
        },
      },
    },
  });
}

// Get user by ID
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });
}

// Create user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "BENDAHARA" | "TAKMIR" | "PENGELOLA_TPA" | "JAMAAH";
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  revalidatePath("/admin/users");
  return user;
}

// Update user
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "ADMIN" | "BENDAHARA" | "TAKMIR" | "PENGELOLA_TPA" | "JAMAAH";
  }
) {
  const updateData: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    role: data.role,
  };

  // Only hash password if provided
  if (data.password && data.password.length > 0) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/users");
  return user;
}

// Delete user
export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
