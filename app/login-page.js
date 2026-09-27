import { useState } from "react";
import { useSupabase } from "@supabase/ssr";

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
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Sign In</h1>

      {/* Since this is now a Server Component, we need to handle form submission differently */}
      {/* We'll create a form action endpoint for authentication */}
      
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p style={{ color: "#97A1B3", fontSize: 14 }}>
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#2EE6A8", textDecoration: "none", fontWeight: 600 }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}