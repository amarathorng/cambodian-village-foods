"use client";

import collection from "../collection.config.js";
import { useEffect, useState } from "react";
import { colors, fonts, toKhmerNumber } from "../components/theme.js";
import Navbar from "../components/Navbar.js";
import HeroSection from "../components/HeroSection.js";
import ArchiveIntroduction from "../components/ArchiveIntroduction.js";
import FoodSearch from "../components/FoodSearch.js";
import FoodFilters from "../components/FoodFilters.js";
import FoodGrid from "../components/FoodGrid.js";
import CuratorSection from "../components/CuratorSection.js";
import ArchiveStatement from "../components/ArchiveStatement.js";
import Footer from "../components/Footer.js";

// UI text per language. Food titles/descriptions come from the database; these
// are interface labels only, and only where the project has a verified Khmer
// translation.
const t = {
  en: {
    loading: "Loading archive…",
    error: "Could not load entries.",
    empty: "No entries in the archive yet.",
    noResults: "No foods found. Try another search.",
    resultCount: "Showing",
    ofFoods: "of",
    foods: "foods",
    reset: "Reset search",
    collectionLabel: "The Village Food Collection",
    collectionKhmer: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    collectionMeta: (n) => `${String(n).padStart(2, "0")} FOODS`,
    collectionMetaKh: (n) => `${toKhmerNumber(String(n).padStart(2, "0"))} មុខម្ហូប`,
    collectionSupport: "Explore traditional foods connected to Cambodian villages, families, and communities.",
  },
  kh: {
    loading: "កំពុងផ្ទុក…",
    error: "មិនអាចផ្ទុកធាតុបានទេ។",
    empty: "មិនទាន់មានធាតុនៅក្នុងបណ្ណសារទេ។",
    noResults: "រកមិនឃើញធាតុ",
    resultCount: "Showing",
    ofFoods: "of",
    foods: "foods",
    reset: "សម្អាតការស្វែងរក",
    collectionLabel: "The Village Food Collection",
    collectionKhmer: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    collectionMeta: (n) => `${String(n).padStart(2, "0")} FOODS`,
    collectionMetaKh: (n) => `${toKhmerNumber(String(n).padStart(2, "0"))} មុខម្ហូប`,
    collectionSupport: "Explore traditional foods connected to Cambodian villages, families, and communities.",
  },
};
export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("");
  const [language, setLanguage] = useState("en");
  const tUI = t[language] || t.en;

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

  // Search across the fields that actually exist.
  const filteredEntries = entries.filter((entry) => {
    const term = searchTerm.trim().toLowerCase();
    const haystack = [
      entry.title,
      entry.khmerTitle,
      entry.description,
      entry.contributor,
      entry.place,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch = !term || haystack.includes(term);
    const matchesPlace = !filterPlace || entry.place === filterPlace;
    return matchesSearch && matchesPlace;
  });

  // Distinct locations derived only from real records.
  const locationSet = [];
  entries.forEach((e) => {
    if (e.place && !locationSet.some((l) => l.value === e.place)) {
      locationSet.push({ value: e.place, label: e.place.split(",")[0].trim() });
    }
  });

  const contentMax = { maxWidth: 1180, margin: "0 auto" };

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text }}>
      <Navbar language={language} setLanguage={setLanguage} container={contentMax} />
      <div style={contentMax}>
        <HeroSection language={language} heroImage="/images/hero-prahok-ang.jpeg" />
        <ArchiveIntroduction language={language} />
      </div>

      <div
        id="collection"
        className="collection-section"
        style={{ ...contentMax, paddingTop: 24 }}
      >
        <span className="section-label" style={{ fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.16em", color: colors.muted }}>
          {tUI.collectionKhmer}
        </span>
        <h2 style={{ margin: "14px 0 6px", fontFamily: fonts.stack, fontSize: 34, fontWeight: 700, color: colors.text }}>
          {tUI.collectionLabel}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          <span className="collection-meta" style={{ fontFamily: fonts.stack, fontSize: 13, letterSpacing: "0.1em", color: colors.green2 }}>
            {tUI.collectionMeta(entries.length)}
          </span>
          <span aria-hidden="true" style={{ color: colors.border }}>/</span>
          <span className="collection-meta" style={{ fontFamily: fonts.khmer, fontSize: 13, letterSpacing: "0.05em", color: colors.text2 }}>
            {tUI.collectionMetaKh(entries.length)}
          </span>
        </div>
        <p style={{ margin: "12px 0 26px", maxWidth: "60ch", fontFamily: fonts.stack, fontSize: 16, lineHeight: 1.6, color: colors.text2 }}>
          {tUI.collectionSupport}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 12 }}>
          <FoodSearch language={language} value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm("")} />
          <FoodFilters language={language} locations={locationSet} active={filterPlace} onChange={setFilterPlace} />
        </div>

        {loading ? (
          <p className="status" style={{ color: colors.text2, fontSize: 15 }}>{tUI.loading}</p>
        ) : error ? (
          <p className="status" style={{ color: colors.danger, fontSize: 15 }}>{tUI.error}</p>
        ) : entries.length === 0 ? (
          <p className="status" style={{ color: colors.text2, fontSize: 15 }}>{tUI.empty}</p>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-state" style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed " + colors.border, borderRadius: 14, backgroundColor: colors.bg2 }}>
            <p style={{ color: colors.text, fontFamily: fonts.stack, fontSize: 18, fontWeight: 600, margin: 0 }}>{tUI.noResults}</p>
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearchTerm("");
                setFilterPlace("");
              }}
              style={{ marginTop: 14, fontFamily: fonts.stack, fontSize: 14, color: colors.green2, background: "none", border: "1px solid " + colors.border, borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}
            >
              {tUI.reset}
            </button>
          </div>
        ) : (
          <>
            <p className="status" role="status" style={{ color: colors.muted, fontSize: 14.5 }}>
              {tUI.resultCount} {filteredEntries.length} {tUI.ofFoods} {entries.length} {tUI.foods}
            </p>
            <FoodGrid entries={entries} visible={filteredEntries} language={language} />
          </>
        )}
      </div>

      <div id="about-info" style={{ ...contentMax, paddingTop: 40 }}>
        <CuratorSection language={language} curator={collection.curator} />
        <ArchiveStatement language={language} source={collection.source} />
      </div>

      <Footer language={language} copyright="© 2026 Khmer Living Archive" />
    </main>
  );
}