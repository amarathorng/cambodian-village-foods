// components/NavActions.js
// Right-hand side of the navigation: language switcher plus either the Login
// and Sign up links (signed out) or the account menu (signed in).
"use client";

import LanguageSwitcher from "./LanguageSwitcher.js";
import UserMenu from "./UserMenu.js";

const t = {
  en: { login: "Login", signUp: "Sign up" },
  kh: { login: "ចូល", signUp: "ចុះឈ្មោះ" },
};

export default function NavActions({
  language,
  setLanguage,
  user,
  isReviewer,
  avatarUrl,
  onLogout,
  onNavigate,
}) {
  const tUI = t[language] || t.en;

  return (
    <div className="nav-actions">
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
      {user === undefined ? null : user ? (
        <UserMenu
          email={user.email}
          avatarUrl={avatarUrl}
          isReviewer={isReviewer}
          language={language}
          onLogout={onLogout}
        />
      ) : (
        <>
          <a href="/login" className="nav-auth" onClick={onNavigate}>
            {tUI.login}
          </a>
          <a href="/signup" className="btn btn--primary btn--sm" onClick={onNavigate}>
            {tUI.signUp}
          </a>
        </>
      )}
    </div>
  );
}
