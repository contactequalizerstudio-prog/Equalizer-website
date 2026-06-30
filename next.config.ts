import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images from Vercel Blob are served via /api/img proxy (private store).
  // No remotePatterns needed — all external blob URLs are proxied internally.
};

export default nextConfig;
