import type { Metadata } from "next";
import HotesseBooking from "@/components/HotesseBooking";
import { getAllHostessesAsync, getAllHostesses } from "@/lib/hostess-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réserver des Hôtesses",
  description:
    "Choisissez et réservez vos hôtesses et animatrices Equalizer Studio pour votre événement à Madagascar.",
};

export default async function ReserverHotessesPage() {
  const hostesses = process.env.VERCEL
    ? await getAllHostessesAsync()
    : getAllHostesses();

  return (
    <>
      <section className="bg-background border-b border-border pt-32 pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Equalizer Booking
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
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
