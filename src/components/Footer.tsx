import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/nos-services", label: "Nos Services" },
  { href: "/nos-hotesses", label: "Hôtesses & Animatrices" },
  { href: "/album", label: "Portfolio" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/nous-contacter", label: "Contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://bit.ly/3LkpfOs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://bit.ly/4jN3JOZ",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://bit.ly/49tKLtb",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "http://bit.ly/4b7DnF4",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
];

const services = [
  "Photos & Vidéos",
  "Voix Off / Spot Audio",
  "Évènementiel",
  "MC / Animateur",
  "Hôtesses & Animatrices",
  "Team Building",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-5 group"
              aria-label="Equalizer Studio — Accueil"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-gold/30 group-hover:ring-gold/60 transition-all duration-300">
                <Image
                  src="/logo-light.jpeg"
                  alt="Equalizer Studio"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white font-semibold text-lg tracking-[0.15em] uppercase">
                Equalizer Studio
              </span>
            </Link>
            <p className="text-muted text-sm leading-7 max-w-xs mb-6">
              Votre partenaire de confiance en communication professionnelle à
              Madagascar depuis plus de 13 ans.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted text-sm hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
              Nos Services
            </h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {services.map((service) => (
                <li key={service} className="text-muted text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
              Contactez-nous
            </h3>
            <address className="not-italic flex flex-col gap-3">
              <p className="text-muted text-sm leading-6">
                Lot II A 122 FK Nanisana
                <br />
                Antananarivo, Madagascar
              </p>
              <a
                href="tel:+261346493198"
                className="text-muted text-sm hover:text-gold transition-colors duration-200"
              >
                +261 34 64 931 98
              </a>
              <a
                href="tel:+261322540773"
                className="text-muted text-sm hover:text-gold transition-colors duration-200"
              >
                +261 32 25 407 73
              </a>
              <a
                href="mailto:contact.equalizerstudio@gmail.com"
                className="text-muted text-sm hover:text-gold transition-colors duration-200 break-all"
              >
                contact.equalizerstudio@gmail.com
              </a>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold" aria-hidden="true" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-muted text-xs">
            © {year} Equalizer Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted hover:text-gold transition-colors duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-muted text-xs">
            Antananarivo, Madagascar
          </p>
        </div>
      </div>
    </footer>
  );
}



