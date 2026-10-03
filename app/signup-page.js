// app/signup-page.js
// Redesigned Create Account page for Khmer Living Archive.
//
// Editorial two-column layout: a cultural brand panel with authentic village
// food photography on the left, and a focused registration form on the right.
// The authentication logic is unchanged from the original implementation —
// it calls the existing Supabase authentication directly (signUp), preserves
// the rate-limit cooldown, loading, error handling, and redirect on success.
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { colors } from "../components/theme.js";

const SIGNUP_COOLDOWN_MS = 60 * 1000;

// Read any cooldown saved from a previous page load (localStorage), so a
// reload doesn't reset the "wait before retrying sign-up" timer.
function getStoredCooldown() {
  try {
    const value = Number(localStorage.getItem("signupCooldownUntil") || 0);
    return Number.isFinite(value) ? value : 0;
  } catch {
    // localStorage is unavailable (e.g. server render) — no cooldown.
    return 0;
  }
}

function storeCooldown(timestamp) {
  try {
    localStorage.setItem("signupCooldownUntil", String(timestamp));
  } catch {
    // Ignore storage failures; the in-memory cooldown still applies.
  }
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(getStoredCooldown);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    // Block spam: ignore duplicate clicks and any submission during the
    // post-rate-limit cooldown, so we stop hammering Supabase's API.
    if (isLoading || now < cooldownUntil) return;
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // A 429 is Supabase's server-side rate limit, not a code bug.
        const isRateLimit = error.status === 429 || /too many|rate limit/i.test(error.message || "");
        if (isRateLimit) {
          // Block further attempts so we stop tripping the limit, and give an
          // honest message: Supabase's rate limit resets on a long window
          // (often ~1 hour), not after a short countdown.
          const nextCooldown = Date.now() + SIGNUP_COOLDOWN_MS;
          setCooldownUntil(nextCooldown);
          storeCooldown(nextCooldown);
          setError(
            "Sign-up is temporarily rate-limited by Supabase. Please wait a while " +
              "before retrying, or create users directly in the Supabase Dashboard " +
              "(Authentication → Users)."
          );
        } else {
          setError("Could not create account. Please try again.");
        }
        return;
      }

      // Redirect to home on successful sign up
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* LEFT — brand and cultural story */}
        <aside className="auth-brand">
          <a href="/" className="auth-wordmark">
            <span className="auth-monogram" aria-hidden="true">KLA</span>
            KHMER LIVING ARCHIVE
          </a>

          <img
            className="auth-brand-img"
            src="/images/hero-prahok-ang.jpeg"
            alt="Prahok Ang — traditional Cambodian fish grilled in banana leaves"
            width={960}
            height={640}
            fetchPriority="high"
          />

          <h1 className="auth-brand-heading" style={{ color: colors.text }}>
            Every dish carries a story.
          </h1>
          <p className="auth-brand-body" style={{ color: colors.text2 }}>
            Join a growing collection preserving the foods, memories, and traditions of Cambodian villages.
          </p>

          <span className="auth-brand-motif" aria-hidden="true">
            <span style={{ display: "block", width: 30, height: 3, backgroundColor: colors.gold }} />
            <span style={{ display: "block", width: 20, height: 3, backgroundColor: colors.gold, marginTop: 5 }} />
            <span style={{ display: "block", width: 10, height: 3, backgroundColor: colors.gold, marginTop: 5 }} />
          </span>

          <p className="auth-brand-tagline" aria-hidden="true">
            FOOD · PLACE · PEOPLE · MEMORY
          </p>
        </aside>

        {/* RIGHT — signup form */}
        <div className="auth-formpanel">
          <p className="auth-kicker" style={{ color: colors.gold }}>KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title" style={{ color: colors.text }}>Create your account</h1>
          <p className="auth-sub" style={{ color: colors.text2 }}>
            Join us in preserving Cambodia's village food stories.
          </p>

          {error && (
            <p className="auth-error" role="alert" style={{ color: colors.danger }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} aria-busy={isLoading ? "true" : "false"}>
            <label className="auth-field" htmlFor="signup-email">
              <span className="auth-label">Email address</span>
              <input
                id="signup-email"
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="auth-field" htmlFor="signup-password">
              <span className="auth-label">Password</span>
              <span className="auth-pass-wrap">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              <span className="auth-hint">Use a password that meets the account security requirements.</span>
            </label>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading || Date.now() < cooldownUntil}
            >
              {isLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider" role="presentation">
            <span className="auth-divider-line" aria-hidden="true" />
            <span className="auth-divider-text" style={{ color: colors.muted }}>OR</span>
            <span className="auth-divider-line" aria-hidden="true" />
          </div>

          <p className="auth-switch" style={{ color: colors.text2 }}>
            Already have an account?{" "}
            <a href="/login" className="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}