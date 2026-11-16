"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Album", icon: "⊞" },
  { href: "/admin/articles/nouveau", label: "Nouvel article", icon: "+" },
  { href: "/admin/hotesses", label: "Hôtesses", icon: "◇" },
  { href: "/admin/hotesses/nouveau", label: "Nouvelle hôtesse", icon: "+" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-[#07242a] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0c3239] border-r border-[#1b4a52] flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1b4a52]">
          <div className="w-9 h-9 relative shrink-0">
            <Image
              src="/logo-light.jpeg"
              alt="Logo"
              fill
              className="object-contain rounded-full"
              unoptimized
            />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              Equalizer Studio
            </p>
            <p className="text-[#6bdde3] text-xs">Administration</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#6bdde3]/15 text-[#6bdde3] font-medium"
                    : "text-[#9dbabf] hover:text-white hover:bg-[#12434b]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-[#1b4a52] pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#9dbabf] hover:text-white hover:bg-[#12434b] transition-colors mb-1"
          >
            <span>↗</span> Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <span>⏻</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
