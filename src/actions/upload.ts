"use server";

import { createClient } from "@supabase/supabase-js";

// Use Service Role Key (server-side only) — bypasses RLS completely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function ensureBucketExists(bucketName: string) {
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

  if (listError) {
    console.error("Failed to list buckets:", listError);
    throw new Error("Failed to access storage");
  }

  const exists = buckets?.some((b) => b.name === bucketName);

  if (!exists) {
    console.log(`Bucket "${bucketName}" not found. Creating...`);
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
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

    // Ensure the media bucket exists
    await ensureBucketExists("media");

    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    // Convert File to ArrayBuffer then Buffer for server upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using admin client
    const { error: uploadError } = await supabaseAdmin.storage
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
    const { data: urlData } = supabaseAdmin.storage
      .from("media")
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("Upload server action error:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat upload" };
  }
}
