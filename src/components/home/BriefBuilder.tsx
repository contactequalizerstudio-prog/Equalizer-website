"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERVICES, SERVICE_EVENT } from "./services";

const WHATSAPP = "261346493198";
const EMAIL = "contact.equalizerstudio@gmail.com";
const OPTIONS = [...SERVICES.map((s) => s.title), "Plusieurs prestations"];

/** Builds a ready-to-send WhatsApp message from a few fields. Nothing is sent from the page itself. */
export default function BriefBuilder() {
  const [nom, setNom] = useState("");
  const [soc, setSoc] = useState("");
  const [srv, setSrv] = useState(OPTIONS[0]);
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState(`Ou collez-le dans un email à ${EMAIL}.`);
  const preview = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onService = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (OPTIONS.includes(name)) setSrv(name);
    };
    window.addEventListener(SERVICE_EVENT, onService);
    return () => window.removeEventListener(SERVICE_EVENT, onService);
  }, []);

  const who = nom.trim();
  const company = soc.trim();
  const lines = ["Bonjour Equalizer Studio,", ""];
  lines.push(
    who
      ? `Je suis ${who}${company ? ` (${company})` : ""}.`
      : company
        ? `Je vous écris pour ${company}.`
        : "Je souhaite vous parler d'un projet."
  );
  lines.push(`Prestation : ${srv}`);
  if (date.trim()) lines.push(`Date souhaitée : ${date.trim()}`);
  if (msg.trim()) lines.push("", msg.trim());
  lines.push("", "Pouvez-vous me recontacter ? Merci.");
  const text = lines.join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setNote(`Message copié. Collez-le dans WhatsApp ou dans un email à ${EMAIL}.`);
    } catch {
      preview.current?.focus();
      preview.current?.select();
      setNote("Le message est sélectionné : copiez-le avec Ctrl+C.");
    }
  };

  return (
    <form className="brief" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="f">
        <label htmlFor="brief-nom">Votre nom</label>
        <input id="brief-nom" autoComplete="name" placeholder="Rakoto Andry" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <div className="f">
        <label htmlFor="brief-soc">Société</label>
        <input id="brief-soc" autoComplete="organization" placeholder="Facultatif" value={soc} onChange={(e) => setSoc(e.target.value)} />
      </div>
      <div className="f">
        <label htmlFor="brief-srv">Prestation</label>
        <select id="brief-srv" value={srv} onChange={(e) => setSrv(e.target.value)}>
          {OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="f">
        <label htmlFor="brief-date">Date souhaitée</label>
        <input id="brief-date" placeholder="ex. 18 décembre" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="f full">
        <label htmlFor="brief-msg">Votre projet</label>
        <textarea id="brief-msg" placeholder="Lieu, nombre d'invités, objectif…" value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <div className="f full">
        <label htmlFor="brief-preview">Message prêt à envoyer</label>
        <textarea id="brief-preview" className="preview" readOnly ref={preview} value={text} />
      </div>
      <div className="send">
        <a
          className="btn btn-main"
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Envoyer sur WhatsApp{" "}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </a>
        <button className="btn btn-ghost" type="button" onClick={copy}>
          Copier le message
        </button>
        <small role="status">{note}</small>
        <small>
          Vous préférez écrire par email ?{" "}
          <Link className="text-link" href="/nous-contacter">
            Utilisez le formulaire de contact
          </Link>
          .
        </small>
      </div>
    </form>
  );
}
