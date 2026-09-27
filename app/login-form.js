"use client";

import { useState } from "react";
import { useSupabase } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const styles = {
  wrap: {
    maxWidth: 400,
    margin: "0 auto",
    padding: "80px 24px",
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
    "&:focus": {
      outline: "none",
      borderColor: "#2EE6A8",
      boxShadow: "0 0 0 3px rgba(46, 230, 168, 0.15)",
    },
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
    "&:hover": {
      backgroundColor: "#1ABB9C",
    },
    "&:active": {
      backgroundColor: "#14181F",
      color: "#FFFFFF",
    },
  },
  error: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#FF5F57",
  },
  loading: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    color: "#2EE6A8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      setError("Invalid email or password");
    } else {
      setError("Signed in successfully!");
      setEmail("");
      setPassword("");
      router.push("/");
    }
  };

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>Sign In</h1>
      <p style={styles.description}>Welcome back! Please enter your credentials.</p>

      <form style={styles.form} onSubmit={handleSubmit}>
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

        {error && <p style={styles.error}>{error}</p>}
        {isLoading && <p style={styles.loading}>Signing in...</p>}
      </form>
    </main>
  );
}