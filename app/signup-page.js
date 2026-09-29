"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";


const styles = {
  wrap: {
    maxWidth: 400,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: "16px 0 12px",
    textAlign: "center",
    color: "#E8EDF2",
  },
  description: {
    fontSize: 14,
    color: "#97A1B3",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: 16,
    fontSize: 14,
    border: "1px solid #2E3644",
    borderRadius: 6,
    backgroundColor: "#1C222C",
    color: "#FFFFFF",
    "&:focus": { outline: "none", borderColor: "#2EE6A8", boxShadow: "0 0 0 3px rgba(46, 230, 168, 0.15)" },
  },
  button: {
    width: "100%",
    padding: "12px 10px",
    marginTop: 8,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderRadius: 6,
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    cursor: "pointer",
    "&:hover": { backgroundColor: "#1ABB9C" },
    "&:active": { backgroundColor: "#14181F", color: "#FFFFFF" },
  },
  error: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#FF5F57",
  },
  divider: {
    margin: "24px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#97A1B3",
    fontSize: 14,
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#2E3644",
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Create Account</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="password"
          required
        />
        <button
          style={styles.button}
          type="submit"
          disabled={isLoading || Date.now() < cooldownUntil}
        >
          {isLoading ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <div style={styles.divider}>
        <span>OR</span>
        <div style={styles.dividerLine} />
      </div>

      <p style={{ textAlign: "center", color: "#97A1B3", fontSize: 14 }}>
        Already have an account?{" "}
        <a
          href="/login"
          style={{ color: "#2EE6A8", textDecoration: "none", fontWeight: 600 }}
        >
          Sign In
        </a>
      </p>
    </main>
  );
}