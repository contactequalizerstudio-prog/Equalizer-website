/**
 * Returns the display URL for an image src.
 * - Absolute URLs (Vercel Blob, etc.) are returned as-is.
 * - Local paths are URI-encoded so accents/spaces work (e.g. /hotêsse/Ny Tia.png).
 */
export function toDisplaySrc(src: string): string {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  return encodeURI(src);
}

export function isVercelBlobUrl(src: string): boolean {
  return src.includes(".blob.vercel-storage.com");
}
