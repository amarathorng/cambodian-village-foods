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
    padding: "12px 24px",
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
  };

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Sign In</h1>

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
        <button style={styles.button} type="submit">
          Sign In
        </button>
      </form>

      <div style={styles.divider}>
        <span>OR</span>
        <div style={styles.dividerLine} />
      </div>

      <p style={{ textAlign: "center", color: "#97A1B3", fontSize: 14 }}>
        Don't have an account?{" "}
        <a
          href="/signup"
          style={{
            color: "#2EE6A8",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Sign Up
        </a>
      </p>
    </main>
  );
}