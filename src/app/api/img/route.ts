import { NextRequest, NextResponse } from "next/server";

// Proxy for Vercel Blob images (kept for forward-compatibility).
// With a public store, simply re-fetches the public URL and streams it back.
export async function GET(request: NextRequest) {
  const blobUrl = request.nextUrl.searchParams.get("url");

  if (!blobUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(blobUrl);
    if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) {
      return new NextResponse("Invalid blob URL", { status: 400 });
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const res = await fetch(blobUrl, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType = res.headers.get("Content-Type") ?? "image/jpeg";
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[img-proxy]", err);
    return new NextResponse("Error fetching blob", { status: 500 });
  }
}
