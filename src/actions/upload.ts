"use server";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialized Supabase Admin client
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("MISSING ENV VARS:", {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: !!serviceRoleKey,
    });
    throw new Error("Server configuration error: Missing Supabase credentials");
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

async function ensureBucketExists(bucketName: string) {
  const admin = getSupabaseAdmin();
  const { data: buckets, error: listError } = await admin.storage.listBuckets();

  if (listError) {
    console.error("Failed to list buckets:", listError);
    throw new Error("Failed to access storage");
  }

  const exists = buckets?.some((b) => b.name === bucketName);

  if (!exists) {
    console.log(`Bucket "${bucketName}" not found. Creating...`);
    const { error: createError } = await admin.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });

    if (createError) {
      console.error("Failed to create bucket:", createError);
      throw new Error(`Failed to create storage bucket: ${createError.message}`);
    }
    console.log(`Bucket "${bucketName}" created successfully.`);
  }
}

export async function uploadLogo(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Ukuran file maksimal 2MB" };
    }

    const admin = getSupabaseAdmin();

    // Ensure the media bucket exists
    await ensureBucketExists("media");

    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    // Convert File to ArrayBuffer then Buffer for server upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using admin client
    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: `Upload gagal: ${uploadError.message}` };
    }

    // Get public URL
    const { data: urlData } = admin.storage
      .from("media")
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("Upload server action error:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat upload" };
  }
}

export async function uploadEditorImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file size (5MB max for editor images)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Ukuran file maksimal 5MB" };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Format file harus JPG, PNG, WEBP, atau GIF" };
    }

    const admin = getSupabaseAdmin();
    await ensureBucketExists("media");

    const fileExt = file.name.split(".").pop();
    const fileName = `editor-${Date.now()}.${fileExt}`;
    const filePath = `editor/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Editor image upload error:", uploadError);
      return { success: false, error: `Upload gagal: ${uploadError.message}` };
    }

    const { data: urlData } = admin.storage
      .from("media")
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("Editor image upload error:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat upload" };
  }
}
