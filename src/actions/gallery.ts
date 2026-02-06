"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all albums
export async function getAlbums() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { images: true },
      },
    },
  });
  return albums;
}

// Get single album with images
export async function getAlbumById(id: string) {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
  return album;
}

// Get album by slug (for public page)
export async function getAlbumBySlug(slug: string) {
  const album = await prisma.galleryAlbum.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
  return album;
}

// Get all active albums (for public page)
export async function getActiveAlbums() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { images: true },
      },
    },
  });
  return albums;
}

// Create album
export async function createAlbum(data: {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
}) {
  const album = await prisma.galleryAlbum.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      coverImage: data.coverImage,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  return album;
}

// Update album
export async function updateAlbum(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    isActive?: boolean;
  }
) {
  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      coverImage: data.coverImage,
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  return album;
}

// Delete album
export async function deleteAlbum(id: string) {
  await prisma.galleryAlbum.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
}

// Add image to album
export async function addImageToAlbum(
  albumId: string,
  imageUrl: string,
  title?: string,
  description?: string
) {
  // Get max order
  const maxOrder = await prisma.galleryImage.findFirst({
    where: { albumId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const image = await prisma.galleryImage.create({
    data: {
      albumId,
      imageUrl,
      title,
      description,
      order: (maxOrder?.order || 0) + 1,
    },
  });

  // Update album cover if first image
  const album = await prisma.galleryAlbum.findUnique({
    where: { id: albumId },
    select: { coverImage: true },
  });

  if (!album?.coverImage) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverImage: imageUrl },
    });
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  return image;
}

// Delete image
export async function deleteImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
}

// Update image order
export async function reorderImages(albumId: string, imageIds: string[]) {
  const updates = imageIds.map((id, index) =>
    prisma.galleryImage.update({
      where: { id },
      data: { order: index },
    })
  );

  await prisma.$transaction(updates);
  revalidatePath("/admin/gallery");
}

// Set album cover
export async function setAlbumCover(albumId: string, imageUrl: string) {
  await prisma.galleryAlbum.update({
    where: { id: albumId },
    data: { coverImage: imageUrl },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
}
