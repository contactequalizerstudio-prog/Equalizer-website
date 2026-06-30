"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { AlbumItem } from "@/lib/album-store";
import { toDisplaySrc } from "@/lib/blob-utils";

export default function AdminDashboard() {
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/album");
      if (!res.ok) {
        showToast("Impossible de charger les articles.", false);
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

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/album/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("Article supprimé.", true);
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
      {/* Toast */}
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

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold">Tableau de bord</h1>
          <p className="text-[#7a9aac] text-sm mt-1">
            {items.length} article{items.length !== 1 ? "s" : ""} dans l&apos;album
          </p>
        </div>
        <Link
          href="/admin/articles/nouveau"
          className="inline-flex items-center gap-2 bg-[#0e8ec4] hover:bg-[#0a7aaa] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Nouvel article
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0d1820] border border-[#1a2e3a] rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-[#7a9aac]">
          <p className="text-lg">Aucun article pour l&apos;instant.</p>
          <Link
            href="/admin/articles/nouveau"
            className="inline-block mt-4 text-[#0e8ec4] hover:underline text-sm"
          >
            Créer le premier article →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-[#0d1820] border border-[#1a2e3a] rounded-xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-44 bg-[#132433]">
                <Image
                  src={toDisplaySrc(item.src)}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: item.objectPosition ?? "center center" }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#0e8ec4]/90 text-white text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="flex-1 p-4">
                <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[#7a9aac] text-xs">{item.event}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <Link
                  href={`/admin/articles/${item.id}`}
                  className="flex-1 text-center text-sm bg-[#132433] hover:bg-[#1a2e3a] text-white py-2 rounded-lg transition-colors"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  disabled={deleting === item.id}
                  className="flex-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === item.id ? "…" : "Supprimer"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
