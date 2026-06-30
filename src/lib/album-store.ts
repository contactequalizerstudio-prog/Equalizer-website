import fs from "fs";
import path from "path";
import initialData from "../data/album.json";

export interface AlbumItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  event: string;
  objectPosition?: string;
}

// ── Paths ─────────────────────────────────────────────────
const LOCAL_FILE = path.join(process.cwd(), "src", "data", "album.json");
const BLOB_KEY = "album.json";

const IS_VERCEL = !!process.env.VERCEL;
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

// ── Local filesystem (development) ───────────────────────
function readLocal(): AlbumItem[] {
  return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as AlbumItem[];
}

function writeLocal(items: AlbumItem[]): void {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// ── Vercel Blob (production, requires BLOB_READ_WRITE_TOKEN) ─
async function readBlob(): Promise<AlbumItem[]> {
  const { list, get } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_KEY });
  const existing = blobs.find((b) => b.pathname === BLOB_KEY);

  if (!existing) {
    // First run: seed from JSON bundled at build time (safe on Vercel serverless)
    const seed = initialData as AlbumItem[];
    await writeBlob(seed);
    return seed;
  }

  // Public blob — fetch directly by URL (no auth required)
  const res = await fetch(existing.url + `?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`[album-store] Failed to fetch album.json: ${res.status}`);
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

// ── Storage selector ──────────────────────────────────────
// On Vercel WITH Blob token → use Blob (persistent)
// On Vercel WITHOUT token  → read-only from bundled JSON (fallback)
// Locally                  → use filesystem

async function read(): Promise<AlbumItem[]> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) return readBlob();
  return readLocal();
}

async function write(items: AlbumItem[]): Promise<void> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) {
    await writeBlob(items);
  } else if (IS_VERCEL) {
    // No Blob token: can't persist on Vercel — skip silently
    console.warn("[album-store] BLOB_READ_WRITE_TOKEN not set — changes not persisted");
  } else {
    writeLocal(items);
  }
}

// ── Public API ────────────────────────────────────────────
export async function getAllItemsAsync(): Promise<AlbumItem[]> {
  return read();
}

// Sync version for local dev only (used by album page server component)
export function getAllItems(): AlbumItem[] {
  return readLocal();
}

export async function getItemByIdAsync(id: number): Promise<AlbumItem | undefined> {
  const items = await read();
  return items.find((i) => i.id === id);
}

export async function createItemAsync(data: Omit<AlbumItem, "id">): Promise<AlbumItem> {
  const items = await read();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem: AlbumItem = { id: nextId, ...data };
  await write([...items, newItem]);
  return newItem;
}

export async function updateItemAsync(
  id: number,
  data: Partial<Omit<AlbumItem, "id">>
): Promise<AlbumItem | null> {
  const items = await read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  await write(items);
  return items[idx];
}

export async function deleteItemAsync(id: number): Promise<boolean> {
  const items = await read();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  await write(filtered);
  return true;
}
