"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
  { href: "/nos-services", label: "Services" },
  { href: "/nos-hotesses", label: "Hôtesses" },
  { href: "/album", label: "Réalisations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/nous-contacter", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--line)] bg-background/85 backdrop-blur-md">
      <nav
        className="max-w-[1240px] mx-auto px-[clamp(18px,5vw,72px)] h-[68px] flex items-center justify-between gap-6"
        aria-label="Navigation principale"
      >
        <Link href="/" className="flex items-center" aria-label="Equalizer Studio, accueil">
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[0.95rem] font-medium transition-colors duration-200 ${
                    isActive ? "text-gold" : "text-muted hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/#contact"
          className="hidden sm:inline-flex items-center px-[18px] py-2.5 rounded-full bg-gold text-background text-[0.92rem] font-semibold hover:bg-gold-light hover:-translate-y-0.5 transition-all duration-200"
        >
          Parler de mon projet
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              isMenuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className="bg-background border-t border-[var(--line)] px-[clamp(18px,5vw,72px)] py-8">
          <ul className="flex flex-col gap-5 list-none m-0 p-0 mb-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-display text-2xl font-bold tracking-tight transition-colors duration-200 ${
                      isActive ? "text-gold" : "text-foreground hover:text-gold"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/#contact"
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gold text-background font-semibold hover:bg-gold-light transition-colors duration-200"
          >
            Parler de mon projet
          </Link>
        </div>
      </div>
    </header>
  );
}
