import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroEqualizer from "@/components/home/HeroEqualizer";
import ServiceConsole from "@/components/home/ServiceConsole";
import BriefBuilder from "@/components/home/BriefBuilder";
import "./home.css";

export const metadata: Metadata = {
  title: "Equalizer Studio | Agence de communication et événementielle à Antananarivo",
  description:
    "Equalizer Studio, agence de communication et événementielle à Antananarivo : photo et vidéo, voix off en 4 langues, événementiel, MC, hôtesses, team building.",
};

const stats = [
  { value: "13+", label: "ans d'expérience" },
  { value: "100+", label: "événements réalisés" },
  { value: "50+", label: "clients satisfaits" },
  { value: "4", label: "langues en voix off" },
];

const voices = [
  { word: "Tongasoa", lang: "mg", label: "Malagasy" },
  { word: "Bienvenue", lang: "fr", label: "Français" },
  { word: "Welcome", lang: "en", label: "English" },
  { word: "Benvenuti", lang: "it", label: "Italiano" },
];

const work = [
  { src: "/first_image.png", kicker: "Production", title: "Photos & Vidéos", sizes: "(max-width: 820px) 100vw, 42vw" },
  { src: "/12.png", kicker: "Événement", title: "Évènementiel", sizes: "(max-width: 820px) 100vw, 30vw" },
  { src: "/voice.jpeg", kicker: "Médias", title: "Voix Off & Audio", sizes: "(max-width: 820px) 100vw, 30vw" },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/EqualizerStudioMG" },
  { label: "Instagram", href: "https://www.instagram.com/studio.equalizer/" },
  { label: "TikTok", href: "https://www.tiktok.com/@equalizer_studio" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/equalizer-studio" },
];

const logosRow1 = [
  { src: "/Logo partenaire/Airtel_logo-01.png",            alt: "Airtel" },
  { src: "/Logo partenaire/Axian.png",                     alt: "Axian" },
  { src: "/Logo partenaire/Bledina.jpg",                   alt: "Blédina" },
  { src: "/Logo partenaire/Blueline.png",                  alt: "Blueline" },
  { src: "/Logo partenaire/BNI.png",                       alt: "BNI" },
  { src: "/Logo partenaire/Bred.png",                      alt: "BRED" },
  { src: "/Logo partenaire/ccia.png",                      alt: "CCIA" },
  { src: "/Logo partenaire/ccifm.jpg",                     alt: "CCIFM" },
  { src: "/Logo partenaire/cropped-logo_MBALIK-02.png",    alt: "Mbalik" },
  { src: "/Logo partenaire/Delta.png",                     alt: "Delta" },
  { src: "/Logo partenaire/escm.png",                      alt: "ESCM" },
  { src: "/Logo partenaire/Galana.png",                    alt: "Galana" },
  { src: "/Logo partenaire/Gcam.png",                      alt: "Gcam" },
  { src: "/Logo partenaire/Guinot-Logo.png",               alt: "Guinot" },
  { src: "/Logo partenaire/Inviso.png",                    alt: "Inviso" },
  { src: "/Logo partenaire/Jovena.png",                    alt: "Jovena" },
  { src: "/Logo partenaire/Landis Automotive.png",         alt: "Landis Automotive" },
  { src: "/Logo partenaire/Legrand.png",                   alt: "Legrand" },
  { src: "/Logo partenaire/logistique-petroliere-11.jpg",  alt: "Logistique Pétrolière" },
  { src: "/Logo partenaire/LOGO NP AKADIN - V005 PNG.png", alt: "NP Akadin" },
];

const logosRow2 = [
  { src: "/Logo partenaire/logo-batpro-final.webp",        alt: "Batpro" },
  { src: "/Logo partenaire/logo-edl-groupe.jpg",           alt: "EDL Groupe" },
  { src: "/Logo partenaire/Masoala.png",                   alt: "Masoala" },
  { src: "/Logo partenaire/Matechmad.jpeg",                alt: "Matechmad" },
  { src: "/Logo partenaire/materauto.png",                 alt: "Materauto" },
  { src: "/Logo partenaire/MCB.png",                       alt: "MCB" },
  { src: "/Logo partenaire/MCC.jpeg",                      alt: "MCC" },
  { src: "/Logo partenaire/MTA.jpeg",                      alt: "MTA" },
  { src: "/Logo partenaire/Nicolas_logo.svg_.png",         alt: "Nicolas" },
  { src: "/Logo partenaire/odity.png",                     alt: "Odity" },
  { src: "/Logo partenaire/ONTM.png",                      alt: "ONTM" },
  { src: "/Logo partenaire/Oxxan.jpeg",                    alt: "Oxxan" },
  { src: "/Logo partenaire/Presidence.jpeg",               alt: "Présidence" },
  { src: "/Logo partenaire/pulse_for_you_logo.jpeg",       alt: "Pulse For You" },
  { src: "/Logo partenaire/Ravinala Airports.png",         alt: "Ravinala Airports" },
  { src: "/Logo partenaire/San Cristobal.jpeg",            alt: "San Cristobal" },
  { src: "/Logo partenaire/Sodirex.png",                   alt: "Sodirex" },
  { src: "/Logo partenaire/taf.png",                       alt: "TAF" },
  { src: "/Logo partenaire/Total energies.svg",            alt: "TotalEnergies" },
  { src: "/Logo partenaire/viseo-logo2.webp",              alt: "Viseo" },
];

type Logo = { src: string; alt: string };

function LogoRail({ logos, reverse = false }: { logos: Logo[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "rail reverse" : "rail"}>
      <ul className="track">
        {[...logos, ...logos].map((logo, i) => {
          const copy = i >= logos.length;
          return (
            <li key={i} aria-hidden={copy || undefined}>
              <Image src={logo.src} alt={copy ? "" : logo.alt} width={124} height={56} unoptimized />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const Arrow = () => (
  <span className="arrow" aria-hidden="true">
    →
  </span>
);

export default function HomePage() {
  return (
    <div className="home">
      {/* ── Hero ────────────────────────────────────────── */}
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">Agence de communication &amp; événementielle · Antananarivo</p>
          <h1>
            Soutenir ceux qui veulent <em>évoluer</em>
          </h1>
          <p className="lede">
            Depuis plus de 13 ans, Equalizer Studio donne de la voix, de l&apos;image et de la scène aux projets des
            entreprises et des particuliers à Madagascar.
          </p>
          <div className="cta">
            <a className="btn btn-main" href="#contact">
              Parler de mon projet <Arrow />
            </a>
            <a className="btn btn-ghost" href="#services">
              Voir les six services
            </a>
          </div>
        </div>
        <HeroEqualizer />
        <div className="wrap">
          <dl className="stats">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Services ────────────────────────────────────── */}
      <section id="services" className="band" aria-labelledby="services-title">
        <div className="wrap">
          <div className="head">
            <div>
              <p className="eyebrow">Nos services</p>
              <h2 id="services-title">Six pistes, une seule régie.</h2>
            </div>
            <p className="lede">
              Chaque métier se réserve seul. Ensemble, ils couvrent un événement de l&apos;accueil des invités
              jusqu&apos;au film souvenir.
            </p>
          </div>
          <ServiceConsole />
        </div>
      </section>

      {/* ── Voix off ────────────────────────────────────── */}
      <section id="voix" className="band tight" aria-labelledby="voix-title">
        <div className="wrap">
          <div className="head">
            <div>
              <p className="eyebrow">Voix off &amp; spot audio</p>
              <h2 id="voix-title">Douze ans de micro, quatre langues.</h2>
            </div>
            <p className="lede">
              Spots vidéo, spots radio, présentations d&apos;entreprise. La même voix porte votre message auprès de
              chaque public.
            </p>
          </div>
          <div className="voices">
            {voices.map((voice) => (
              <div className="voice" key={voice.lang}>
                <q lang={voice.lang}>{voice.word}</q>
                <span>{voice.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hôtesses ────────────────────────────────────── */}
      <section id="hotesses" className="band tight" aria-labelledby="hotesses-title">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Hôtesses &amp; animatrices</p>
            <h2 id="hotesses-title">Le premier sourire de votre événement.</h2>
            <p className="lede">
              Nos équipes accueillent, orientent et animent. Elles connaissent le terrain, du salon professionnel à
              l&apos;activation en grande surface.
            </p>
            <ul className="tags" aria-label="Terrains d'intervention">
              <li>CHR</li>
              <li>GMS</li>
              <li>Salons</li>
              <li>Conférences</li>
              <li>Activations commerciales</li>
            </ul>
            <div className="actions">
              <Link className="btn btn-ghost" href="/reserver-hotesses">
                Réserver une équipe <Arrow />
              </Link>
              <Link className="text-link" href="/nos-hotesses">
                Voir nos hôtesses
              </Link>
            </div>
          </div>
          <ol className="steps">
            <li>
              <div>
                <b>Accueil des invités</b>
                <span>Une présence soignée dès l&apos;entrée.</span>
              </div>
            </li>
            <li>
              <div>
                <b>Enregistrement</b>
                <span>Listes, pointage et remise des badges.</span>
              </div>
            </li>
            <li>
              <div>
                <b>Orientation</b>
                <span>Chaque invité trouve sa place et son programme.</span>
              </div>
            </li>
            <li>
              <div>
                <b>Passation de micro</b>
                <span>Les échanges avec la salle restent fluides.</span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Réalisations ────────────────────────────────── */}
      <section id="realisations" className="band tight" aria-labelledby="realisations-title">
        <div className="wrap">
          <div className="head">
            <div>
              <p className="eyebrow">Réalisations</p>
              <h2 id="realisations-title">Vu, entendu, vécu.</h2>
            </div>
            <Link className="btn btn-ghost" href="/album">
              Voir tout le portfolio <Arrow />
            </Link>
          </div>
          <div className="work">
            {work.map((item) => (
              <Link className="tile" href="/album" key={item.title}>
                <Image src={item.src} alt="" fill sizes={item.sizes} />
                <small>{item.kicker}</small>
                <b>{item.title}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Références (bande claire) ───────────────────── */}
      <section id="references" className="refs" aria-labelledby="references-title">
        <div className="wrap">
          <div className="head" style={{ marginBottom: 32 }}>
            <div>
              <p className="eyebrow">Nos références</p>
              <h2 id="references-title">Ils nous ont confié leur image.</h2>
            </div>
            <p className="lede">
              Banques, télécoms, énergie, automobile, institutions. Quarante marques nous ont déjà fait confiance.
            </p>
          </div>
        </div>
        <LogoRail logos={logosRow1} />
        <LogoRail logos={logosRow2} reverse />
        <div className="wrap">
          <p className="more">…et bien d&apos;autres clients et partenaires à travers Madagascar.</p>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────── */}
      <section id="contact" className="band" aria-labelledby="contact-title">
        <div className="wrap contact">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title">
              Travaillons <em>ensemble</em>
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Décrivez votre projet en quelques lignes. Le message se rédige tout seul, il ne reste qu&apos;à
              l&apos;envoyer.
            </p>
            <dl className="coords">
              <div>
                <dt>Téléphone</dt>
                <dd>
                  <a href="tel:+261346493198">+261 34 64 931 98</a>
                  <br />
                  <a href="tel:+261322540773">+261 32 25 407 73</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:contact.equalizerstudio@gmail.com">contact.equalizerstudio@gmail.com</a>
                </dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>
                  Lot II A 122 FK Nanisana
                  <br />
                  Antananarivo, Madagascar
                </dd>
              </div>
              <div>
                <dt>Réseaux</dt>
                <dd className="socials">
                  {socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                      {social.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <BriefBuilder />
        </div>
      </section>
    </div>
  );
}
