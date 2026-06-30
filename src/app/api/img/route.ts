import { NextRequest, NextResponse } from "next/server";

// Proxy for private Vercel Blob images.
// Usage: /api/img?url=https%3A%2F%2F...blob.vercel-storage.com%2Fuploads%2Fxxx.jpg
export async function GET(request: NextRequest) {
  const blobUrl = request.nextUrl.searchParams.get("url");

  if (!blobUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow requests to Vercel Blob storage
  try {
    const parsed = new URL(blobUrl);
    if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) {
      return new NextResponse("Invalid blob URL", { status: 400 });
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const { get } = await import("@vercel/blob");
    const result = await get(blobUrl, { access: "private" });

    if (!result || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": result.blob.contentType ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": result.blob.size ? String(result.blob.size) : "",
      },
    });
  } catch (err) {
    console.error("[img-proxy]", err);
    return new NextResponse("Error fetching blob", { status: 500 });
  }
}
