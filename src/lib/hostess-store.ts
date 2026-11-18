import fs from "fs";
import path from "path";
import initialData from "../data/hostesses.json";
import {
  hasLegacyPrivateFields,
  openHostessRecord,
  sealHostessRecord,
} from "./hostess-privacy";

export interface HostessItem {
  id: number;
  name: string;
  src: string;
  /** Height, e.g. "1m68" */
  height?: string;
  /** French level 0–5 */
  frenchLevel?: number;
  /** English level 0–5 */
  englishLevel?: number;
  /** Studies / education */
  studies?: string;
  /** Admin-only: phone number (never shown on public site) */
  phone?: string;
  /** Admin-only: address (never shown on public site) */
  address?: string;
  /** Admin-only: internal comment/notes (never shown on public site) */
  comment?: string;
}

const LOCAL_FILE = path.join(process.cwd(), "src", "data", "hostesses.json");
const BLOB_KEY = "hostesses.json";

const IS_VERCEL = !!process.env.VERCEL;
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

function openStored(raw: HostessItem[]): { opened: HostessItem[]; needsSeal: boolean } {
  return {
    opened: raw.map(openHostessRecord),
    needsSeal: raw.some(hasLegacyPrivateFields),
  };
}

function readLocal(): HostessItem[] {
  const raw = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as HostessItem[];
  const { opened, needsSeal } = openStored(raw);
  if (needsSeal) {
    try {
      writeLocal(opened);
    } catch (err) {
      console.error("[hostess-store] could not encrypt private hostess fields", err);
    }
  }
  return opened;
}

function writeLocal(items: HostessItem[]): void {
  fs.writeFileSync(
    LOCAL_FILE,
    JSON.stringify(items.map(sealHostessRecord), null, 2),
    "utf-8"
  );
}

async function readBlob(): Promise<HostessItem[]> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_KEY });
  const existing = blobs.find((b) => b.pathname === BLOB_KEY);

  if (!existing) {
    const seed = initialData as HostessItem[];
    await writeBlob(seed);
    return seed;
  }

  const res = await fetch(existing.url + `?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`[hostess-store] Failed to fetch hostesses.json: ${res.status}`);
  const raw = (await res.json()) as HostessItem[];
  const { opened, needsSeal } = openStored(raw);
  // hostesses.json lives on a public blob. Rewrite any plaintext phone,
  // address, or comment so a direct fetch of that file cannot read them.
  if (needsSeal) {
    try {
      await writeBlob(opened);
    } catch (err) {
      console.error("[hostess-store] could not encrypt private hostess fields", err);
    }
  }
  return opened;
}

async function writeBlob(items: HostessItem[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(items.map(sealHostessRecord), null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    // Public blobs default to a one-month cache. Keep this file short-lived so
    // a rewritten (encrypted) copy replaces any previously cached plaintext.
    cacheControlMaxAge: 60,
  });
}

async function read(): Promise<HostessItem[]> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) return readBlob();
  return readLocal();
}

async function write(items: HostessItem[]): Promise<void> {
  if (IS_VERCEL && HAS_BLOB_TOKEN) {
    await writeBlob(items);
  } else if (IS_VERCEL) {
    console.warn("[hostess-store] BLOB_READ_WRITE_TOKEN not set — changes not persisted");
  } else {
    writeLocal(items);
  }
}

export async function getAllHostessesAsync(): Promise<HostessItem[]> {
  return read();
}

export function getAllHostesses(): HostessItem[] {
  return readLocal();
}

export async function getHostessByIdAsync(id: number): Promise<HostessItem | undefined> {
  const items = await read();
  return items.find((i) => i.id === id);
}

export async function createHostessAsync(
  data: Omit<HostessItem, "id">
): Promise<HostessItem> {
  const items = await read();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem: HostessItem = { id: nextId, ...data };
  await write([...items, newItem]);
  return newItem;
}

export async function updateHostessAsync(
  id: number,
  data: Partial<Omit<HostessItem, "id">>
): Promise<HostessItem | null> {
  const items = await read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  await write(items);
  return items[idx];
}

export async function deleteHostessAsync(id: number): Promise<boolean> {
  const items = await read();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  await write(filtered);
  return true;
}
