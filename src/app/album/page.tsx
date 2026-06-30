import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllItemsAsync } from "@/lib/album-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio & Album",
  description:
    "Découvrez le portfolio d'Equalizer Studio : productions photo et vidéo, événements, voix off et bien plus encore à Madagascar.",
};

const logosRow1 = [
  { src: "/Logo Partenaire/Airtel_logo-01.png",            alt: "Airtel" },
  { src: "/Logo Partenaire/Axian.png",                     alt: "Axian" },
  { src: "/Logo Partenaire/Bledina.jpg",                   alt: "Blédina" },
  { src: "/Logo Partenaire/Blueline.png",                  alt: "Blueline" },
  { src: "/Logo Partenaire/BNI.png",                       alt: "BNI" },
  { src: "/Logo Partenaire/Bred.png",                      alt: "BRED" },
  { src: "/Logo Partenaire/ccia.png",                      alt: "CCIA" },
  { src: "/Logo Partenaire/ccifm.jpg",                     alt: "CCIFM" },
  { src: "/Logo Partenaire/cropped-logo_MBALIK-02.png",    alt: "Mbalik" },
  { src: "/Logo Partenaire/Delta.png",                     alt: "Delta" },
  { src: "/Logo Partenaire/escm.png",                      alt: "ESCM" },
  { src: "/Logo Partenaire/Galana.png",                    alt: "Galana" },
  { src: "/Logo Partenaire/Gcam.png",                      alt: "Gcam" },
  { src: "/Logo Partenaire/Guinot-Logo.png",               alt: "Guinot" },
  { src: "/Logo Partenaire/Inviso.png",                    alt: "Inviso" },
  { src: "/Logo Partenaire/Jovena.png",                    alt: "Jovena" },
  { src: "/Logo Partenaire/Landis Automotive.png",         alt: "Landis Automotive" },
  { src: "/Logo Partenaire/Legrand.png",                   alt: "Legrand" },
  { src: "/Logo Partenaire/logistique-petroliere-11.jpg",  alt: "Logistique Pétrolière" },
  { src: "/Logo Partenaire/LOGO NP AKADIN - V005 PNG.png", alt: "NP Akadin" },
];

const logosRow2 = [
  { src: "/Logo Partenaire/logo-batpro-final.webp",        alt: "Batpro" },
  { src: "/Logo Partenaire/logo-edl-groupe.jpg",           alt: "EDL Groupe" },
  { src: "/Logo Partenaire/Masoala.png",                   alt: "Masoala" },
  { src: "/Logo Partenaire/Matechmad.jpeg",                alt: "Matechmad" },
  { src: "/Logo Partenaire/materauto.png",                 alt: "Materauto" },
  { src: "/Logo Partenaire/MCB.png",                       alt: "MCB" },
  { src: "/Logo Partenaire/MCC.jpeg",                      alt: "MCC" },
  { src: "/Logo Partenaire/MTA.jpeg",                      alt: "MTA" },
  { src: "/Logo Partenaire/Nicolas_logo.svg_.png",         alt: "Nicolas" },
  { src: "/Logo Partenaire/odity.png",                     alt: "Odity" },
  { src: "/Logo Partenaire/ONTM.png",                      alt: "ONTM" },
  { src: "/Logo Partenaire/Oxxan.jpeg",                    alt: "Oxxan" },
  { src: "/Logo Partenaire/Presidence.jpeg",               alt: "Présidence" },
  { src: "/Logo Partenaire/pulse_for_you_logo.jpeg",       alt: "Pulse For You" },
  { src: "/Logo Partenaire/Ravinala Airports.png",         alt: "Ravinala Airports" },
  { src: "/Logo Partenaire/San Cristobal.jpeg",            alt: "San Cristobal" },
  { src: "/Logo Partenaire/Sodirex.png",                   alt: "Sodirex" },
  { src: "/Logo Partenaire/taf.png",                       alt: "TAF" },
  { src: "/Logo Partenaire/Total energies.svg",            alt: "TotalEnergies" },
  { src: "/Logo Partenaire/viseo-logo2.webp",              alt: "Viseo" },
];

