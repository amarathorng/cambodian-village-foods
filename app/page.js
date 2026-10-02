"use client";

import collection from "../collection.config.js";
import { useEffect, useState } from "react";
import EntryCard from "../components/EntryCard";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

// UI text for each language. The food titles/descriptions come from the
// database; these are the interface labels only.
const t = {
  en: {
    login: "Login",
    signUp: "Sign Up",
    searchPlaceholder: "Search foods…",
    loading: "Loading archive…",
    error: "Could not load entries.",
    empty: "No entries in the archive yet.",
    noResults: "No entries found",
    count: "entries in the archive",
    kicker: "KHMER LIVING ARCHIVE",
    curatedBy: "CURATED BY",
    source: "SOURCE",
    clear: "Clear search",
    footer:
      "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December.",
  },
  kh: {
    login: "ចូល",
    signUp: "ចុះឈ្មោះ",
    searchPlaceholder: "ស្វែងរកអាហារ…",
    loading: "កំពុងផ្ទុក…",
    error: "មិនអាចផ្ទុកធាតុបានទេ។",
    empty: "មិនទាន់មានធាតុនៅក្នុងបណ្ណសារទេ។",
    noResults: "រកមិនឃើញធាតុ",
    count: "ធាតុនៅក្នុងបណ្ណសារ",
    kicker: "បណ្ណសារជីវិតខ្មែរ",
    curatedBy: "រៀបចំដោយ",
    source: "ប្រភព",
    clear: "សម្អាតការស្វែងរក",
    footer:
      "សាងសង់ក្នុង ICT 340 — Vibe Coding, សាកលវិទ្យាល័យអាមេរិកភ្នំពេញ។ បណ្ណសារនេះកំពុងសាងសង់ពេញមួយឆមាស។",
  },
};

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState("en");
  const tUI = t[language];

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        const res = await fetch("/api/entries");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load entries.");
        if (active) setEntries(json.entries);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEntries();

    return () => {
      active = false;
    };
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const term = searchTerm.trim();
    if (!term) return true;

    // Khmer mode searches the Khmer title; English mode searches the English
    // title and description.
    if (language === "kh") {
      const khTitle = entry.khmerTitle || "";
      return khTitle.includes(term);
    }

    const lowerTerm = term.toLowerCase();
    const lowerTitle = entry.title.toLowerCase();
    const lowerDesc = entry.description.toLowerCase();
    return lowerTitle.includes(lowerTerm) || lowerDesc.includes(lowerTerm);
  });

  return (
    <main style={styles.wrap}>
      <nav style={{ marginBottom: 24, display: "flex", width: "100%", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, marginRight: "auto" }}>
          {["en", "kh"].map((code) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              aria-pressed={language === code}
              style={{
                background: "none",
                border: `1px solid ${language === code ? "#2EE6A8" : "#2E3644"}`,
                color: language === code ? "#2EE6A8" : "#97A1B3",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {code === "en" ? "English" : "ខ្មែរ"}
            </button>
          ))}
        </div>
        <a href="/login" style={{ color: "#2EE6A8", textDecoration: "none", fontWeight: 600, marginRight: 5 }}>
          {tUI.login}
        </a>
        <a style={{ color: "#2EE6A8", textDecoration: "none", fontWeight: 600, marginRight: 5 }}>
          /
        </a>
        <a href="/signup" style={{ color: "#2EE6A8", textDecoration: "none", fontWeight: 600, marginRight: 12 }}>
          {tUI.signUp}
        </a>
      </nav>
      <p style={styles.kicker}>{tUI.kicker}</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={{marginBottom: 32, marginTop: 16}}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={tUI.searchPlaceholder}
          className="search-input"
          style={{
            padding: "8px 16px 8px 34px",
            fontSize: 14,
            border: "1px solid #2E3644",
            borderRadius: 6,
            backgroundColor: "#1C222C",
            color: "#FFFFFF",
          }}
        />

          {/* Clear button */}
          {searchTerm.trim().length > 0 && (
            <button
              className="search-clear"
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                width: 20,
                height: 20,
                background: "none",
                border: "none",
                color: "#6B7280",
                padding: 0,
                cursor: "pointer",
                fontSize: 12,
                lineHeight: 1,
              }}
              onClick={() => setSearchTerm("")}
              aria-label={tUI.clear}
            >
              ×
            </button>
          )}
        </div>

      <div style={styles.card}>
        <p style={styles.cardLabel}>{tUI.curatedBy}</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>{tUI.source}</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      {loading ? (
        <p style={{ color: "#97A1B3", marginTop: 32, fontSize: 14 }}>
          {tUI.loading}
        </p>
      ) : error ? (
        <p style={{ color: "#E078A8", marginTop: 32, fontSize: 14 }}>
          {tUI.error}
        </p>
      ) : entries.length === 0 ? (
        <p style={{ color: "#97A1B3", marginTop: 32, fontSize: 14 }}>
          {tUI.empty}
        </p>
      ) : filteredEntries.length > 0 ? (
        <>
          {filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} language={language} />)}
          <p style={styles.count}>{tUI.count}: {filteredEntries.length}</p>
        </>
      ) : (
        <p style={{color: "#97A1B3", marginTop: 32, fontSize: 14}}>
          {tUI.noResults}
        </p>
      )}

      

      <footer style={styles.footer}>
        {tUI.footer}
      </footer>
    </main>
  );
}
