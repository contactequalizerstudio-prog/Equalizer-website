import type { Metadata } from "next";
import CandidatureForm from "@/components/CandidatureForm";

export const metadata: Metadata = {
  title: "Postuler en tant que Hôtesse",
  description:
    "Rejoignez l'équipe Equalizer Studio. Remplissez le formulaire de candidature pour devenir hôtesse ou animatrice à Madagascar.",
};

export default function PostulerHotessePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-background border-b border-border py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Equalizer Booking
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
          >
            Formulaire de candidature
          </h1>
          <p className="text-muted text-base leading-7 max-w-xl mx-auto">
            Bienvenue sur le formulaire d&apos;inscription de l&apos;agence{" "}
            <span className="text-white font-semibold">Equalizer Studio</span>.
            Remplissez les 2 sections ci-dessous pour soumettre votre candidature.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section-padding bg-background">
        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          <div className="bg-surface border border-border rounded-2xl p-8 lg:p-10">
            <CandidatureForm />
          </div>
        </div>
      </section>
    </>
  );
}
