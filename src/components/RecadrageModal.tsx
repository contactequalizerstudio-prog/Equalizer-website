"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Toutes les fiches du catalogue naissent au même format : 3:4, 1200 × 1600.
   Les repères horizontaux aident à poser le haut de la tête et les yeux
   toujours à la même hauteur, ce qui est ce qui se voit le plus dans une grille. */
const SORTIE_L = 1200;
const SORTIE_H = 1600;

type Props = {
  fichier: File;
  onAnnuler: () => void;
  onValider: (image: Blob) => void;
};

export default function RecadrageModal({ fichier, onAnnuler, onValider }: Props) {
  const [url, setUrl] = useState("");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [reperes, setReperes] = useState(true);
  const [travaille, setTravaille] = useState(false);

  const cadreRef = useRef<HTMLDivElement>(null);
  const glisse = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const u = URL.createObjectURL(fichier);
    setUrl(u);
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = u;
    return () => URL.revokeObjectURL(u);
  }, [fichier]);

  const cadre = () => {
    const r = cadreRef.current?.getBoundingClientRect();
    return { w: r?.width ?? 0, h: r?.height ?? 0 };
  };

  const echelleBase = useCallback(() => {
    if (!img) return 1;
    const { w, h } = cadre();
    return Math.max(w / img.naturalWidth, h / img.naturalHeight);
  }, [img]);

  const borner = useCallback(
    (p: { x: number; y: number }, z: number) => {
      if (!img) return p;
      const { w, h } = cadre();
      const s = echelleBase() * z;
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      return {
        x: Math.min(0, Math.max(w - dw, p.x)),
        y: Math.min(0, Math.max(h - dh, p.y)),
      };
    },
    [img, echelleBase]
  );

  /* à l'ouverture, on centre l'image et on la cale vers le haut :
     c'est presque toujours le bon point de départ pour un portrait */
  useEffect(() => {
    if (!img) return;
    const { w } = cadre();
    const s = echelleBase();
    setPos(borner({ x: (w - img.naturalWidth * s) / 2, y: 0 }, 1));
    setZoom(1);
  }, [img, echelleBase, borner]);

  const auDoigt = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    glisse.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
  };
  const bouge = (e: React.PointerEvent) => {
    if (!glisse.current) return;
    const g = glisse.current;
    setPos(borner({ x: g.ox + (e.clientX - g.x), y: g.oy + (e.clientY - g.y) }, zoom));
  };
  const relache = () => {
    glisse.current = null;
  };

  const changerZoom = (z: number) => {
    if (!img) return;
    const { w, h } = cadre();
    const s0 = echelleBase() * zoom;
    const s1 = echelleBase() * z;
    // on zoome sur le centre du cadre, pas sur le coin
    const cx = (w / 2 - pos.x) / s0;
    const cy = (h / 2 - pos.y) / s0;
    setZoom(z);
    setPos(borner({ x: w / 2 - cx * s1, y: h / 2 - cy * s1 }, z));
  };

  const valider = () => {
    if (!img) return;
    setTravaille(true);
    const { w, h } = cadre();
    const s = echelleBase() * zoom;
    const sx = -pos.x / s;
    const sy = -pos.y / s;
    const sw = w / s;
    const sh = h / s;

    const c = document.createElement("canvas");
    c.width = SORTIE_L;
    c.height = SORTIE_H;
    const ctx = c.getContext("2d");
    if (!ctx) return setTravaille(false);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SORTIE_L, SORTIE_H);
    c.toBlob(
      (b) => {
        setTravaille(false);
        if (b) onValider(b);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-[#0c343b] border border-[#1b4a52] rounded-2xl w-full max-w-md p-5">
        <h2 className="text-white font-semibold mb-1">Cadrer la photo</h2>
        <p className="text-[#9dbabf] text-xs leading-5 mb-4">
          Fais glisser l&apos;image et ajuste le zoom. Place le haut de la tête sur le
          repère du haut et les yeux sur celui du milieu : toutes les fiches auront
          alors le même cadrage.
        </p>

        <div
          ref={cadreRef}
          onPointerDown={auDoigt}
          onPointerMove={bouge}
          onPointerUp={relache}
          onPointerCancel={relache}
          className="relative w-full overflow-hidden rounded-xl bg-black cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ aspectRatio: "3 / 4" }}
        >
          {url && img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: img.naturalWidth * echelleBase() * zoom,
                height: img.naturalHeight * echelleBase() * zoom,
                maxWidth: "none",
              }}
            />
          )}

          {reperes && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 border-t border-[#6bdde3]/70" style={{ top: "8%" }} />
              <div className="absolute left-0 right-0 border-t border-[#6bdde3]/40 border-dashed" style={{ top: "22%" }} />
              <div className="absolute inset-y-0 border-l border-[#6bdde3]/25" style={{ left: "50%" }} />
              <span className="absolute left-2 text-[10px] text-[#6bdde3]/80" style={{ top: "8%", marginTop: 2 }}>
                haut de la tête
              </span>
              <span className="absolute left-2 text-[10px] text-[#6bdde3]/60" style={{ top: "22%", marginTop: 2 }}>
                yeux
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-[#9dbabf] text-xs">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => changerZoom(Number(e.target.value))}
            className="flex-1 accent-[#6bdde3]"
          />
        </div>

        <label className="flex items-center gap-2 mt-3 text-[#9dbabf] text-xs cursor-pointer">
          <input type="checkbox" checked={reperes} onChange={(e) => setReperes(e.target.checked)} className="accent-[#6bdde3]" />
          Afficher les repères
        </label>

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onAnnuler}
            className="px-4 py-2.5 border border-[#1b4a52] text-[#9dbabf] text-sm rounded-lg hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={valider}
            disabled={!img || travaille}
            className="flex-1 px-4 py-2.5 bg-[#6bdde3] text-[#0c343b] font-semibold text-sm rounded-lg disabled:opacity-50"
          >
            {travaille ? "Préparation…" : "Recadrer et envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
