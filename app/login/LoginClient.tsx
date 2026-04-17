"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LoginClientProps = {
  next: string;
  initialError: string | null;
  initialAuthAvailable: boolean;
};

const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 .5A11.5 11.5 0 0 0 .5 12.14c0 5.17 3.29 9.55 7.86 11.1.57.1.78-.25.78-.56v-2.16c-3.2.71-3.88-1.4-3.88-1.4-.52-1.36-1.29-1.72-1.29-1.72-1.05-.73.08-.71.08-.71 1.16.09 1.77 1.22 1.77 1.22 1.04 1.82 2.73 1.3 3.39.99.1-.78.4-1.3.73-1.6-2.56-.3-5.25-1.3-5.25-5.83 0-1.3.46-2.36 1.2-3.2-.12-.31-.52-1.56.11-3.24 0 0 .98-.32 3.2 1.22a10.96 10.96 0 0 1 5.84 0c2.22-1.54 3.2-1.22 3.2-1.22.63 1.68.23 2.93.11 3.24.75.84 1.2 1.9 1.2 3.2 0 4.54-2.7 5.52-5.26 5.82.41.37.79 1.09.79 2.2v3.27c0 .31.2.67.79.56a11.63 11.63 0 0 0 7.85-11.1A11.5 11.5 0 0 0 12 .5Z"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.8 3-4.4 3-7.5 0-.7-.1-1.3-.2-2H12z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.9-.9 6.5-2.4l-3.2-2.5c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.3-4H3.4v2.6A10 10 0 0 0 12 22z"
    />
    <path
      fill="#4A90E2"
      d="M6.7 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.4A10 10 0 0 0 2 12c0 1.6.4 3.1 1.4 4.6L6.7 14z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.8 2.7 14.6 2 12 2a10 10 0 0 0-8.6 5.4L6.7 10c.7-2.4 2.8-4.1 5.3-4.1z"
    />
  </svg>
);

type Feedback =
  | { type: "error"; text: string }
  | { type: "info"; text: string }
  | null;

const feedbackFromCode = (code: string | null): Feedback => {
  if (!code) return null;
  if (code === "config") {
    return {
      type: "error",
      text: "Supabase is not configured. Set required env vars and restart the app.",
    };
  }
  if (code === "provider_unavailable") {
    return {
      type: "error",
      text: "Supabase auth is unreachable. Local fallback notes can still load, but sign-in and admin access are unavailable until the project URL works again.",
    };
  }
  if (code === "provider") return { type: "error", text: "Unsupported login provider." };
  if (code === "cancelled") return { type: "info", text: "Sign-in was cancelled." };
  if (code === "oauth") return { type: "error", text: "OAuth callback failed. Try again." };
  if (code === "session") {
    return { type: "error", text: "Could not create login session. Try again." };
  }
  if (code === "owner_only") {
    return {
      type: "error",
      text: "Only the site owner account can sign in to private notes.",
    };
  }
  if (code === "forbidden") {
    return {
      type: "error",
      text: "The owner account is not registered in the notes admin list yet.",
    };
  }
  if (code === "missing_email_or_password") {
    return { type: "error", text: "Email and password are required." };
  }
  if (code === "invalid_credentials") {
    return { type: "error", text: "Invalid email or password." };
  }
  if (code === "email_not_verified") {
    return {
      type: "error",
      text: "Email is not verified. Complete verification code step first.",
    };
  }
  if (code === "request_failed") {
    return { type: "error", text: "Request failed. Check your connection and try again." };
  }
  return { type: "error", text: "Action failed. Please try again." };
};

const sanitizeNext = (value: string) => (value.startsWith("/") ? value : "/notes");

export default function LoginClient({
  next,
  initialError,
  initialAuthAvailable,
}: LoginClientProps) {
  const safeNext = useMemo(() => sanitizeNext(next), [next]);
  const [feedback] = useState<Feedback>(feedbackFromCode(initialError));

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#040608] px-4 py-3 text-white sm:px-6 sm:py-5">
      <div className="mx-auto flex h-full w-full items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-9">
          <div className="space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl leading-tight font-semibold sm:text-[2rem]">
                Locked. Personal use only.
              </h1>
            </header>

            {feedback ? (
              <p
                className={[
                  "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  feedback.type === "error"
                    ? "border border-red-400/35 bg-red-500/15 text-red-100"
                    : "border border-amber-300/30 bg-amber-400/10 text-amber-100",
                ].join(" ")}
              >
                {feedback.text}
              </p>
            ) : null}

            <section className="space-y-3 pt-1">
              {initialAuthAvailable ? (
                <>
                  <p className="text-center text-sm text-white/45">Sign in with</p>
                  <div className="flex items-center justify-center gap-5">
                    <a
                      href={`/api/auth/signin?provider=github&next=${encodeURIComponent(safeNext)}`}
                      className={iconButtonClass}
                      title="Sign in with Github"
                      aria-label="Sign in with Github"
                    >
                      <GitHubIcon />
                    </a>
                    <a
                      href={`/api/auth/signin?provider=google&next=${encodeURIComponent(safeNext)}`}
                      className={iconButtonClass}
                      title="Sign in with Google"
                      aria-label="Sign in with Google"
                    >
                      <GoogleIcon />
                    </a>
                  </div>
                </>
              ) : (
                <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-3.5 py-3 text-center text-sm leading-relaxed text-amber-100">
                  Login is disabled because the configured Supabase project is unreachable.
                </p>
              )}
            </section>

            <footer className="border-t border-white/10 pt-5 text-xs text-white/60">
              <Link href="/notes" className="underline underline-offset-4 hover:text-white">
                Back to notes
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
