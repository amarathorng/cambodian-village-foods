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

export default function Login() {
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
        setError("Invalid email or password");
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
            <span className="auth-monogram" aria-hidden="true">KLA</span>
            KHMER LIVING ARCHIVE
          </a>

          <img
            className="auth-brand-img"
            src="/images/hero-prahok-ang.jpeg"
            alt="Prahok Ang — traditional Cambodian fish grilled in banana leaves"
            width={940}
            height={350}
            fetchPriority="high"
          />

          <h1 className="auth-brand-heading" style={{ color: colors.text }}>
            Welcome back.
          </h1>
          <p className="auth-brand-body" style={{ color: colors.text2 }}>
            Return to the foods, memories, and traditions of Cambodian villages.
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

        {/* RIGHT — sign-in form */}
        <div className="auth-formpanel">
          <p className="auth-kicker" style={{ color: colors.gold }}>KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title" style={{ color: colors.text }}>Sign In</h1>
          <p className="auth-sub" style={{ color: colors.text2 }}>
            Continue exploring the foods, memories, and stories of Cambodian villages.
          </p>

          {error && (
            <p className="auth-error" role="alert" style={{ color: colors.danger }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} aria-busy={isLoading ? "true" : "false"}>
            <label className="auth-field" htmlFor="login-email">
              <span className="auth-label">Email address</span>
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
              <span className="auth-label">Password</span>
              <span className="auth-pass-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-password"
                  placeholder="Your password"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-divider" role="presentation">
            <span className="auth-divider-line" aria-hidden="true" />
            <span className="auth-divider-text" style={{ color: colors.muted }}>OR</span>
            <span className="auth-divider-line" aria-hidden="true" />
          </div>

          <p className="auth-switch" style={{ color: colors.text2 }}>
            Don't have an account?{" "}
            <a href="/signup" className="auth-link">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}