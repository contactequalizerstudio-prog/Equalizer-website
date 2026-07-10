"use client";

import { useState } from "react";
import Image from "next/image";
import type { HostessItem } from "@/lib/hostess-store";
import { toDisplaySrc } from "@/lib/blob-utils";

type BookingStatus = "idle" | "sending" | "sent" | "error";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

interface Props {
  hostesses: HostessItem[];
}

function Stars({ level }: { level: number }) {
  const n = Math.min(5, Math.max(0, level));
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm leading-none ${i <= n ? "text-gold" : "text-white/20"}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function HotesseBooking({ hostesses }: Props) {
  const [current, setCurrent] = useState(0);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", event: "", eventDate: "", message: "",
  });

  if (hostesses.length === 0) {
    return (
      <p className="text-center text-muted py-20">
        Aucune hôtesse disponible pour le moment.
      </p>
    );
  }

  const goTo = (index: number) => {
    setFlippedId(null);
    setCurrent(index);
  };
  const prev = () => goTo(mod(current - 1, hostesses.length));
  const next = () => goTo(mod(current + 1, hostesses.length));

  const toggleSelect = (name: string) => {
    setSelected((s) =>
      s.includes(name) ? s.filter((n) => n !== name) : [...s, name]
    );
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selectedHotesses: selected }),
      });
      setBookingStatus(res.ok ? "sent" : "error");
    } catch {
      setBookingStatus("error");
    }
  };

  const getCardStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    if (abs > 2) return { display: "none" };

    const x = offset * 52;
    const z = -abs * 80;
    const scale = 1 - abs * 0.12;
    const opacity = 1 - abs * 0.35;
    const brightness = 1 - abs * 0.3;

    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "clamp(220px, 36vw, 320px)",
      aspectRatio: "3/4",
      transform: `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) scale(${scale})`,
      opacity,
      filter: `brightness(${brightness})`,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 10 - abs,
      borderRadius: "16px",
      cursor: offset === 0 ? "default" : "pointer",
      boxShadow: offset === 0 ? "0 32px 80px rgba(0,0,0,0.6)" : "none",
      perspective: "1200px",
    };
  };

  if (bookingStatus === "sent") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#0e8ec4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-light text-white mb-3"
          style={{ fontFamily: "var(--font-ibrand), sans-serif" }}>
          Réservation envoyée !
        </h2>
        <p className="text-muted text-sm leading-7 max-w-sm mb-3">
          Votre demande a bien été reçue. Notre équipe vous contactera sous 24h pour confirmer la disponibilité des hôtesses.
        </p>
        <p className="text-gold text-xs tracking-widest uppercase mb-8">
          {selected.join(" · ")}
        </p>
        <button
          onClick={() => { setBookingStatus("idle"); setSelected([]); setShowForm(false); setForm({ name: "", email: "", phone: "", event: "", eventDate: "", message: "" }); }}
          className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold hover:text-black transition-all duration-300"
        >
          Nouvelle réservation
        </button>
      </div>
    );
  }

  const half = Math.floor(hostesses.length / 2);

  return (
    <div className="flex flex-col gap-12">

      {/* ── Carousel 3D ── */}
      <div className="relative">
        <div
          className="relative mx-auto"
          style={{ height: "clamp(340px, 55vw, 520px)", perspective: "900px", transformStyle: "preserve-3d" }}
        >
          {hostesses.map((hotesse, i) => {
            const offset = mod(i - current + half, hostesses.length) - half;
            if (Math.abs(offset) > 2) return null;
            const isActive = offset === 0;
            const isSelectedHotesse = selected.includes(hotesse.name);
            const isFlipped = flippedId === hotesse.id;

            return (
              <div
                key={hotesse.id}
                style={getCardStyle(offset)}
                onClick={() => { if (!isActive) goTo(i); }}
              >
                {/* Flip inner — poker-card style rotateY */}
                <div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* ── Face avant ── */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <Image
                      src={toDisplaySrc(hotesse.src)}
                      alt={hotesse.name}
                      fill
                      className="object-cover object-top"
                      sizes="320px"
                      priority={isActive}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2.5 px-4 pb-4 pt-8">
                      <p className="text-white font-semibold text-base tracking-wide">{hotesse.name}</p>
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedId(hotesse.id);
                            }}
                            className="px-5 py-2 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 bg-black/60 text-white border border-white/40 hover:border-gold hover:text-gold"
                          >
                            Info
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(hotesse.name); }}
                            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                              isSelectedHotesse
                                ? "bg-gold text-black shadow-[0_0_20px_rgba(14,142,196,0.6)]"
                                : "bg-black/60 text-white border border-white/40 hover:bg-gold hover:text-black hover:border-gold"
                            }`}
                          >
                            {isSelectedHotesse ? "✓ Sélectionnée" : "Réserver"}
                          </button>
                        </div>
                      )}
                    </div>

                    {!isActive && isSelectedHotesse && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5l3 3 7-7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* ── Face arrière (infos) ── */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col bg-[#0d1820] border border-gold/30"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex-1 flex flex-col justify-center px-6 py-5 gap-5">
                      <p className="text-gold text-xs tracking-[0.3em] uppercase text-center">
                        {hotesse.name}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <p className="text-muted text-[10px] tracking-[0.2em] uppercase mb-1">Taille</p>
                          <p className="text-white text-sm font-medium">
                            {hotesse.height?.trim() ? hotesse.height : "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted text-[10px] tracking-[0.2em] uppercase mb-1.5">
                            Niveau de français
                          </p>
                          <Stars level={hotesse.frenchLevel ?? 0} />
                        </div>

                        <div>
                          <p className="text-muted text-[10px] tracking-[0.2em] uppercase mb-1.5">
                            Niveau anglais
                          </p>
                          <Stars level={hotesse.englishLevel ?? 0} />
                        </div>

                        <div>
                          <p className="text-muted text-[10px] tracking-[0.2em] uppercase mb-1">Études</p>
                          <p className="text-white text-sm font-medium leading-snug">
                            {hotesse.studies?.trim() ? hotesse.studies : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="px-4 pb-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedId(null);
                          }}
                          className="flex-1 py-2 rounded-full text-xs font-semibold tracking-[0.15em] uppercase bg-black/40 text-white border border-white/30 hover:border-gold hover:text-gold transition-all"
                        >
                          Retour
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelect(hotesse.name); }}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all ${
                            isSelectedHotesse
                              ? "bg-gold text-black"
                              : "bg-gold/90 text-black hover:bg-gold"
                          }`}
                        >
                          {isSelectedHotesse ? "✓ OK" : "Réserver"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={prev}
            aria-label="Précédent"
            className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex gap-1.5">
            {hostesses.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à ${hostesses[i].name}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-5 h-2 bg-gold" : "w-2 h-2 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Suivant"
            className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="text-center text-muted text-xs tracking-[0.2em] uppercase mt-4">
          {current + 1} / {hostesses.length} — {hostesses[current].name}
        </p>
      </div>

      {selected.length > 0 && (
        <div className="bg-surface border border-gold/30 rounded-2xl p-6 mx-auto w-full max-w-2xl">
          <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3">
            Votre sélection ({selected.length})
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {selected.map((name) => (
              <span
                key={name}
                className="flex items-center gap-2 px-3 py-1.5 bg-background border border-gold/40 rounded-full text-white text-xs"
              >
                {name}
                <button
                  onClick={() => toggleSelect(name)}
                  aria-label={`Retirer ${name}`}
                  className="text-muted hover:text-gold transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,142,196,0.4)]"
          >
            Finir ma sélection →
          </button>
        </div>
      )}

      {showForm && selected.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-8 lg:p-10 mx-auto w-full max-w-2xl">
          <p className="text-gold text-xs tracking-[0.25em] uppercase mb-2">Étape finale</p>
          <h2
            className="font-display text-2xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
          >
            Vos informations
          </h2>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="b-name" className="text-muted text-xs tracking-[0.2em] uppercase">
                  Nom complet <span className="text-gold" aria-hidden="true">*</span>
                </label>
                <input id="b-name" name="name" type="text" required value={form.name}
                  onChange={handleFormChange} placeholder="Votre nom"
                  className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="b-email" className="text-muted text-xs tracking-[0.2em] uppercase">
                  Email <span className="text-gold" aria-hidden="true">*</span>
                </label>
                <input id="b-email" name="email" type="email" required value={form.email}
                  onChange={handleFormChange} placeholder="votre@email.com"
                  className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="b-phone" className="text-muted text-xs tracking-[0.2em] uppercase">
                  Téléphone
                </label>
                <input id="b-phone" name="phone" type="tel" value={form.phone}
                  onChange={handleFormChange} placeholder="+261 XX XX XXX XX"
                  className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="b-event" className="text-muted text-xs tracking-[0.2em] uppercase">
                  Type d&apos;événement
                </label>
                <input id="b-event" name="event" type="text" value={form.event}
                  onChange={handleFormChange} placeholder="Conférence, salon, lancement..."
                  className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200" />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="b-date" className="text-muted text-xs tracking-[0.2em] uppercase">
                  Date de l&apos;événement
                </label>
                <input id="b-date" name="eventDate" type="date" value={form.eventDate}
                  onChange={handleFormChange}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-200 [color-scheme:dark]" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="b-message" className="text-muted text-xs tracking-[0.2em] uppercase">
                Message complémentaire
              </label>
              <textarea id="b-message" name="message" rows={4} value={form.message}
                onChange={handleFormChange}
                placeholder="Précisez vos besoins : tenue souhaitée, durée, lieu..."
                className="bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200 resize-none" />
            </div>

            <button
              type="submit"
              disabled={bookingStatus === "sending"}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,142,196,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {bookingStatus === "sending" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                `Confirmer la réservation (${selected.length} hôtesse${selected.length > 1 ? "s" : ""})`
              )}
            </button>

            {bookingStatus === "error" && (
              <p className="text-red-400 text-xs text-center">
                Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
