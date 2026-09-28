import type { Metadata } from "next";
import HotesseBooking from "@/components/HotesseBooking";
import { stripPrivateHostessFields } from "@/lib/hostess-privacy";
import { getAllHostessesAsync, getAllHostesses } from "@/lib/hostess-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réserver des Hôtesses",
  description:
    "Choisissez et réservez vos hôtesses et animatrices Equalizer Studio pour votre événement à Madagascar.",
};

export default async function ReserverHotessesPage() {
  const records = process.env.VERCEL
    ? await getAllHostessesAsync()
    : getAllHostesses();
  const hostesses = records.map(stripPrivateHostessFields);

  return (
    <>
      <section className="bg-background border-b border-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Equalizer Booking
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
          >
            Choisissez vos hôtesses
          </h1>
          <p className="text-muted text-base leading-7 max-w-xl mx-auto">
            Parcourez notre équipe, sélectionnez les hôtesses qui correspondent
            à votre événement, puis finalisez votre réservation.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <HotesseBooking hostesses={hostesses} />
        </div>
      </section>
    </>
  );
}
