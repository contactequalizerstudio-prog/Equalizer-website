import { Resend } from "resend";
import { NextResponse } from "next/server";

const DESTINATION_EMAIL = "contact.equalizerstudio@gmail.com";

/* Atlas et le site partagent la même base. La clé ci-dessous est la clé
   publiable : elle ne donne accès à rien par elle-même, la fonction appelée
   est la seule porte d'entrée des candidatures et elle valide tout. */
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://zgedkfxueyphaiinxxqq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_vMmZ66SdZdcbsCGoQk_oWQ_QhrmFpMa";

/* La correction reste ici, jamais dans la page : un score envoyé par le
   navigateur serait un score choisi par la candidate. */
const CORRIGE_EN = [
  "The toilets",
  "She has been working here since 2020",
  "Complete a form",
  "May",
  "7:30",
  "There are almost none left",
];

function noterAnglais(reponses: unknown) {
  const r = Array.isArray(reponses) ? reponses : [];
  const score = CORRIGE_EN.reduce(
    (n, bonne, i) => n + (typeof r[i] === "string" && r[i].trim() === bonne ? 1 : 0),
    0
  );
  return { score, sur: CORRIGE_EN.length };
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const {
      nom, dateNaissance, email, telephone, adresse, facebook,
      activite, anneesAnimation, langues, disponibilites, agence,
      mensurations, prestationsHotesse, prestationsAnimatrice, cursus,
      anglaisDeclare, reponsesEn, texteEn, photo, consentement,
    } = body;

    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const anglais = noterAnglais(reponsesEn);

    /* La photo voyage avec la candidature, par la même porte. Elle est rangée
       dans la base, jamais dans un espace adressable : aucune URL n'existe pour
       le portrait d'une candidate. Sans consentement, rien n'est transmis. */
    const consenti = consentement === true;
    const photoBase64 =
      consenti && typeof photo === "string" && photo.startsWith("data:image/")
        ? photo.slice(photo.indexOf(",") + 1)
        : "";

    /* La base d'abord : c'est elle qui fait foi et qui alimente Atlas.
       L'e-mail reste ensuite comme avis, et comme filet si la base refuse. */
    let enregistree = false;
    try {
      const rep = await fetch(`${SUPABASE_URL}/rest/v1/rpc/candidature_envoyer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          p: {
            nom, date_naissance: dateNaissance, email, telephone, adresse, facebook,
            activite, annees_animation: anneesAnimation,
            langues: Array.isArray(langues) ? langues : langues ? [langues] : [],
            disponibilites,
            agence: Array.isArray(agence) ? agence.join(", ") : agence,
            mensurations,
            prestations_hotesse: Array.isArray(prestationsHotesse) ? prestationsHotesse : [],
            prestations_animatrice: Array.isArray(prestationsAnimatrice) ? prestationsAnimatrice : [],
            cursus,
            anglais_declare: anglaisDeclare,
            anglais_score: anglais.score,
            anglais_sur: anglais.sur,
            anglais_reponse: texteEn,
            photo_base64: photoBase64,
            consentement_photo: consenti,
          },
        }),
      });
      const verdict = await rep.text();
      enregistree = rep.ok && verdict.includes("ok");
      if (verdict.includes("ok_sans_photo")) console.warn("Candidature créée sans la photo (image refusée).");
      if (!enregistree) console.error("Candidature non enregistrée :", rep.status, verdict);
    } catch (err) {
      console.error("Supabase injoignable :", err);
    }

    const row = (label: string, value: string) =>
      `<tr>
        <td style="padding:9px 0;color:#888;font-size:13px;width:200px;vertical-align:top;border-bottom:1px solid #1a1a1a">${label}</td>
        <td style="padding:9px 0;color:#fff;font-size:13px;border-bottom:1px solid #1a1a1a">${value || "—"}</td>
      </tr>`;

    const { error } = await resend.emails.send({
      from: "Equalizer Studio <onboarding@resend.dev>",
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: `[Equalizer Booking] Candidature hôtesse — ${nom}`,
      html: `
        <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#0e8ec4;padding:24px 32px">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7)">Equalizer Booking</p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff">Nouvelle candidature hôtesse</h1>
          </div>
          <div style="padding:32px">

            <h2 style="margin:0 0 14px;font-size:13px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Informations personnelles</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              ${row("Nom / Prénom", nom)}
              ${row("Date de naissance", dateNaissance)}
              ${row("Email", `<a href="mailto:${email}" style="color:#0e8ec4">${email}</a>`)}
              ${row("Téléphone", telephone)}
              ${row("Adresse", adresse)}
              ${row("Profil Facebook", facebook)}
            </table>

            <h2 style="margin:0 0 14px;font-size:13px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Profil professionnel</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              ${row("Activité actuelle", activite)}
              ${row("Années en animation", anneesAnimation)}
              ${row("Langues maîtrisées", Array.isArray(langues) ? langues.join(", ") : langues)}
              ${row("Disponibilités", disponibilites)}
              ${row("Déjà dans une agence", agence)}
            </table>

            <h2 style="margin:0 0 14px;font-size:13px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Anglais</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              ${row("Niveau annoncé", anglaisDeclare)}
              ${row("Questionnaire", `${anglais.score} / ${anglais.sur}`)}
              ${row("Réponse libre", texteEn)}
              ${row("Photo", photoBase64 ? "Oui, jointe avec accord" : "Non")}
            </table>

            <h2 style="margin:0 0 14px;font-size:13px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Prestations & profil</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              ${row("Mensurations (cm)", mensurations)}
              ${row("Prestations hôtesse/jour", Array.isArray(prestationsHotesse) ? prestationsHotesse.join(", ") : prestationsHotesse)}
              ${row("Prestations animatrice/jour", Array.isArray(prestationsAnimatrice) ? prestationsAnimatrice.join(", ") : prestationsAnimatrice)}
              ${row("Cursus académique", cursus)}
            </table>

            <div style="background:#111;border-radius:8px;padding:14px 16px">
              <p style="margin:0;color:#888;font-size:12px">
                ${enregistree
                  ? "✅ Candidature créée dans Atlas, rubrique Recrutement. Rien à ressaisir."
                  : "⚠️ Non enregistrée dans Atlas — à saisir à la main, ou à relancer."}
              </p>
              <p style="margin:8px 0 0;color:#888;font-size:12px">
                📸 Rappel : demander une photo buste et sur pieds via WhatsApp au <strong style="color:#fff">+261 32 25 407 73</strong>
              </p>
            </div>
          </div>
          <div style="padding:20px 32px;background:#111;text-align:center">
            <p style="color:#555;font-size:11px;margin:0">Equalizer Studio — Antananarivo, Madagascar</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // La candidature est en base : on ne renvoie pas d'échec à la candidate
      // pour un e-mail d'avis qui n'est pas parti.
      if (enregistree) return NextResponse.json({ success: true, enregistree });
      return NextResponse.json({ error: "Échec de l'envoi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, enregistree });
  } catch (err) {
    console.error("Candidature API error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
