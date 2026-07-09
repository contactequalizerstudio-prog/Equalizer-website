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
    <div className="min-h-screen bg-[#070d10] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0d1820] border-r border-[#1a2e3a] flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1a2e3a]">
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
            <p className="text-[#0e8ec4] text-xs">Administration</p>
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
                    ? "bg-[#0e8ec4]/15 text-[#0e8ec4] font-medium"
                    : "text-[#7a9aac] hover:text-white hover:bg-[#132433]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-[#1a2e3a] pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#7a9aac] hover:text-white hover:bg-[#132433] transition-colors mb-1"
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
