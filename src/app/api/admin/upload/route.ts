import { NextResponse } from "next/server";

const IS_VERCEL = !!process.env.VERCEL;
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type non autorisé. Utilisez JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `upload-${Date.now()}.${ext}`;

    if (IS_VERCEL && HAS_BLOB_TOKEN) {
      // ── Vercel: store image in Blob as private ────────────────────
      // Images are served via /api/img proxy route
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, file, {
        access: "private",
        addRandomSuffix: false,
      });
      return NextResponse.json({ src: blob.url }, { status: 201 });
    } else {
      // ── Local dev: write to public/uploads/ ───────────────────────
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      return NextResponse.json({ src: `/uploads/${filename}` }, { status: 201 });
    }
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Erreur upload." }, { status: 500 });
  }
}
