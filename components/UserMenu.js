// components/UserMenu.js
// The signed-in account menu: current email, the contributor's own entries,
// the reviewer queue for reviewers, and sign out. Closes on outside click and
// on Escape. The reviewer link only appears for reviewers; the review API
// enforces that permission independently.
"use client";

import { useEffect, useRef, useState } from "react";
import UserMenuPanel from "./UserMenuPanel.js";

const t = {
  en: {
    account: "Account",
    signedIn: "Signed in",
    myEntries: "My entries",
    review: "Review queue",
    logout: "Log out",
  },
  kh: {
    account: "គណនី",
    signedIn: "បានចូលគណនី",
    myEntries: "ការបញ្ចូលរបស់ខ្ញុំ",
    review: "បញ្ជីរង់ចាំត្រួតពិនិត្យ",
    logout: "ចាកចេញ",
  },
};

export default function UserMenu({ email = "", avatarUrl = "", isReviewer, language = "en", onLogout }) {
  const tUI = t[language] || t.en;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const initial = (email || "?").charAt(0).toUpperCase();

  return (
    <div className="user-menu" ref={wrapRef}>
      <button
        type="button"
        className="user-menu-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="account-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {avatarUrl ? (
          <img className="nav-avatar" src={avatarUrl} alt="" width={28} height={28} />
        ) : (
          <span className="nav-avatar" aria-hidden="true">{initial}</span>
        )}
        <span className="nav-user-email" title={email}>{email}</span>
        <span className="chevron" aria-hidden="true">▾</span>
      </button>

      {open && (
        <UserMenuPanel
          tUI={tUI}
          email={email}
          isReviewer={isReviewer}
          onClose={() => setOpen(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
