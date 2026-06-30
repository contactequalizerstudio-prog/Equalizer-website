/**
 * Converts a Vercel Blob private URL to a proxied URL served by /api/img.
 * Local paths (e.g. /presidence.jpeg) are returned unchanged.
 */
export function toDisplaySrc(src: string): string {
  if (!src) return src;
  if (src.includes(".blob.vercel-storage.com")) {
    return `/api/img?url=${encodeURIComponent(src)}`;
  }
  return src;
}

export function isVercelBlobUrl(src: string): boolean {
  return src.includes(".blob.vercel-storage.com");
}
