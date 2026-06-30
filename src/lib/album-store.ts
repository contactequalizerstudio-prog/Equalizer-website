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

const DATA_FILE = path.join(process.cwd(), "src", "data", "album.json");

export function getAllItems(): AlbumItem[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as AlbumItem[];
}

export function getItemById(id: number): AlbumItem | undefined {
  return getAllItems().find((item) => item.id === id);
}

function saveItems(items: AlbumItem[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function createItem(
  data: Omit<AlbumItem, "id">
): AlbumItem {
  const items = getAllItems();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem: AlbumItem = { id: nextId, ...data };
  saveItems([...items, newItem]);
  return newItem;
}

export function updateItem(
  id: number,
  data: Partial<Omit<AlbumItem, "id">>
): AlbumItem | null {
  const items = getAllItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  saveItems(items);
  return items[idx];
}

export function deleteItem(id: number): boolean {
  const items = getAllItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  saveItems(filtered);
  return true;
}
