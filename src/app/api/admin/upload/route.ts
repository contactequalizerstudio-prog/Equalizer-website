import { NextResponse } from "next/server";

const IS_VERCEL = !!process.env.VERCEL;
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

// ── Vercel: client-side upload token handler ─────────────────────────────────
// The browser calls this endpoint to get a short-lived upload token, then
// uploads the file directly to Vercel Blob (bypasses the 4.5 MB serverless
// body-size limit). On completion, Vercel Blob calls back to this same route.
export async function POST(request: Request) {
  if (IS_VERCEL && HAS_BLOB_TOKEN) {
    try {
      const { handleUpload } = await import("@vercel/blob/client");
      const body = await request.json();

      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
          addRandomSuffix: false,
        }),
        onUploadCompleted: async ({ blob }) => {
          console.log("[upload] completed:", blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (err) {
      console.error("[upload]", err);
      return NextResponse.json(
        { error: (err as Error).message ?? "Erreur upload." },
        { status: 400 }
      );
    }
  }

  // ── Local dev: write file to public/uploads/ ─────────────────────────────
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

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `upload-${Date.now()}.${ext}`;

    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ src: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    console.error("[upload-local]", err);
    return NextResponse.json({ error: "Erreur upload." }, { status: 500 });
  }
}
