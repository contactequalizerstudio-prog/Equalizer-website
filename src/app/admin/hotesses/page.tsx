"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HostessItem } from "@/lib/hostess-store";
import { toDisplaySrc } from "@/lib/blob-utils";

export default function HotessesAdminPage() {
  const [items, setItems] = useState<HostessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hostess");
      if (!res.ok) {
        showToast("Impossible de charger les hôtesses.", false);
        return;
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      showToast("Erreur réseau.", false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/hostess/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("Hôtesse supprimée.", true);
      } else {
        showToast("Erreur lors de la suppression.", false);
      }
    } finally {
      setDeleting(null);
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="p-8">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-xl transition-all ${
            toast.ok
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold">Hôtesses</h1>
          <p className="text-[#9dbabf] text-sm mt-1">
            {items.length} hôtesse{items.length !== 1 ? "s" : ""} dans le carrousel
          </p>
        </div>
        <Link
          href="/admin/hotesses/nouveau"
          className="inline-flex items-center gap-2 bg-[#6bdde3] hover:bg-[#8be8ed] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Nouvelle hôtesse
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0c3239] border border-[#1b4a52] rounded-xl h-72 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-[#9dbabf]">
          <p className="text-lg">Aucune hôtesse pour l&apos;instant.</p>
          <Link
            href="/admin/hotesses/nouveau"
            className="inline-block mt-4 text-[#6bdde3] hover:underline text-sm"
          >
            Ajouter la première hôtesse →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-[#0c3239] border border-[#1b4a52] rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-[#12434b]">
                <Image
                  src={toDisplaySrc(item.src)}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm mb-3 text-center">
                  {item.name}
                </h3>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/hotesses/${item.id}`}
                    className="flex-1 text-center text-sm bg-[#12434b] hover:bg-[#1b4a52] text-white py-2 rounded-lg transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={deleting === item.id}
                    className="flex-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === item.id ? "…" : "Supprimer"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
