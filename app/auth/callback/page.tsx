"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SessionPayload = {
  access_token: string;
  refresh_token: string;
};

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const fragment = new URLSearchParams(hash);
    const query = new URLSearchParams(window.location.search);
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const nextParam = query.get("next") || "/notes";
    const next = nextParam.startsWith("/") ? nextParam : "/notes";
    const oauthError = query.get("error") || fragment.get("error");
    const oauthErrorDescription =
      query.get("error_description") || fragment.get("error_description");

    if (oauthError) {
      const normalizedError = oauthError.toLowerCase();
      const normalizedDescription = (oauthErrorDescription || "").toLowerCase();
      const isCancelled =
        normalizedError.includes("access_denied") ||
        normalizedError.includes("cancel") ||
        normalizedDescription.includes("cancel") ||
        normalizedDescription.includes("denied");
      router.replace(`/login?error=${isCancelled ? "cancelled" : "oauth"}`);
      return;
    }

    if (!accessToken || !refreshToken) {
      router.replace("/login?error=oauth");
      return;
    }

    const payload: SessionPayload = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    void fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) {
          router.replace(next);
          return;
        }
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error === "approval_required") {
          router.replace("/login?error=approval_required");
          return;
        }
        if (body.error === "config") {
          router.replace("/login?error=config");
          return;
        }
        router.replace("/login?error=session");
      })
      .catch(() => {
        router.replace("/login?error=session");
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6">
        <p className="text-sm text-white/80">Finalizing sign-in...</p>
      </div>
    </main>
  );
}
