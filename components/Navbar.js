// components/Navbar.js
// Minimal editorial navigation, sticky and compact. Aligns to the content
// container; collapses to an accessible drawer menu on mobile. Reads the
// user's Supabase session so the header shows login status: an avatar + email +
// Logout when signed in, or a Login link when signed out. It listens for auth
// changes so the header updates the moment a user signs in or out.
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { colors, fonts } from "./theme.js";
import LanguageSwitcher from "./LanguageSwitcher.js";

// Khmer interface labels are provided only where a verified translation exists
// in the project (foods, login, sign up, logout). "Stories", "About" keep English
// in Khmer mode rather than risk displaying incorrect Khmer text.
const t = {
  en: { foods: "Foods", stories: "Stories", about: "About", login: "Login", signUp: "Sign Up", logout: "Logout", menu: "Menu" },
  kh: {
    foods: "អាហារ",
    stories: "Stories",
    about: "About",
    login: "ចូល",
    signUp: "ចុះឈ្មោះ",
    logout: "Logout",
    menu: "Menu",
  },
};

// Fallback avatar: a lightweight inline person glyph (no image library needed).
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Navbar({ language, setLanguage, container = {} }) {
  const tUI = t[language] || t.en;
  const [open, setOpen] = useState(false);
  // user is undefined while the session is still resolving, null when signed out,
  // and the Supabase user object when signed in.
  const [user, setUser] = useState(undefined);
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
    []
  );
  const router = useRouter();

  useEffect(() => {
    let active = true;
    // Keep the header in sync with sign-in / sign-out events in real time.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session ? session.user : null);
    });
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user || null);
    });
    return () => {
      active = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    // signOut clears the session; refresh the page so server-rendered state
    // that depends on the cookie catches up. The auth listener already resets
    // the header to the signed-out view.
    await supabase.auth.signOut();
    router.refresh();
  }

  // Supabase Google/GitHub logins store the avatar URL in the user's metadata.
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    "";

  const linkStyle = (activeHash) => ({
    fontFamily: fonts.stack,
    fontSize: 14,
    fontWeight: 500,
    color: colors.text2,
    textDecoration: "none",
    padding: "6px 4px",
    borderBottom: "none",
    position: "relative",
  });

  const links = [
    { label: tUI.foods, href: "#collection" },
    { label: tUI.stories, href: "#introduction" },
    { label: tUI.about, href: "#about" },
  ];

  return (
    <header className="navbar" style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div
        className="navbar-inner"
        style={{ ...container, display: "flex", alignItems: "center", gap: 16 }}
      >
        <a
          href="/"
          className="brand"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0 }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: colors.green,
              color: colors.text,
              fontFamily: fonts.stack,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            KLA
          </span>
          <span
            style={{
              fontFamily: fonts.stack,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: colors.text,
              whiteSpace: "nowrap",
            }}
          >
            KHMER LIVING ARCHIVE
          </span>
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="navLinks"
          aria-label={tUI.menu}
          onClick={() => setOpen(!open)}
          style={{
            fontFamily: fonts.stack,
            fontSize: 14,
            color: colors.text2,
            background: "none",
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {tUI.menu}
        </button>

        <nav id="navLinks" className={`nav-links${open ? " open" : ""}`} aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={linkStyle()}
            >
              {l.label}
            </a>
          ))}
          <span
            className="nav-divider"
            style={{
              width: 1,
              alignSelf: "stretch",
              backgroundColor: colors.border,
              margin: "0 2px",
            }}
          />
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          {user === undefined ? null : user ? (
            <div
              className="nav-user"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="nav-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `1px solid ${colors.border}`,
                  }}
                />
              ) : (
                <span
                  className="nav-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: colors.elevated,
                    border: `1px solid ${colors.border}`,
                    color: colors.text2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserIcon />
                </span>
              )}
              <span
                className="nav-user-email"
                title={user.email}
                style={{
                  fontFamily: fonts.stack,
                  fontSize: 13,
                  color: colors.text2,
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </span>
              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
                style={{
                  fontFamily: fonts.stack,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text2,
                  background: "none",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                {tUI.logout}
              </button>
            </div>
          ) : (
            <>
              <a href="/login" className="nav-auth" style={{ ...linkStyle(), color: colors.text, fontWeight: 600 }}>
                {tUI.login}
              </a>
              <a
                href="/signup"
                className="nav-auth"
                style={{
                  fontFamily: fonts.stack,
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.text,
                  backgroundColor: colors.green,
                  textDecoration: "none",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                }}
              >
                {tUI.signUp}
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}