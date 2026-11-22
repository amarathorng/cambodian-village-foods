// components/Navbar.js
// Sticky editorial navigation: archive identity, primary links with an
// animated active indicator, language switcher, and the session-aware account
// area. Collapses into an accessible drawer below 940px (see archive.css).
"use client";

import { usePathname, useRouter } from "next/navigation";
import collection, { collectionText } from "../collection.config.js";
import ArchiveLogo from "./ArchiveLogo.js";
import NavActions from "./NavActions.js";
import NavMenu from "./NavMenu.js";
import { navLabels } from "./nav-copy.js";
import { useNavDrawer } from "./useNavDrawer.js";
import { useSessionUser } from "./useSessionUser.js";

export default function Navbar({ language, setLanguage }) {
  const tUI = navLabels[language] || navLabels.en;
  const brandName = collectionText(collection.name, language);
  const { user, isReviewer, supabase } = useSessionUser();
  const router = useRouter();
  const pathname = usePathname();
  const { open, setOpen, scrolled } = useNavDrawer(pathname);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    "";

  const links = [
    { label: tUI.home, href: "/" },
    { label: tUI.foods, href: "/#collection" },
    { label: tUI.about, href: "/#about" },
    { label: tUI.contribute, href: "/contribute" },
  ];

  // Contributors get their own tracking page in the primary navigation. It is
  // only shown once the session resolves to a signed-in user, so signed-out
  // visitors never see a link that would just bounce them to the login prompt.
  if (user) links.push({ label: tUI.myEntries, href: "/my-entries" });

  return (
    <>
      <a className="skip-link" href="#main-content">{tUI.skip}</a>
      <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="/" className="brand" aria-label={`${brandName} — ${tUI.homeAria}`}>
            <ArchiveLogo size={36} />
            <span className="brand-text">
              {/* <span className="brand-name">KHMER LIVING ARCHIVE</span> */}
              <span className={language === "kh" ? "brand-sub khmer" : "brand-sub"}>
                {brandName}
              </span>
            </span>
          </a>

          <button
            type="button"
            className={`nav-toggle${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="navLinks"
            aria-label={open ? tUI.closeMenu : tUI.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span /><span /><span />
            </span>
            {tUI.menu}
          </button>

          <div id="navLinks" className={`nav-panel${open ? " is-open" : ""}`}>
            <NavMenu links={links} label={tUI.navLabel} onNavigate={() => setOpen(false)} />
            <NavActions
              language={language}
              setLanguage={setLanguage}
              user={user}
              isReviewer={isReviewer}
              avatarUrl={avatarUrl}
              onLogout={handleLogout}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      </header>
    </>
  );
}
