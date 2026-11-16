import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez l'histoire d'Equalizer Studio, agence de communication professionnelle à Madagascar depuis plus de 13 ans.",
};

const values = [
  {
    title: "Excellence",
    description:
      "Soigner les détails, viser une qualité d'éxecution premium et livrer unrendu à la hauteur des attentes. L'objectif : que chaque prestation fasse la différence."  
    },
  {
    title: "Énergie",
    description:
      "Apporter une vraie dynamique à chaque événement. Une présence vivante, professionnelle et positive qui transforme l’ambiance et donne du relief à l’expérience.",
  },
  {
    title: "Polyvalence",
    description:
      "Réunir plusieurs expertises dans une seule équipe : hôtesses, animation, photo, vidéo, drone, voix off, coordination terrain. Une solution complète, fluide et maîtrisée du début à la fin.",
  },
  {
    title: "Fiabilité",
    description:
      "Être présents, prêts et efficaces à chaque étape. Equalizer Studio inspire confiance par sa rigueur, son sens du terrain et sa capacité à assurer, même quand le rythme s’accélère.",
  },
];

const timeline = [
  {
    year: "Début",
    event: "Débuts à la radio",
    description: "Les premières expériences en animation et communication.",
  },
  {
    year: "+5 ans",
    event: "Production audiovisuelle",
    description:
      "5 ans au sein d'une chaîne de télévision malgache — expertise en photos et vidéos professionnelles.",
  },
  {
    year: "+12 ans",
    event: "Voix Off & Audio",
    description:
      "12 ans de voix à notre actif : spots TV, radio, présentations en 4 langues.",
  },
  {
    year: "Aujourd'hui",
    event: "Equalizer Studio",
    description:
      "Une agence complète offrant 6 services complémentaires pour couvrir tous vos besoins en communication.",
  },
];

export default function AProposPage() {
  return (
    <>
      {/* ── Page hero ──────────────────────────────────── */}
      <section className="relative h-72 lg:h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/second_image.png"
            alt=""
            fill
            className="object-cover object-top"
            priority
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 to-background"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-12 w-full">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
            Notre histoire
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            À Propos
          </h1>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
                Qui sommes-nous ?
              </p>
              <h2
                className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
              >
                Equalizer Studio, votre partenaire communication
              </h2>
              <div className="divider-gold w-16 mb-8" aria-hidden="true" />
              <div className="flex flex-col gap-5 text-muted text-base leading-8">
                <p>
                  Equalizer Studio est une agence de communication
                  professionnelle basée à Antananarivo, Madagascar. Née d&apos;une
                  passion profonde pour la communication et les médias, notre
                  agence rassemble des talents polyvalents et expérimentés.
                </p>
                <p>
                  Avec des racines dans la radio et la télévision malgache,
                  nous avons bâti au fil des années une expertise unique en
                  production audiovisuelle, voix off, évènementiel et
                  animation. Notre équipe cumule plus de 13 ans d&apos;expérience
                  dans ces domaines.
                </p>
                <p>
                  Aujourd&apos;hui, Equalizer Studio est votre interlocuteur
                  privilégié pour tous vos projets de communication —
                  qu&apos;il s&apos;agisse d&apos;un spot publicitaire, d&apos;un événement
                  d&apos;entreprise ou d&apos;une campagne promotionnelle.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="img-zoom relative h-96 lg:h-[500px] rounded-xl overflow-hidden border border-border">
                <Image
                  src="/first_image.png"
                  alt="L'équipe Equalizer Studio en action"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-surface border border-border rounded-xl p-6 shadow-2xl">
                <p
                  className="font-display text-4xl font-bold tracking-tight text-gold mb-1"
                >
                  13+
                </p>
                <p className="text-white/70 text-xs tracking-widest uppercase">
                  Ans d&apos;expérience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────── */}
      <section
        className="section-padding bg-surface"
        aria-labelledby="timeline-heading"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
              Notre parcours
            </p>
            <h2
              id="timeline-heading"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white"
            >
              Notre Histoire
            </h2>
            <div className="divider-gold w-24 mx-auto mt-6" aria-hidden="true" />
          </div>

          <ol className="relative max-w-3xl mx-auto list-none m-0 p-0">
            {/* Vertical line */}
            <div
              className="absolute left-8 top-0 bottom-0 w-px bg-border"
              aria-hidden="true"
            />

            {timeline.map((item, index) => (
              <li
                key={index}
                className="relative flex gap-8 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div
                  className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-background border border-gold flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-gold text-xs font-bold tracking-tight text-center leading-tight">
                    {item.year}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-3 pb-4">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.event}
                  </h3>
                  <p className="text-muted text-sm leading-7">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────── */}
      <section
        className="section-padding bg-background"
        aria-labelledby="values-heading"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
              Ce qui nous guide
            </p>
            <h2
              id="values-heading"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white"
            >
              Nos Valeurs
            </h2>
            <div className="divider-gold w-24 mx-auto mt-6" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-surface border border-border rounded-xl p-8 flex flex-col gap-4"
              >
                <div className="w-8 h-px bg-gold" aria-hidden="true" />
                <h3 className="text-white font-semibold text-lg">
                  {value.title}
                </h3>
                <p className="text-muted text-sm leading-7">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────── */}
      <section className="bg-surface border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Collaborons ensemble
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Votre projet est notre priorité
          </h2>
          <p className="text-muted text-base leading-8 mb-10">
            Faites confiance à notre expertise pour donner vie à vos projets
            de communication les plus ambitieux.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/nous-contacter"
              className="px-10 py-4 bg-gold text-background font-semibold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,221,227,0.4)]"
            >
              Contactez-nous
            </Link>
            <Link
              href="/nos-services"
              className="px-10 py-4 border border-gold text-gold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-gold hover:text-background transition-all duration-300"
            >
              Nos services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}



