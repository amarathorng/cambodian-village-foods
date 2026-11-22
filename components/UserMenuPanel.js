// components/UserMenuPanel.js
// The open account menu: current email, the contributor's own entries, the
// reviewer queue for reviewers, and sign out. Presentational — UserMenu owns
// the open/closed state and the outside-click handling.
"use client";

export default function UserMenuPanel({ tUI, email, isReviewer, onClose, onLogout }) {
  return (
    <div className="user-menu-panel" id="account-menu" role="menu" aria-label={tUI.account}>
      <div className="user-menu-head">
        <span className="user-menu-label">{tUI.signedIn}</span>
        <span className="user-menu-email">{email}</span>
      </div>
      <a href="/my-entries" role="menuitem" className="user-menu-item" onClick={onClose}>
        {tUI.myEntries}
      </a>
      {isReviewer && (
        <a href="/review" role="menuitem" className="user-menu-item" onClick={onClose}>
          {tUI.review}
        </a>
      )}
      <button
        type="button"
        role="menuitem"
        className="user-menu-item user-menu-item--danger"
        onClick={() => {
          onClose();
          onLogout();
        }}
      >
        {tUI.logout}
      </button>
    </div>
  );
}
