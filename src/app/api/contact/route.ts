import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const DESTINATION_EMAIL = "mihajamikalo@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, services, autreService, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const selectedServices = (services as string[])
      .map((s: string) =>
        s === "Autre" && autreService ? `Autre (${autreService})` : s
      )
      .join(", ");

    const { error } = await resend.emails.send({
      from: "Equalizer Studio <onboarding@resend.dev>",
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: `[Equalizer Studio] Demande de ${name}${selectedServices ? ` — ${selectedServices}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#0e8ec4;padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:600;color:#fff">Nouvelle demande de contact</h1>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
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
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Services souhaités</td>
                <td style="padding:10px 0;color:#fff;font-size:13px">${selectedServices || "Non renseigné"}</td>
              </tr>
            </table>
            <div style="margin-top:24px;padding-top:24px;border-top:1px solid #222">
              <p style="color:#888;font-size:13px;margin:0 0 10px">Message</p>
              <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
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
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
