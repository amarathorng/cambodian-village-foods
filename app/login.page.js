// app/login.page.js
// Redesigned Sign In page for Khmer Living Archive — the same editorial
// two-column design language as the Create Account page. The authentication
// logic is unchanged: it calls the existing Supabase authentication directly
// (signInWithPassword) and redirects home on success. No loading-spinner risk,
// no duplicate submissions, same route and error handling as before.
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { colors } from "../components/theme.js";
import ArchiveLogo from "../components/ArchiveLogo.js";
import { useLanguage } from "../components/useLanguage.js";

// Interface copy only. The archive wordmark stays as the Latin brand mark.
const t = {
  en: {
    brandHeading: "Welcome back.",
    brandBody: "Return to the foods, memories, and traditions of Cambodian villages.",
    brandTagline: "FOOD · PLACE · PEOPLE · MEMORY",
    imageAlt: "Prahok Ang — traditional Cambodian fish grilled in banana leaves",
    title: "Sign In",
    sub: "Continue exploring the foods, memories, and stories of Cambodian villages.",
    invalid: "Invalid email or password",
    email: "Email address",
    password: "Password",
    passwordPlaceholder: "Your password",
    show: "Show",
    hide: "Hide",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signingIn: "Signing in…",
    submit: "Sign In",
    or: "OR",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
  },
  kh: {
    brandHeading: "សូមស្វាគមន៍ការត្រឡប់មកវិញ។",
    brandBody: "ត្រឡប់ទៅរកម្ហូប អនុស្សាវរីយ៍ និងប្រពៃណីនៃភូមិខ្មែរ។",
    brandTagline: "អាហារ · ទីកន្លែង · មនុស្ស · ការចងចាំ",
    imageAlt: "ប្រហុកអាំង — ត្រីខ្មែរប្រពៃណីអាំងក្នុងស្លឹកចេក",
    title: "ចូល",
    sub: "បន្តស្វែងរកម្ហូប អនុស្សាវរីយ៍ និងរឿងរ៉ាវនៃភូមិខ្មែរ។",
    invalid: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
    email: "អាសយដ្ឋានអ៊ីមែល",
    password: "ពាក្យសម្ងាត់",
    passwordPlaceholder: "ពាក្យសម្ងាត់របស់អ្នក",
    show: "បង្ហាញ",
    hide: "លាក់",
    showPassword: "បង្ហាញពាក្យសម្ងាត់",
    hidePassword: "លាក់ពាក្យសម្ងាត់",
    signingIn: "កំពុងចូល…",
    submit: "ចូល",
    or: "ឬ",
    noAccount: "មិនទាន់មានគណនីទេ?",
    signUp: "ចុះឈ្មោះ",
  },
};

export default function Login() {
  const [language] = useLanguage();
  const tUI = t[language] || t.en;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent duplicate submissions while a request is in flight.
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(tUI.invalid);
        return;
      }

      // Redirect to home on successful login
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

        {/* RIGHT — sign-in form */}
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
            <label className="auth-field" htmlFor="login-email">
              <span className="auth-label">{tUI.email}</span>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="auth-field" htmlFor="login-password">
              <span className="auth-label">{tUI.password}</span>
              <span className="auth-pass-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-password"
                  placeholder={tUI.passwordPlaceholder}
                  autoComplete="current-password"
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
            </label>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? tUI.signingIn : tUI.submit}
            </button>
          </form>

          <div className="auth-divider" role="presentation">
            <span className="auth-divider-line" aria-hidden="true" />
            <span className="auth-divider-text">{tUI.or}</span>
            <span className="auth-divider-line" aria-hidden="true" />
          </div>

          <p className="auth-switch">
            {tUI.noAccount}{" "}
            <a href="/signup" className="auth-link">{tUI.signUp}</a>
          </p>
        </div>
      </div>
    </div>
  );
}