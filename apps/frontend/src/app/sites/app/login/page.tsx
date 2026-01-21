"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Connexion</h1>

        <div className="mt-4 grid gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Rester connecté 7 jours
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            className="border px-3 py-2 rounded disabled:opacity-60"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await login(email, password, remember);
                const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://app.localhost";
                window.location.assign(`${appOrigin}${next.startsWith("/") ? next : `/${next}`}`);
              } catch (e: any) {
                setError("Identifiants invalides ou compte non activé.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}