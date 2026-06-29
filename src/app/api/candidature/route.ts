import { Resend } from "resend";
import { NextResponse } from "next/server";

const DESTINATION_EMAIL = "contact.equalizerstudio@gmail.com";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const {
      nom, dateNaissance, email, telephone, adresse, facebook,
      activite, anneesAnimation, langues, disponibilites, agence,
      mensurations, prestationsHotesse, prestationsAnimatrice, cursus,
    } = body;

    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
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

            <h2 style="margin:0 0 14px;font-size:13px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Prestations & profil</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              ${row("Mensurations (cm)", mensurations)}
              ${row("Prestations hôtesse/jour", Array.isArray(prestationsHotesse) ? prestationsHotesse.join(", ") : prestationsHotesse)}
              ${row("Prestations animatrice/jour", Array.isArray(prestationsAnimatrice) ? prestationsAnimatrice.join(", ") : prestationsAnimatrice)}
              ${row("Cursus académique", cursus)}
            </table>

            <div style="background:#111;border-radius:8px;padding:14px 16px">
              <p style="margin:0;color:#888;font-size:12px">
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
      return NextResponse.json({ error: "Échec de l'envoi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Candidature API error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
