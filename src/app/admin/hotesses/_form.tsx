"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HostessItem } from "@/lib/hostess-store";
import { toDisplaySrc } from "@/lib/blob-utils";

interface Props {
  mode: "create" | "edit";
  itemId?: number;
}

const emptyForm: Omit<HostessItem, "id"> = {
  name: "",
  src: "",
  height: "",
  frenchLevel: 0,
  englishLevel: 0,
  studies: "",
};

export default function HostessForm({ mode, itemId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<Omit<HostessItem, "id">>(emptyForm);
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    if (mode === "edit" && itemId) {
      fetch(`/api/admin/hostess/${itemId}`)
        .then((r) => r.json())
        .then((data: HostessItem) => {
          setForm({
            name: data.name,
            src: data.src,
            height: data.height ?? "",
            frenchLevel: data.frenchLevel ?? 0,
            englishLevel: data.englishLevel ?? 0,
            studies: data.studies ?? "",
          });
          setPreviewSrc(toDisplaySrc(data.src));
        })
        .catch(() => setError("Impossible de charger l'hôtesse."))
        .finally(() => setLoading(false));
    }
  }, [mode, itemId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "frenchLevel" || name === "englishLevel") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "src") setPreviewSrc(toDisplaySrc(value));
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError("Image trop lourde. Maximum 4 Mo.");
      return;
    }

    setUploading(true);
    setError("");

    const localPreview = URL.createObjectURL(file);
    setPreviewSrc(localPreview);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur upload.");
        return;
      }
      setForm((prev) => ({ ...prev, src: data.src }));
      setPreviewSrc(toDisplaySrc(data.src));
    } catch {
      setError("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.src) {
      setError("Veuillez choisir une photo.");
      return;
    }
    if (!form.name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create" ? "/api/admin/hostess" : `/api/admin/hostess/${itemId}`;
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
        mode === "create" ? "Hôtesse ajoutée !" : "Hôtesse mise à jour !"
      );
      setTimeout(() => {
        window.location.href = "/admin/hotesses";
      }, 1200);
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
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/hotesses"
          className="text-[#7a9aac] hover:text-white transition-colors text-sm"
        >
          ← Retour
        </Link>
        <h1 className="text-white text-2xl font-semibold">
          {mode === "create" ? "Nouvelle hôtesse" : "Modifier l'hôtesse"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-3">
            Photo
          </label>

          {previewSrc && (
            <div className="relative aspect-[3/4] w-48 rounded-xl overflow-hidden bg-[#132433] mb-3 border border-[#1a2e3a]">
              <Image
                src={previewSrc}
                alt="Aperçu"
                fill
                className="object-cover object-top"
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
              placeholder="/hotêsse/Nom.png"
              className="flex-1 bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2.5 bg-[#132433] hover:bg-[#1a2e3a] border border-[#1a2e3a] text-white text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? "Upload…" : "Choisir un fichier"}
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

        <div>
          <label
            htmlFor="name"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Nom <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="ex: Aina"
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Taille
          </label>
          <input
            id="height"
            name="height"
            type="text"
            value={form.height ?? ""}
            onChange={handleChange}
            placeholder="ex: 1m68"
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="frenchLevel"
              className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
            >
              Niveau français
            </label>
            <select
              id="frenchLevel"
              name="frenchLevel"
              value={form.frenchLevel ?? 0}
              onChange={handleChange}
              className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="englishLevel"
              className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
            >
              Niveau anglais
            </label>
            <select
              id="englishLevel"
              name="englishLevel"
              value={form.englishLevel ?? 0}
              onChange={handleChange}
              className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="studies"
            className="block text-[#7a9aac] text-xs tracking-widest uppercase mb-2"
          >
            Études
          </label>
          <input
            id="studies"
            name="studies"
            type="text"
            value={form.studies ?? ""}
            onChange={handleChange}
            placeholder="ex: Licence Marketing"
            className="w-full bg-[#132433] border border-[#1a2e3a] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0e8ec4] transition-colors placeholder:text-[#3a5a6a]"
          />
        </div>

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

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-[#0e8ec4] hover:bg-[#0a7aaa] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {saving
              ? "Sauvegarde…"
              : mode === "create"
              ? "Ajouter l'hôtesse"
              : "Enregistrer"}
          </button>
          <Link
            href="/admin/hotesses"
            className="px-6 py-3 bg-[#132433] hover:bg-[#1a2e3a] text-[#7a9aac] text-sm rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
