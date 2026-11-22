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
import ArchiveLogo from "../components/ArchiveLogo.js";
import { useLanguage } from "../components/useLanguage.js";

// Interface copy only. The archive wordmark stays as the Latin brand mark.
const t = {
  en: {
    brandHeading: "Every dish carries a story.",
    brandBody:
      "Join a growing collection preserving the foods, memories, and traditions of Cambodian villages.",
    brandTagline: "FOOD · PLACE · PEOPLE · MEMORY",
    imageAlt: "Prahok Ang — traditional Cambodian fish grilled in banana leaves",
    title: "Create your account",
    sub: "Join us in preserving Cambodia's village food stories.",
    rateLimited:
      "Sign-up is temporarily rate-limited by Supabase. Please wait a while " +
      "before retrying, or create users directly in the Supabase Dashboard " +
      "(Authentication → Users).",
    genericError: "Could not create account. Please try again.",
    email: "Email address",
    password: "Password",
    passwordPlaceholder: "Create a strong password",
    passwordHint: "Use a password that meets the account security requirements.",
    show: "Show",
    hide: "Hide",
    showPassword: "Show password",
    hidePassword: "Hide password",
    creating: "Creating account…",
    submit: "Create Account",
    or: "OR",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
  },
  kh: {
    brandHeading: "ម្ហូបនីមួយៗមានរឿងរ៉ាវរៀងខ្លួន។",
    brandBody:
      "ចូលរួមក្នុងបណ្ដុំឯកសារដែលកំពុងរីកចម្រើន ដើម្បីរក្សាម្ហូប អនុស្សាវរីយ៍ និងប្រពៃណីនៃភូមិខ្មែរ។",
    brandTagline: "អាហារ · ទីកន្លែង · មនុស្ស · ការចងចាំ",
    imageAlt: "ប្រហុកអាំង — ត្រីខ្មែរប្រពៃណីអាំងក្នុងស្លឹកចេក",
    title: "បង្កើតគណនីរបស់អ្នក",
    sub: "ចូលរួមជាមួយយើង ដើម្បីរក្សារឿងរ៉ាវអាហារតាមភូមិរបស់កម្ពុជា។",
    rateLimited:
      "ការចុះឈ្មោះត្រូវបានកំណត់ចំនួនដោយ Supabase ជាបណ្ដោះអាសន្ន។ សូមរង់ចាំមួយរយៈសិន មុននឹងព្យាយាមម្ដងទៀត ឬបង្កើតអ្នកប្រើប្រាស់ដោយផ្ទាល់នៅក្នុង Supabase Dashboard (Authentication → Users)។",
    genericError: "មិនអាចបង្កើតគណនីបានទេ។ សូមព្យាយាមម្ដងទៀត។",
    email: "អាសយដ្ឋានអ៊ីមែល",
    password: "ពាក្យសម្ងាត់",
    passwordPlaceholder: "បង្កើតពាក្យសម្ងាត់ដ៏រឹងមាំ",
    passwordHint: "សូមប្រើពាក្យសម្ងាត់ដែលបំពេញតាមលក្ខខណ្ឌសុវត្ថិភាពគណនី។",
    show: "បង្ហាញ",
    hide: "លាក់",
    showPassword: "បង្ហាញពាក្យសម្ងាត់",
    hidePassword: "លាក់ពាក្យសម្ងាត់",
    creating: "កំពុងបង្កើតគណនី…",
    submit: "បង្កើតគណនី",
    or: "ឬ",
    hasAccount: "មានគណនីរួចហើយ?",
    signIn: "ចូល",
  },
};

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
  const [language] = useLanguage();
  const tUI = t[language] || t.en;
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
          setError(tUI.rateLimited);
        } else {
          setError(tUI.genericError);
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
            <ArchiveLogo size={32} />
            KHMER LIVING ARCHIVE
          </a>

          <img
            className="auth-brand-img"
            src="/images/hero-prahok-ang.jpeg"
            alt={tUI.imageAlt}
            width={515}
            height={388}
            fetchPriority="high"
          />

          <p className="auth-brand-heading">
            {tUI.brandHeading}
          </p>
          <p className="auth-brand-body">
            {tUI.brandBody}
          </p>

          <span className="auth-brand-motif" aria-hidden="true">
            <span style={{ display: "block", width: 30, height: 3, backgroundColor: colors.gold }} />
            <span style={{ display: "block", width: 20, height: 3, backgroundColor: colors.gold, marginTop: 5 }} />
            <span style={{ display: "block", width: 10, height: 3, backgroundColor: colors.gold, marginTop: 5 }} />
          </span>

          <p className="auth-brand-tagline" aria-hidden="true">
            {tUI.brandTagline}
          </p>
        </aside>

        {/* RIGHT — signup form */}
        <div className="auth-formpanel">
          <p className="auth-kicker">KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title">{tUI.title}</h1>
          <p className="auth-sub">
            {tUI.sub}
          </p>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} aria-busy={isLoading ? "true" : "false"}>
            <label className="auth-field" htmlFor="signup-email">
              <span className="auth-label">{tUI.email}</span>
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
              <span className="auth-label">{tUI.password}</span>
              <span className="auth-pass-wrap">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-password"
                  placeholder={tUI.passwordPlaceholder}
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
                  aria-label={showPassword ? tUI.hidePassword : tUI.showPassword}
                >
                  {showPassword ? tUI.hide : tUI.show}
                </button>
              </span>
              <span className="auth-hint">{tUI.passwordHint}</span>
            </label>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading || Date.now() < cooldownUntil}
            >
              {isLoading ? tUI.creating : tUI.submit}
            </button>
          </form>

          <div className="auth-divider" role="presentation">
            <span className="auth-divider-line" aria-hidden="true" />
            <span className="auth-divider-text">{tUI.or}</span>
            <span className="auth-divider-line" aria-hidden="true" />
          </div>

          <p className="auth-switch">
            {tUI.hasAccount}{" "}
            <a href="/login" className="auth-link">{tUI.signIn}</a>
          </p>
        </div>
      </div>
    </div>
  );
}