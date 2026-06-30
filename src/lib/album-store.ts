import fs from "fs";
import path from "path";

export interface AlbumItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  event: string;
  objectPosition?: string;
}

// ── Local filesystem (development) ───────────────────────
const LOCAL_FILE = path.join(process.cwd(), "src", "data", "album.json");

function readLocal(): AlbumItem[] {
  return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as AlbumItem[];
}

function writeLocal(items: AlbumItem[]): void {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// ── Vercel Blob (production) ──────────────────────────────
const BLOB_KEY = "album.json";

async function readBlob(): Promise<AlbumItem[]> {
  const { list, head } = await import("@vercel/blob");

  // Find existing blob
  const { blobs } = await list({ prefix: BLOB_KEY });
  const existing = blobs.find((b) => b.pathname === BLOB_KEY);

  if (!existing) {
    // First run: seed from static file bundled at build time
    const seed = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as AlbumItem[];
    await writeBlob(seed);
    return seed;
  }

  // Fetch with cache-busting so we always get the latest version
  const res = await fetch(existing.url + `?t=${Date.now()}`, { cache: "no-store" });
  return (await res.json()) as AlbumItem[];
}

async function writeBlob(items: AlbumItem[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

// ── Public API (auto-selects storage backend) ─────────────

const IS_VERCEL = !!process.env.VERCEL;

export async function getAllItemsAsync(): Promise<AlbumItem[]> {
  return IS_VERCEL ? readBlob() : Promise.resolve(readLocal());
}

export function getAllItems(): AlbumItem[] {
  if (IS_VERCEL) {
    throw new Error("Use getAllItemsAsync() on Vercel");
  }
  return readLocal();
}

export async function getItemByIdAsync(id: number): Promise<AlbumItem | undefined> {
  const items = await getAllItemsAsync();
  return items.find((i) => i.id === id);
}

export async function createItemAsync(
  data: Omit<AlbumItem, "id">
): Promise<AlbumItem> {
  const items = await getAllItemsAsync();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem: AlbumItem = { id: nextId, ...data };
  const updated = [...items, newItem];
  IS_VERCEL ? await writeBlob(updated) : writeLocal(updated);
  return newItem;
}

export async function updateItemAsync(
  id: number,
  data: Partial<Omit<AlbumItem, "id">>
): Promise<AlbumItem | null> {
  const items = await getAllItemsAsync();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  IS_VERCEL ? await writeBlob(items) : writeLocal(items);
  return items[idx];
}

export async function deleteItemAsync(id: number): Promise<boolean> {
  const items = await getAllItemsAsync();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  IS_VERCEL ? await writeBlob(filtered) : writeLocal(filtered);
  return true;
}
