// components/Footer.js
// Archive footer: identity and description from collection.config.js, quick
// navigation, contribution links, the two supported languages, and copyright.
import collection, { collectionText } from "../collection.config.js";
import ArchiveLogo from "./ArchiveLogo.js";

const t = {
  en: {
    tagline: "Preserving everyday Cambodian food stories.",
    collectionLabel: "The Collection",
    foods: "All foods",
    stories: "Archive introduction",
    about: "About the Archive",
    contributeLabel: "Contribute",
    contribute: "Share a food story",
    login: "Login",
    signup: "Create account",
    language: "Language",
    backToTop: "Back to top",
  },
  kh: {
    tagline: "រក្សារឿងនិទានអាហារប្រចាំថ្ងៃរបស់ប្រជាជនខ្មែរ។",
    collectionLabel: "បណ្ដុំឯកសារ",
    foods: "អាហារ",
    stories: "រឿងនិទាន",
    about: "អំពីយើង",
    contributeLabel: "ចូលរួមចំណែក",
    contribute: "ចូលរួមចំណែក",
    login: "ចូល",
    signup: "ចុះឈ្មោះ",
    language: "ភាសា",
    backToTop: "ត្រឡប់ទៅខាងលើ",
  },
};

export default function Footer({ language = "en", copyright }) {
  const tUI = t[language] || t.en;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="footer-brand">
              <ArchiveLogo size={34} />
              <span>
                <span className="footer-name">KHMER LIVING ARCHIVE</span>
                <span className={language === "kh" ? "footer-collection khmer" : "footer-collection"}>
                  {collectionText(collection.name, language)}
                </span>
              </span>
            </a>
            <p className={language === "kh" ? "footer-desc khmer" : "footer-desc"}>
              {collectionText(collection.description, language)}
            </p>
            <p className={language === "kh" ? "footer-desc khmer" : "footer-desc"}>{tUI.tagline}</p>
          </div>

          <nav aria-label={tUI.collectionLabel}>
            <h2 className="footer-col-title">{tUI.collectionLabel}</h2>
            <ul className="footer-links">
              <li><a href="/#collection">{tUI.foods}</a></li>
              <li><a href="/#introduction">{tUI.stories}</a></li>
              <li><a href="/#about">{tUI.about}</a></li>
            </ul>
          </nav>

          <nav aria-label={tUI.contributeLabel}>
            <h2 className="footer-col-title">{tUI.contributeLabel}</h2>
            <ul className="footer-links">
              <li><a href="/contribute">{tUI.contribute}</a></li>
              <li><a href="/login">{tUI.login}</a></li>
              <li><a href="/signup">{tUI.signup}</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>{copyright || `© ${new Date().getFullYear()} Khmer Living Archive`}</span>
          <span className="footer-langs">
            {tUI.language}:
            <span className="footer-lang" aria-current={language === "en" ? "true" : "false"}>
              English
            </span>
            <span aria-hidden="true">·</span>
            <span className="footer-lang" lang="km" aria-current={language === "kh" ? "true" : "false"}>
              ខ្មែរ
            </span>
          </span>
          <a href="#" className="footer-top-link">{tUI.backToTop}</a>
        </div>
      </div>
    </footer>
  );
}
