"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AlbumItem } from "@/lib/album-store";
import { toDisplaySrc } from "@/lib/blob-utils";

const CATEGORIES = [
  "Photos & Vidéos",
  "Évènementiel",
  "Hôtesses",
  "Team Building",
  "Stand",
];

const OBJECT_POSITIONS = [
  { value: "center center", label: "Centre" },
  { value: "center top", label: "Haut" },
  { value: "center bottom", label: "Bas" },
  { value: "left center", label: "Gauche" },
  { value: "right center", label: "Droite" },
];

interface Props {
  mode: "create" | "edit";
  itemId?: number;
}

export default function ArticleForm({ mode, itemId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<Omit<AlbumItem, "id">>({
    src: "",
    alt: "",
    category: CATEGORIES[0],
    title: "",
    event: "",
    objectPosition: "center center",
  });

  const [previewSrc, setPreviewSrc] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && itemId) {
      fetch(`/api/admin/album/${itemId}`)
        .then((r) => r.json())
        .then((data: AlbumItem) => {
          setForm({
            src: data.src,
            alt: data.alt,
            category: data.category,
            title: data.title,
            event: data.event,
            objectPosition: data.objectPosition ?? "center center",
          });
          setPreviewSrc(toDisplaySrc(data.src));
        })
        .catch(() => setError("Impossible de charger l'article."))
        .finally(() => setLoading(false));
    }
  }, [mode, itemId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "src") setPreviewSrc(toDisplaySrc(value));
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    // Show local preview immediately while uploading
    const localPreview = URL.createObjectURL(file);
    setPreviewSrc(localPreview);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filename = `uploads/upload-${Date.now()}.${ext}`;

      // On Vercel: use client-side direct upload to bypass the 4.5 MB limit
      if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(filename, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        setForm((prev) => ({ ...prev, src: blob.url }));
        setPreviewSrc(toDisplaySrc(blob.url));
      } else {
        // Local dev: send file via FormData
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Erreur upload.");
          return;
        }
        setForm((prev) => ({ ...prev, src: data.src }));
        setPreviewSrc(toDisplaySrc(data.src));
      }
    } catch (err) {
      setError((err as Error).message ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.src) { setError("Veuillez choisir une image."); return; }
    if (!form.title) { setError("Le titre est obligatoire."); return; }

    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create" ? "/api/admin/album" : `/api/admin/album/${itemId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur sauvegarde.");
        return;
      }

      setSuccess(
        mode === "create" ? "Article créé avec succès !" : "Article mis à jour !"
      );
      setTimeout(() => { window.location.href = "/admin"; }, 1200);
    } catch {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-[#7a9aac]">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="text-[#7a9aac] hover:text-white transition-colors text-sm"
        >
          ← Retour
        </Link>
        <h1 className="text-white text-2xl font-semibold">
          {mode === "create" ? "Nouvel article" : "Modifier l'article"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div>
          <label className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-3">
            Image
          </label>

          {/* Preview */}
          {previewSrc && (
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-[#132433] mb-3 border border-[#1a2e3a]">
              <Image
                src={previewSrc}
                alt="Aperçu"
                fill
                className="object-cover"
                style={{ objectPosition: form.objectPosition }}
                unoptimized
              />
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              name="src"
              value={form.src}
              onChange={handleChange}
              placeholder="/nom-image.jpg"
              className="flex-1 bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2.5 bg-[#132433] hover:bg-[#1a2e3a] border border-[#1a2e3a] text-white text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? "Upload…" : "📁 Choisir un fichier"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Titre <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
          />
        </div>

        {/* Category + ObjectPosition (2 columns) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
            >
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="objectPosition"
              className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
            >
              Cadrage image
            </label>
            <select
              id="objectPosition"
              name="objectPosition"
              value={form.objectPosition}
              onChange={handleChange}
              className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
            >
              {OBJECT_POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event */}
        <div>
          <label
            htmlFor="event"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Type d&apos;événement
          </label>
          <input
            id="event"
            name="event"
            type="text"
            value={form.event}
            onChange={handleChange}
            placeholder="ex: Événement festif, Salon professionnel…"
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
          />
        </div>

        {/* Alt text */}
        <div>
          <label
            htmlFor="alt"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Texte alternatif (SEO)
          </label>
          <input
            id="alt"
            name="alt"
            type="text"
            value={form.alt}
            onChange={handleChange}
            placeholder="Description courte de l'image pour le référencement"
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
          />
        </div>

        {/* Feedback */}
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
            {success}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-[#0e8ec4] hover:bg-[#0a7aaa] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {saving
              ? "Sauvegarde…"
              : mode === "create"
              ? "Créer l'article"
              : "Enregistrer les modifications"}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 bg-[#132433] hover:bg-[#1a2e3a] text-[#7a9aac] text-sm rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
