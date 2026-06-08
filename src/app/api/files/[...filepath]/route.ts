import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filepath: string[] }> }
) {
  try {
    const { filepath } = await params;

    // Prevent path traversal
    const dotdot = String.fromCharCode(46, 46);
    const safeSegments = filepath.filter(
      (s) => s !== dotdot && s !== "." && !s.includes("/") && !s.includes("\\")
    );
    if (safeSegments.length === 0 || safeSegments.length !== filepath.length) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const uploadsRoot = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsRoot, ...safeSegments);

    // Ensure the resolved path stays within the uploads directory
    if (!path.resolve(filePath).startsWith(path.resolve(uploadsRoot))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
