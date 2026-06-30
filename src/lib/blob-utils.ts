/**
 * Returns the display URL for an album image src.
 * - Public Vercel Blob URLs (*.public.blob.vercel-storage.com) are returned as-is.
 * - Local paths (/xxx.jpeg) are returned as-is.
 */
export function toDisplaySrc(src: string): string {
  return src;
}

export function isVercelBlobUrl(src: string): boolean {
  return src.includes(".blob.vercel-storage.com");
}
