"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HostessItem } from "@/lib/hostess-store";
import { toDisplaySrc } from "@/lib/blob-utils";
import RecadrageModal from "@/components/RecadrageModal";

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
  phone: "",
  address: "",
  comment: "",
};

export default function HostessForm({ mode, itemId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aRecadrer, setaRecadrer] = useState<File | null>(null);
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
            phone: data.phone ?? "",
            address: data.address ?? "",
            comment: data.comment ?? "",
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

    if (file.size > 12 * 1024 * 1024) {
      setError("Image trop lourde. Maximum 12 Mo.");
      return;
    }

    // Toute photo passe par le cadrage : c'est ce qui rend le catalogue homogène.
    setError("");
    setaRecadrer(file);
  }

  async function envoyer(image: Blob) {
    setaRecadrer(null);
    setUploading(true);
    setError("");

    const localPreview = URL.createObjectURL(image);
    setPreviewSrc(localPreview);

    const fd = new FormData();
    fd.append("file", new File([image], "photo.jpg", { type: "image/jpeg" }));

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
        <div className="text-[#9dbabf]">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/hotesses"
          className="text-[#9dbabf] hover:text-white transition-colors text-sm"
        >
          ← Retour
        </Link>
        <h1 className="text-white text-2xl font-semibold">
          {mode === "create" ? "Nouvelle hôtesse" : "Modifier l'hôtesse"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-3">
            Photo
          </label>

          {previewSrc && (
            <div className="relative aspect-[3/4] w-48 rounded-xl overflow-hidden bg-[#12434b] mb-3 border border-[#1b4a52]">
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
              className="flex-1 bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2.5 bg-[#12434b] hover:bg-[#1b4a52] border border-[#1b4a52] text-white text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? "Upload…" : "Choisir un fichier"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
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
            className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
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
            className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="frenchLevel"
              className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
            >
              Niveau français
            </label>
            <select
              id="frenchLevel"
              name="frenchLevel"
              value={form.frenchLevel ?? 0}
              onChange={handleChange}
              className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors"
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
              className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
            >
              Niveau anglais
            </label>
            <select
              id="englishLevel"
              name="englishLevel"
              value={form.englishLevel ?? 0}
              onChange={handleChange}
              className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors"
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
            className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
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
            className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
          />
        </div>

        {/* ── Infos internes (admin uniquement) ── */}
        <div className="rounded-xl border border-[#1b4a52] bg-[#0c3239]/60 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[#6bdde3] text-sm">🔒</span>
            <p className="text-[#9dbabf] text-xs tracking-widest uppercase">
              Infos internes — non affichées sur le site
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
            >
              Numéro
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone ?? ""}
              onChange={handleChange}
              placeholder="ex: +261 34 00 000 00"
              className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
            >
              Adresse
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address ?? ""}
              onChange={handleChange}
              placeholder="ex: Lot II A Antananarivo"
              className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
            />
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
            >
              Commentaire
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              value={form.comment ?? ""}
              onChange={handleChange}
              placeholder="Notes internes sur l'hôtesse…"
              className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95] resize-none"
            />
          </div>
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
            className="px-8 py-3 bg-[#6bdde3] hover:bg-[#8be8ed] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {saving
              ? "Sauvegarde…"
              : mode === "create"
              ? "Ajouter l'hôtesse"
              : "Enregistrer"}
          </button>
          <Link
            href="/admin/hotesses"
            className="px-6 py-3 bg-[#12434b] hover:bg-[#1b4a52] text-[#9dbabf] text-sm rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>

      {aRecadrer && (
        <RecadrageModal
          fichier={aRecadrer}
          onAnnuler={() => setaRecadrer(null)}
          onValider={envoyer}
        />
      )}
    </div>
  );
}
