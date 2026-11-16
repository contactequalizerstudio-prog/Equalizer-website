"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects.");
        return;
      }

      // Hard redirect so the browser sends the new cookie to the middleware
      window.location.href = "/admin";
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07242a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 relative mb-4">
            <Image
              src="/logo-light.jpeg"
              alt="Equalizer Studio"
              fill
              className="object-contain rounded-full"
              unoptimized
            />
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-wide">
            Equalizer Studio
          </h1>
          <p className="text-[#9dbabf] text-sm mt-1">Administration</p>
        </div>

        {/* Card */}
        <div className="bg-[#0c3239] border border-[#1b4a52] rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
              >
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
                placeholder="admin"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#9dbabf] text-xs tracking-widest uppercase mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#12434b] border border-[#1b4a52] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6bdde3] transition-colors placeholder:text-[#6d8f95]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6bdde3] hover:bg-[#8be8ed] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-widest uppercase rounded-lg py-3 transition-colors"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
