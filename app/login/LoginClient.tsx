"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

type LoginClientProps = {
  next: string;
  isAdminLogin: boolean;
  initialError: string | null;
  initialAuthAvailable: boolean;
};

const textInputClass =
  "w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40 focus:bg-white/10";
const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40";
const modeButtonBase =
  "inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition";

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
  if (code === "approval_required") {
    return {
      type: "info",
      text: "Your account is pending owner approval. Access is blocked until approved.",
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
  if (code === "email_already_registered") {
    return { type: "error", text: "Email is already registered. Try sign in instead." };
  }
  if (code === "invalid_password") {
    return {
      type: "error",
      text: "Password does not meet minimum requirement set in Supabase.",
    };
  }
  if (code === "missing_email_or_code") {
    return { type: "error", text: "Email and verification code are required." };
  }
  if (code === "invalid_verification_code") {
    return { type: "error", text: "Verification code is invalid or expired." };
  }
  if (code === "signup_failed") {
    return { type: "error", text: "Sign-up failed. Try again." };
  }
  if (code === "request_failed") {
    return { type: "error", text: "Request failed. Check your connection and try again." };
  }
  return { type: "error", text: "Action failed. Please try again." };
};

const sanitizeNext = (value: string) => (value.startsWith("/") ? value : "/notes");

export default function LoginClient({
  next,
  isAdminLogin,
  initialError,
  initialAuthAvailable,
}: LoginClientProps) {
  const safeNext = useMemo(() => sanitizeNext(next), [next]);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signupStep, setSignupStep] = useState<"credentials" | "verify" | "done">(
    "credentials"
  );
  const [busy, setBusy] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const initialFeedback = feedbackFromCode(initialError);
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);

  const clearFeedback = () => setFeedback(null);

  const setFeedbackFromErrorCode = (code: string | null) => {
    setFeedback(feedbackFromCode(code));
  };

  const handlePasswordSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    clearFeedback();
    setBusy(true);

    try {
      const response = await fetch("/api/auth/password/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
          next: safeNext,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; next?: string };
      if (!response.ok || !payload.ok) {
        setFeedbackFromErrorCode(payload.error ?? "request_failed");
        return;
      }

      window.location.href = sanitizeNext(payload.next ?? safeNext);
    } catch {
      setFeedbackFromErrorCode("request_failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    clearFeedback();
    setBusy(true);

    try {
      const response = await fetch("/api/auth/password/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setFeedbackFromErrorCode(payload.error ?? "signup_failed");
        return;
      }

      setSignupStep("verify");
      setFeedback({
        type: "info",
        text:
          payload.message || "Account created. Enter the verification code sent to your email.",
      });
    } catch {
      setFeedbackFromErrorCode("request_failed");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    clearFeedback();
    setBusy(true);

    try {
      const response = await fetch("/api/auth/password/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: signUpEmail,
          code: verificationCode,
          next: safeNext,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setFeedbackFromErrorCode(payload.error ?? "invalid_verification_code");
        return;
      }

      setSignupStep("done");
      setFeedback(null);
    } catch {
      setFeedbackFromErrorCode("request_failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#040608] px-4 py-3 text-white sm:px-6 sm:py-5">
      <div className="mx-auto flex h-full w-full items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-9">
          <div className="space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl leading-tight font-semibold sm:text-[2rem]">
                {isAdminLogin
                  ? "Sign in to manage notes"
                  : "Sign in to access admin-only notes"}
              </h1>
              <p className="max-w-[48ch] text-sm leading-relaxed text-white/70">
                {isAdminLogin
                  ? "Admin access is limited to approved accounts in the notes database."
                  : "Software Programming and Motivation notes are public. Stock Trading notes are admin-only."}
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    clearFeedback();
                  }}
                  className={[
                    modeButtonBase,
                    mode === "signin"
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/15 bg-black/30 text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setSignupStep("credentials");
                    clearFeedback();
                  }}
                  className={[
                    modeButtonBase,
                    mode === "signup"
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/15 bg-black/30 text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  Sign Up
                </button>
              </div>
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

            {mode === "signin" ? (
              <form className="space-y-5" onSubmit={handlePasswordSignIn}>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    disabled={!initialAuthAvailable || busy}
                    className={textInputClass}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    disabled={!initialAuthAvailable || busy}
                    className={textInputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy || !initialAuthAvailable}
                  className="w-full rounded-xl border border-[#1a5b66] bg-gradient-to-r from-[#0b3a42] via-[#0f4b56] to-[#145c66] px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#e9fbff] shadow-[0_8px_20px_rgba(11,58,66,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {!initialAuthAvailable
                    ? "Sign In Unavailable"
                    : busy
                      ? "Please wait..."
                      : "Sign In"}
                </button>
                <p className="text-center text-xs text-white/55">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setSignupStep("credentials");
                      clearFeedback();
                    }}
                    className="font-semibold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 hover:text-white"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <>
                {signupStep === "credentials" ? (
                  <form className="space-y-5" onSubmit={handleSignUp}>
                    <label className="block space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                        Email
                      </span>
                      <input
                        type="email"
                        name="signup-email"
                        autoComplete="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        disabled={!initialAuthAvailable || busy}
                        className={textInputClass}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                        Password
                      </span>
                      <input
                        type="password"
                        name="signup-password"
                        autoComplete="new-password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        disabled={!initialAuthAvailable || busy}
                        className={textInputClass}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy || !initialAuthAvailable}
                      className="w-full rounded-xl border border-[#1a5b66] bg-gradient-to-r from-[#0b3a42] via-[#0f4b56] to-[#145c66] px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#e9fbff] shadow-[0_8px_20px_rgba(11,58,66,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {!initialAuthAvailable
                        ? "Sign Up Unavailable"
                        : busy
                          ? "Please wait..."
                          : "Create Account"}
                    </button>
                    <p className="text-center text-xs text-white/55">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          clearFeedback();
                        }}
                        className="font-semibold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 hover:text-white"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                ) : null}

                {signupStep === "verify" ? (
                  <form
                    className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4"
                    onSubmit={handleVerifyCode}
                  >
                    <h2 className="text-sm font-semibold text-white/90">Verify Email Code</h2>
                    <p className="text-xs text-white/55">
                      Enter the verification code sent to {signUpEmail}.
                    </p>
                    <label className="block space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                        Verification Code
                      </span>
                      <input
                        type="text"
                        name="verification-code"
                        autoComplete="one-time-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        disabled={!initialAuthAvailable || busy}
                        className={textInputClass}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy || !initialAuthAvailable}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {!initialAuthAvailable
                        ? "Verification Unavailable"
                        : busy
                          ? "Please wait..."
                          : "Verify Code"}
                    </button>
                  </form>
                ) : null}

                {signupStep === "done" ? (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
                    <h2 className="text-sm font-semibold text-white/90">Verification Completed</h2>
                    <p className="text-xs text-white/60">
                      Credentials accepted. Wait for admin approval before accessing notes.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setSignupStep("credentials");
                        setVerificationCode("");
                        clearFeedback();
                      }}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : null}
              </>
            )}

            <section className="space-y-3 pt-1">
              {initialAuthAvailable ? (
                <>
                  <p className="text-center text-sm text-white/45">Or sign in using</p>
                  <p className="text-center text-xs text-white/40">
                    GitHub/Google sign-in also requires owner approval.
                  </p>
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
