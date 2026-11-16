export type Service = {
  title: string;
  text: string;
  points: string[];
  href: string;
};

/** The six services, in console order. Titles double as the brief form options. */
export const SERVICES: Service[] = [
  {
    title: "Photos & Vidéos",
    text: "Cinq ans de production audiovisuelle, dont une expérience en chaîne de télévision. Des images soignées, pensées pour vos campagnes de communication.",
    points: ["Reportage photo", "Film d'entreprise et spot publicitaire", "Captation d'événement", "Prises de vue par drone"],
    href: "/nos-services#photos-videos",
  },
  {
    title: "Voix Off & Spot Audio",
    text: "Douze ans d'activité vocale au service des marques. Une voix pour vos spots vidéo, vos spots audio et vos présentations.",
    points: ["Malagasy, français, anglais, italien", "Spot radio et spot vidéo", "Présentation d'entreprise", "Enregistrement en studio"],
    href: "/nos-services#voix-off",
  },
  {
    title: "Évènementiel",
    text: "Une prise en charge complète, de l'arrivée des invités à la dernière image. Vous gardez un seul interlocuteur du début à la fin.",
    points: ["Accueil et coordination", "Animation et sonorisation", "Photo, vidéo et drone", "Voix off de l'événement"],
    href: "/nos-services#evenementiel",
  },
  {
    title: "MC & Animateur",
    text: "Un maître de cérémonie qui tient le rythme, met vos intervenants en valeur et garde la salle attentive.",
    points: ["Événements d'entreprise", "Conférences", "Galas", "Soirées de prestige"],
    href: "/nos-services#mc",
  },
  {
    title: "Hôtesses & Animatrices",
    text: "Des équipes formées à l'accueil et à l'animation, pour vos salons, vos conférences et vos opérations en point de vente.",
    points: ["Accueil et enregistrement", "Remise de badges et orientation", "Passation de micro", "CHR, GMS, salons, conférences"],
    href: "/nos-hotesses",
  },
  {
    title: "Team Building",
    text: "Des activités conçues sur mesure pour rapprocher vos collaborateurs autour des valeurs de votre entreprise.",
    points: ["Programme sur mesure", "Animation des activités", "Cohésion autour de vos valeurs", "Souvenirs photo et vidéo en option"],
    href: "/nos-services#team-building",
  },
];

/** Fired when a "Demander un devis" button preselects a service in the brief form. */
export const SERVICE_EVENT = "equalizer:service";
