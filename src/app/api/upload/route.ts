import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSupabaseAdmin, isSupabaseStorageConfigured, STORAGE_BUCKET } from "@/lib/supabase";

// Allowed image mime types and max size (5MB)
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "product";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File too large. Max 5MB." }, { status: 400 });
    }

    const safeType = type.replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const objectPath = `${safeType}/${uniqueName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ---- Primary path: Supabase Storage (when configured) ----
    if (isSupabaseStorageConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(objectPath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error.message);
          return NextResponse.json({ success: false, error: "Upload failed (storage)" }, { status: 500 });
        }

        const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
        return NextResponse.json({
          success: true,
          data: { url: pub.publicUrl, filename: uniqueName, storage: "supabase" },
        });
      }
    }

    // ---- Fallback: local filesystem (development / sandbox) ----
    const uploadDir = path.join(process.cwd(), "uploads", safeType);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      data: { url: `/api/files/${safeType}/${uniqueName}`, filename: uniqueName, storage: "local" },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