export default async function AlbumPage() {
  const galleryItems = await getAllItemsAsync();

  return (
    <>
      {/* ── Page hero ──────────────────────────────────── */}
      <section className="relative h-72 lg:h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/album-cover.jpeg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-12 w-full">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
            Nos réalisations
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white"
            style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
          >
            Portfolio &amp; Album
          </h1>
        </div>
      </section>

      {/* ── Intro ───────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-muted text-base leading-8 max-w-2xl">
              Retrouvez ici une sélection de nos meilleures réalisations —
              productions audiovisuelles, événements, animations et bien plus
              encore. Chaque projet témoigne de notre savoir-faire et de notre
              engagement envers l&apos;excellence.
            </p>
            <Link
              href="/nous-contacter"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold hover:text-black transition-all duration-300"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gallery grid ─────────────────────────────────── */}
      <section
        className="section-padding bg-background"
        aria-labelledby="gallery-heading"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2
              id="gallery-heading"
              className="font-display text-4xl sm:text-5xl font-light text-white"
              style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
            >
              Galerie
            </h2>
            <div className="divider-gold w-24 mx-auto mt-4" aria-hidden="true" />
          </div>

          {galleryItems.length === 0 ? (
            <p className="text-center text-muted py-16">
              Aucune réalisation pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`img-zoom relative rounded-xl overflow-hidden border border-border group cursor-pointer ${
                    index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                  } ${index === 3 ? "lg:col-span-2" : ""} ${
                    index === 0 || index === 3 ? "h-80" : "h-64"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: item.objectPosition ?? "center center" }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-gold text-xs tracking-[0.2em] uppercase block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-white font-semibold text-base">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.event}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Partenaires / Logo marquee ───────────────────────── */}
      <section
        className="section-padding bg-surface"
        aria-labelledby="partners-heading"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
              Ils nous ont fait confiance
            </p>
            <h2
              id="partners-heading"
              className="font-display text-4xl sm:text-5xl font-light text-white"
              style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
            >
              Nos Partenaires
            </h2>
            <div className="divider-gold w-24 mx-auto mt-6" aria-hidden="true" />
          </div>
        </div>

        {/* Rangée 1 — droite → gauche */}
        <div className="marquee-row overflow-hidden mb-5" aria-hidden="true">
          <div className="animate-marquee-rtl flex w-max">
            {[...logosRow1, ...logosRow1].map((logo, i) => (
              <div
                key={i}
                className="mx-3 shrink-0 flex items-center justify-center rounded-xl bg-white px-4"
                style={{ width: 148, height: 68 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={52}
                  className="object-contain max-h-full"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 — gauche → droite */}
        <div className="marquee-row overflow-hidden" aria-hidden="true">
          <div className="animate-marquee-ltr flex w-max">
            {[...logosRow2, ...logosRow2].map((logo, i) => (
              <div
                key={i}
                className="mx-3 shrink-0 flex items-center justify-center rounded-xl bg-white px-4"
                style={{ width: 148, height: 68 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={52}
                  className="object-contain max-h-full"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted text-sm italic mt-10">
          ...et bien d&apos;autres clients et partenaires à travers Madagascar.
        </p>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-background border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Votre prochain événement
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-ibrand), sans-serif" }}
          >
            Créons quelque chose d&apos;exceptionnel
          </h2>
          <p className="text-muted text-base leading-8 mb-10">
            Votre projet mérite d&apos;être dans notre portfolio. Contactez-nous
            dès aujourd&apos;hui pour discuter de vos besoins.
          </p>
          <Link
            href="/nous-contacter"
            className="inline-flex items-center px-10 py-4 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,142,196,0.4)]"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </>
  );
}
