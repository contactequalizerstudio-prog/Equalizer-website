import { Resend } from "resend";
import { NextResponse } from "next/server";

const DESTINATION_EMAIL = "contact.equalizerstudio@gmail.com";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { name, email, phone, event, eventDate, message, selectedHotesses } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const hotessesList = (selectedHotesses as string[]).join(", ") || "Non renseigné";
    const hotessesRows = (selectedHotesses as string[])
      .map(
        (h) =>
          `<tr><td style="padding:6px 12px;color:#fff;font-size:13px;border-bottom:1px solid #222">✦ ${h}</td></tr>`
      )
      .join("");

    const { error } = await resend.emails.send({
      from: "Equalizer Studio <onboarding@resend.dev>",
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: `[Equalizer Booking] Réservation de ${name} — ${selectedHotesses.length} hôtesse(s)`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#0e8ec4;padding:24px 32px">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7)">Equalizer Booking</p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff">Nouvelle réservation d'hôtesses</h1>
          </div>

          <div style="padding:32px">
            <h2 style="margin:0 0 16px;font-size:14px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">Informations du client</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;width:160px;vertical-align:top">Nom</td>
                <td style="padding:10px 0;color:#fff;font-size:13px">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Email</td>
                <td style="padding:10px 0;font-size:13px"><a href="mailto:${email}" style="color:#0e8ec4">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Téléphone</td>
                <td style="padding:10px 0;color:#fff;font-size:13px">${phone || "Non renseigné"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Événement</td>
                <td style="padding:10px 0;color:#fff;font-size:13px">${event || "Non renseigné"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Date</td>
                <td style="padding:10px 0;color:#fff;font-size:13px">${eventDate || "Non renseigné"}</td>
              </tr>
            </table>

            <h2 style="margin:0 0 12px;font-size:14px;color:#0e8ec4;letter-spacing:0.15em;text-transform:uppercase">
              Hôtesses sélectionnées (${selectedHotesses.length})
            </h2>
            <table style="width:100%;border-collapse:collapse;background:#111;border-radius:8px;overflow:hidden;margin-bottom:28px">
              ${hotessesRows || `<tr><td style="padding:12px;color:#888;font-size:13px">Aucune sélection</td></tr>`}
            </table>

            ${
              message
                ? `<div style="padding-top:20px;border-top:1px solid #222">
                    <p style="color:#888;font-size:13px;margin:0 0 10px">Message complémentaire</p>
                    <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
                  </div>`
                : ""
            }
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
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
