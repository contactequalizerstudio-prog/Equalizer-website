"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "bg-background border border-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors duration-200 w-full";

const labelCls = "text-muted text-xs tracking-[0.2em] uppercase mb-2 block";

/* ── Checkbox group helper ── */
function CheckGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(
      value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt]
    );
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label
            key={opt}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer select-none transition-colors duration-200 text-sm ${
              checked
                ? "border-gold bg-gold/5 text-white"
                : "border-border bg-background text-muted hover:border-gold/40"
            }`}
          >
            <span
              className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200 ${
                checked ? "border-gold bg-gold" : "border-border"
              }`}
              aria-hidden="true"
            >
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(opt)} />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ── Radio group helper ── */
function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer select-none transition-colors duration-200 text-sm ${
              checked
                ? "border-gold bg-gold/5 text-white"
                : "border-border bg-background text-muted hover:border-gold/40"
            }`}
          >
            <span
              className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                checked ? "border-gold" : "border-border"
              }`}
              aria-hidden="true"
            >
              {checked && <span className="w-2 h-2 rounded-full bg-gold block" />}
            </span>
            <input type="radio" className="sr-only" checked={checked} onChange={() => onChange(opt)} />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ── Main component ── */
export default function CandidatureForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  /* Section 1 */
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [facebook, setFacebook] = useState("");
  const [activite, setActivite] = useState("");
  const [anneesAnimation, setAnneesAnimation] = useState("");
  const [langues, setLangues] = useState<string[]>([]);
  const [disponibilites, setDisponibilites] = useState("");
  const [agence, setAgence] = useState<string[]>([]);

  /* Section 2 */
  const [mensurations, setMensurations] = useState("");
  const [prestationsHotesse, setPrestationsHotesse] = useState<string[]>([]);
  const [prestationsAnimatrice, setPrestationsAnimatrice] = useState<string[]>([]);
  const [cursus, setCursus] = useState("");

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/candidature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom, dateNaissance, email, telephone, adresse, facebook,
          activite, anneesAnimation, langues, disponibilites, agence,
          mensurations, prestationsHotesse, prestationsAnimatrice, cursus,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  /* ── Success ── */
  if (status === "sent") {
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
          Candidature envoyée !
        </h2>
        <p className="text-muted text-sm leading-7 max-w-sm mb-2">
          Merci <span className="text-white font-medium">{nom}</span>. Votre candidature a bien été reçue par notre équipe.
        </p>
        <p className="text-muted text-sm leading-7 max-w-sm mb-8">
          N&apos;oubliez pas d&apos;envoyer votre photo buste et sur pieds par WhatsApp au{" "}
          <a href="tel:+261322540773" className="text-gold">+261 32 25 407 73</a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Stepper ── */}
      <div className="flex items-center gap-4 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
              step >= s ? "bg-gold text-black" : "bg-surface border border-border text-muted"
            }`}>
              {s}
            </div>
            <span className={`text-xs tracking-[0.15em] uppercase hidden sm:block ${step >= s ? "text-white" : "text-muted"}`}>
              {s === 1 ? "Informations personnelles" : "Prestations & profil"}
            </span>
            {s < 2 && <div className={`flex-1 h-px w-12 ${step > s ? "bg-gold" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* ── Section 1 ── */}
      {step === 1 && (
        <form onSubmit={goNext} noValidate className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 flex flex-col">
              <label htmlFor="c-nom" className={labelCls}>
                Nom & Prénom <span className="text-gold">*</span>
              </label>
              <input id="c-nom" type="text" required value={nom}
                onChange={(e) => setNom(e.target.value)} placeholder="Prénom Nom"
                className={inputCls} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="c-dob" className={labelCls}>
                Date de naissance <span className="text-gold">*</span>
              </label>
              <input id="c-dob" type="date" required value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className={`${inputCls} [color-scheme:dark]`} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="c-email" className={labelCls}>
                Adresse e-mail <span className="text-gold">*</span>
              </label>
              <input id="c-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                className={inputCls} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="c-tel" className={labelCls}>
                Numéro de téléphone <span className="text-gold">*</span>
              </label>
              <input id="c-tel" type="tel" required value={telephone}
                onChange={(e) => setTelephone(e.target.value)} placeholder="+261 XX XX XXX XX"
                className={inputCls} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="c-adresse" className={labelCls}>
                Adresse <span className="text-gold">*</span>
              </label>
              <input id="c-adresse" type="text" required value={adresse}
                onChange={(e) => setAdresse(e.target.value)} placeholder="Quartier, Ville"
                className={inputCls} />
            </div>

            <div className="sm:col-span-2 flex flex-col">
              <label htmlFor="c-fb" className={labelCls}>
                Lien ou Nom profil Facebook <span className="text-gold">*</span>
              </label>
              <input id="c-fb" type="text" required value={facebook}
                onChange={(e) => setFacebook(e.target.value)} placeholder="facebook.com/votreprofil"
                className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Activité actuelle <span className="text-gold">*</span></p>
            <RadioGroup
              options={["Etudiant(e)", "Salarié(e)", "A la recherche d'une opportunité"]}
              value={activite}
              onChange={setActivite}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Années dans le domaine de l&apos;animation <span className="text-gold">*</span></p>
            <RadioGroup
              options={["Moins de 1 an", "Entre 2 ans et plus", "Plus de 5 ans"]}
              value={anneesAnimation}
              onChange={setAnneesAnimation}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Langues maîtrisées <span className="text-gold">*</span></p>
            <CheckGroup
              options={["Français", "Anglais", "Malagasy", "Autre"]}
              value={langues}
              onChange={setLangues}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Disponibilités <span className="text-gold">*</span></p>
            <RadioGroup
              options={["Jours ouvrables", "Week-end", "Les 2"]}
              value={disponibilites}
              onChange={setDisponibilites}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Déjà dans une agence ? <span className="text-gold">*</span></p>
            <CheckGroup
              options={["Non", "Oui", "Autre"]}
              value={agence}
              onChange={setAgence}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,142,196,0.4)] mt-2"
          >
            Continuer — Section 2 →
          </button>
        </form>
      )}

      {/* ── Section 2 ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

          {/* Photo reminder */}
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 flex gap-4 items-start">
            <svg className="shrink-0 mt-0.5 text-gold" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-white/80 leading-6">
              Envoyez une photo <strong className="text-white">buste et sur pieds</strong> par WhatsApp au{" "}
              <a href="tel:+261322540773" className="text-gold font-semibold">+261 32 25 407 73</a>
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="c-mensurations" className={labelCls}>
              Mensurations (en cm) <span className="text-gold">*</span>
            </label>
            <input id="c-mensurations" type="text" required value={mensurations}
              onChange={(e) => setMensurations(e.target.value)}
              placeholder="Ex : Taille 168, Tour de poitrine 88, Hanche 94"
              className={inputCls} />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Prestations hôtesse par jour <span className="text-gold">*</span></p>
            <CheckGroup
              options={["50 000 MGA", "70 000 MGA", "100 000 MGA", "Plus de 100 000 MGA"]}
              value={prestationsHotesse}
              onChange={setPrestationsHotesse}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Prestations animatrice de vente par jour <span className="text-gold">*</span></p>
            <CheckGroup
              options={["Moins de 50 000 MGA", "50 000 MGA", "70 000 MGA", "100 000 MGA", "Plus de 100 000 MGA"]}
              value={prestationsAnimatrice}
              onChange={setPrestationsAnimatrice}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="c-cursus" className={labelCls}>
              Cursus académique <span className="text-gold">*</span>
            </label>
            <input id="c-cursus" type="text" required value={cursus}
              onChange={(e) => setCursus(e.target.value)}
              placeholder="Ex : Licence en Communication, BTS Commerce..."
              className={inputCls} />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-4 border border-border text-muted text-xs tracking-[0.2em] uppercase rounded-full hover:border-gold hover:text-gold transition-all duration-300"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,142,196,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                "Envoyer ma candidature"
              )}
            </button>
          </div>

          {status === "error" && (
            <p className="text-red-400 text-xs text-center">
              Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
