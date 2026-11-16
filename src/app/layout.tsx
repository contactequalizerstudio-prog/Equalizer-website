import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Bricolage Grotesque: display / headings ─────────────── */
const bricolage = localFont({
  src: "../fonts/BricolageGrotesque-Variable.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-bricolage",
  display: "swap",
});

/* ── Instrument Sans: body / UI text ─────────────────────── */
const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSans-Variable.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/InstrumentSans-Italic-Variable.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

/* ── Caveat: handwritten accent, as in the logo ──────────── */
const caveat = localFont({
  src: "../fonts/Caveat-SemiBold.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://equalizerstudio.mg"
  ),
  title: {
    default: "Equalizer Studio | Agence de Communication Professionnelle",
    template: "%s | Equalizer Studio",
  },
  description:
    "Equalizer Studio, votre agence de communication professionnelle à Madagascar. Photos, vidéos, voix off, évènementiel, MC, hôtesses et team building depuis plus de 13 ans.",
  keywords: [
    "Equalizer Studio",
    "agence communication Madagascar",
    "voix off Madagascar",
    "évènementiel Antananarivo",
    "hôtesses Madagascar",
    "photos vidéos Madagascar",
    "MC animateur Madagascar",
    "team building",
    "spot audio",
  ],
  authors: [{ name: "Equalizer Studio" }],
  creator: "Equalizer Studio",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_MG",
    siteName: "Equalizer Studio",
    title: "Equalizer Studio | Agence de Communication Professionnelle",
    description:
      "Votre partenaire de confiance en communication professionnelle à Madagascar. Photos, vidéos, voix off, évènementiel et plus.",
    images: [
      {
        url: "/logo-dark.jpeg",
        width: 1024,
        height: 878,
        alt: "Equalizer Studio — Agence de Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equalizer Studio | Agence de Communication",
    description:
      "Votre partenaire en communication professionnelle à Madagascar.",
    images: ["/logo-dark.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "SzVAsO9qIH6b2GvwaQNrq7M8JFgs_B_doUiPqi7Kb5o",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Equalizer Studio",
  description:
    "Agence de communication professionnelle à Madagascar. Photos, vidéos, voix off, évènementiel, MC, hôtesses et team building.",
  url: "https://equalizerstudio.mg",
  logo: "https://equalizerstudio.mg/logo-dark.jpeg",
  image: "https://equalizerstudio.mg/logo-dark.jpeg",
  email: "contact.equalizerstudio@gmail.com",
  telephone: ["+261346493198", "+261322540773"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lot II A 122 FK Nanisana",
    addressLocality: "Antananarivo",
    addressCountry: "MG",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${instrument.variable} ${caveat.variable}`}
    >
      <head>
        {!isAdmin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className="bg-background text-foreground antialiased">
        {!isAdmin && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-gold focus:text-background focus:rounded-md focus:font-medium"
          >
            Aller au contenu principal
          </a>
        )}
        {!isAdmin && <Navbar />}
        <main id="main-content">{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}

