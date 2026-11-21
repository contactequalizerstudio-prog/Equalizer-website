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

/* ── Mini-test d'anglais ──
   Six questions de compréhension tirées du quotidien d'un stand, puis une réponse
   libre. Les bonnes réponses ne sont pas ici : la correction se fait côté serveur,
   pour que le score ne puisse pas être fabriqué depuis le navigateur. */
const QUESTIONS_EN: { q: string; options: string[] }[] = [
  { q: "A visitor asks: « Where can I find the restrooms? » What is she looking for?",
    options: ["The exit", "The toilets", "The car park", "The bar"] },
  { q: "Which sentence is correct?",
    options: ["She work here since 2020", "She working here since 2020", "She has been working here since 2020", "She is work here since 2020"] },
  { q: "« Could you please fill in this form? » — the visitor is asking you to…",
    options: ["Sign a contract", "Translate a text", "Keep a file", "Complete a form"] },
  { q: "Complete: « Welcome to our stand! ___ I help you? »",
    options: ["Do", "May", "Is", "Am"] },
  { q: "« The event starts at half past seven. » What time is it?",
    options: ["6:30", "7:15", "7:30", "8:30"] },
  { q: "« We are running out of brochures. » It means…",
    options: ["They are late", "There are almost none left", "We are printing more", "They are free"] },
];

/* ── Photo ──
   Le navigateur redessine l'image dans un canvas avant l'envoi : la photo part
   en JPEG d'au plus 1400 px, soit quelques centaines de kilo-octets au lieu de
   plusieurs méga-octets. Cela règle aussi le HEIC des iPhones, que Safari sait
   décoder mais que presque aucun serveur n'accepte. */
async function preparerPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const ratio = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponible");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.85);
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

  /* Section 3 — anglais */
  const [anglaisDeclare, setAnglaisDeclare] = useState("");
  const [reponsesEn, setReponsesEn] = useState<string[]>(Array(QUESTIONS_EN.length).fill(""));
  const [texteEn, setTexteEn] = useState("");

  /* Photo */
  const [photo, setPhoto] = useState("");
  const [photoNom, setPhotoNom] = useState("");
  const [photoErreur, setPhotoErreur] = useState("");
  const [consentement, setConsentement] = useState(false);

  const choisirPhoto = async (e: { target: { files: FileList | null } }) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoErreur("");
    if (f.size > 15 * 1024 * 1024) {
      setPhotoErreur("Cette image dépasse 15 Mo. Choisissez-en une plus légère.");
      return;
    }
    try {
      setPhoto(await preparerPhoto(f));
      setPhotoNom(f.name);
    } catch {
      setPhotoErreur("Cette image n'a pas pu être lue. Essayez une photo prise avec l'appareil photo du téléphone.");
    }
  };

  const repondre = (i: number, v: string) =>
    setReponsesEn((prev: string[]) => prev.map((x, k) => (k === i ? v : x)));

  const goTo = (n: number) => (e: React.FormEvent) => {
    e.preventDefault();
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goNext = goTo(2);

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
          anglaisDeclare, reponsesEn, texteEn,
          photo: consentement ? photo : "", consentement,
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
              stroke="#6bdde3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-3">
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
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
              step >= s ? "bg-gold text-background" : "bg-surface border border-border text-muted"
            }`}>
              {s}
            </div>
            <span className={`text-xs tracking-[0.15em] uppercase hidden sm:block ${step >= s ? "text-white" : "text-muted"}`}>
              {s === 1 ? "Informations personnelles" : s === 2 ? "Prestations & profil" : "Anglais"}
            </span>
            {s < 3 && <div className={`flex-1 h-px w-12 ${step > s ? "bg-gold" : "bg-border"}`} />}
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
            className="w-full py-4 bg-gold text-background font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,221,227,0.4)] mt-2"
          >
            Continuer — Section 2 →
          </button>
        </form>
      )}

      {/* ── Section 2 ── */}
      {step === 2 && (
        <form onSubmit={goTo(3)} noValidate className="flex flex-col gap-6">

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
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gold text-background font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,221,227,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
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
                "Continuer — Section 3 →"
              )}
            </button>
          </div>

        </form>
      )}

      {/* ── Section 3 : anglais ── */}
      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-background px-5 py-4">
            <p className="text-white text-sm font-semibold mb-1">Votre niveau d&apos;anglais</p>
            <p className="text-muted text-xs leading-6">
              Beaucoup de nos clients reçoivent des visiteurs étrangers. Ces questions nous
              aident à vous proposer les missions qui vous correspondent — il n&apos;y a pas de
              mauvaise réponse, et un niveau débutant n&apos;est pas éliminatoire.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className={labelCls}>Comment évaluez-vous votre anglais ? <span className="text-gold">*</span></p>
            <RadioGroup
              options={["Débutant", "Intermédiaire", "Courant", "Bilingue"]}
              value={anglaisDeclare}
              onChange={setAnglaisDeclare}
            />
          </div>

          {QUESTIONS_EN.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className={labelCls}>{i + 1}. {item.q}</p>
              <RadioGroup
                options={item.options}
                value={reponsesEn[i]}
                onChange={(v) => repondre(i, v)}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="c-texteen" className={labelCls}>
              In English: how would you welcome a visitor at a stand?
            </label>
            <textarea id="c-texteen" rows={4} value={texteEn}
              onChange={(e) => setTexteEn(e.target.value)}
              placeholder="Two or three sentences are enough."
              className={inputCls} />
            <p className="text-muted text-xs mt-2">
              Écrivez avec vos propres mots, même avec des fautes : c&apos;est ce qui nous
              apprend le plus sur votre niveau réel.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <p className={`${labelCls} pt-6`}>Votre photo</p>
            <p className="text-muted text-xs leading-6 -mt-1">
              Un portrait simple, de face, en lumière du jour. Pas besoin d&apos;une photo
              professionnelle : elle sert à vous reconnaître le jour de l&apos;entretien, et
              sera refaite lors du shooting si votre candidature est retenue.
            </p>

            <label className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg border border-dashed border-border bg-background text-muted text-sm cursor-pointer hover:border-gold/40 transition-colors duration-200">
              <input type="file" accept="image/*" capture="user" className="sr-only" onChange={choisirPhoto} />
              {photo ? "Choisir une autre photo" : "Ajouter une photo"}
            </label>

            {photo && (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Aperçu de votre photo" className="w-20 h-20 rounded-lg object-cover border border-border" />
                <div className="flex flex-col gap-1">
                  <span className="text-white text-xs">{photoNom}</span>
                  <button type="button" onClick={() => { setPhoto(""); setPhotoNom(""); }}
                    className="text-muted text-xs underline text-left hover:text-gold">
                    Retirer
                  </button>
                </div>
              </div>
            )}

            {photoErreur && <p className="text-red-400 text-xs">{photoErreur}</p>}

            {photo && (
              <label className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-background cursor-pointer text-sm text-muted">
                <input type="checkbox" className="mt-1 accent-gold" checked={consentement}
                  onChange={(e) => setConsentement(e.target.checked)} />
                <span className="text-xs leading-6">
                  J&apos;accepte qu&apos;Equalizer Studio conserve cette photo pour l&apos;étude de ma
                  candidature. Je peux demander son effacement à tout moment en écrivant à{" "}
                  <span className="text-white">contact.equalizerstudio@gmail.com</span>.
                </span>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-4 border border-border text-muted text-xs tracking-[0.2em] uppercase rounded-full hover:border-gold hover:text-gold transition-all duration-300"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gold text-background font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,221,227,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
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
