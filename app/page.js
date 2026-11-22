"use client";

// app/page.js
// The archive homepage: hero, introduction, featured stories, the searchable
// collection, the storytelling band, the contribution call-to-action, and
// "about" information. Data still comes from the existing /api/entries route,
// which returns published entries only.
import { useEffect, useMemo, useState } from "react";
import collection, { collectionText } from "../collection.config.js";
import { toKhmerNumber } from "../components/theme.js";
import { useLanguage } from "../components/useLanguage.js";
import Navbar from "../components/Navbar.js";
import HeroSection from "../components/HeroSection.js";
import ArchiveIntroduction from "../components/ArchiveIntroduction.js";
import FeaturedFoods from "../components/FeaturedFoods.js";
import FoodSearch from "../components/FoodSearch.js";
import FoodFilters from "../components/FoodFilters.js";
import FoodGrid from "../components/FoodGrid.js";
import ArchiveStory from "../components/ArchiveStory.js";
import ContributeCta from "../components/ContributeCta.js";
import CuratorSection from "../components/CuratorSection.js";
import ArchiveStatement from "../components/ArchiveStatement.js";
import Footer from "../components/Footer.js";
import Reveal from "../components/Reveal.js";
import { getImageSrc } from "../components/image-src.js";

// Interface labels only. Food names and stories come from the database and are
// never translated here. Strings without a verified Khmer translation elsewhere
// in the project stay in English, matching the existing convention.
const t = {
  en: {
    eyebrow: "THE COLLECTION",
    title: "Explore the Collection",
    lead: "Browse every published food in the archive. Search by food name, village, contributor, or a phrase from the story.",
    showing: "Showing",
    of: "of",
    foods: "foods",
    reset: "Clear search and filters",
    loading: "Loading the archive…",
    loadError: "Could not load the archive.",
    retry: "Try again",
    empty: "No entries in the archive yet.",
    emptyHint: "Be the first to add a village food story.",
    contribute: "Contribute a Story",
    noResults: "No foods match your search.",
    noResultsHint: "Try another spelling, a village name, or clear the filters.",
    collectionMeta: (n) => `${String(n).padStart(2, "0")} FOODS`,
    collectionMetaKh: (n) => `${toKhmerNumber(String(n).padStart(2, "0"))} មុខម្ហូប`,
  },
  kh: {
    eyebrow: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    title: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    lead: "ស្វែងរកមុខម្ហូបប្រពៃណីដែលទាក់ទងនឹងភូមិ គ្រួសារ និងសហគមន៍ខ្មែរ។",
    showing: "បង្ហាញ",
    of: "នៃ",
    foods: "មុខម្ហូប",
    reset: "សម្អាតការស្វែងរក",
    loading: "កំពុងផ្ទុក…",
    loadError: "មិនអាចផ្ទុកធាតុបានទេ។",
    retry: "ព្យាយាមម្ដងទៀត",
    empty: "មិនទាន់មានធាតុនៅក្នុងបណ្ណសារទេ។",
    emptyHint: "ក្លាយជាអ្នកដំបូងដែលបន្ថែមរឿងរ៉ាវអាហារតាមភូមិ។",
    contribute: "ចូលរួមចំណែក",
    noResults: "រកមិនឃើញធាតុ",
    noResultsHint: "សូមព្យាយាមសរសេរខុសគ្នា ឈ្មោះភូមិ ឬសម្អាតតម្រង។",
    collectionMeta: (n) => `${toKhmerNumber(String(n).padStart(2, "0"))} មុខម្ហូប`,
    collectionMetaKh: (n) => `${toKhmerNumber(String(n).padStart(2, "0"))} មុខម្ហូប`,
  },
};

// --- Collection helpers -------------------------------------------------

// Skeleton cards keep the collection area's shape while entries load, so the
// page does not jump when the real cards arrive.
function LoadingCollection() {
  return (
    <div className="food-grid" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div className="food-card-skeleton" key={item}>
          <span className="skeleton skeleton-media" />
          <div className="food-card-body">
            <span className="skeleton" style={{ height: 22, width: "68%" }} />
            <span className="skeleton" style={{ height: 14, width: "42%" }} />
            <span className="skeleton" style={{ height: 12, width: "92%" }} />
            <span className="skeleton" style={{ height: 12, width: "80%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// One honest empty state for "no entries yet" and "no search results".
// Buttons only appear when there is a real action behind them.
function CollectionEmpty({ title, text, action, onAction, secondary, secondaryHref }) {
  return (
    <div className="empty-state">
      <p className="empty-state-motif" aria-hidden="true">✦</p>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{text}</p>
      <div className="empty-state-actions">
        {onAction && (
          <button type="button" className="btn btn--secondary btn--sm" onClick={onAction}>
            {action}
          </button>
        )}
        {secondaryHref && (
          <a href={secondaryHref} className="btn btn--primary btn--sm">
            {secondary}
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useLanguage();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Published entries only — the existing /api/entries route already enforces
  // that. A failed request shows a retry action rather than a fake empty page.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);

    fetch("/api/entries")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);


  // Location filters come only from places present in the loaded records —
  // no invented categories, regions, or ingredients.
  const locations = useMemo(() => {
    const seen = new Set();
    const list = [];
    entries.forEach((entry) => {
      const place = (entry.place || "").trim();
      if (!place || seen.has(place)) return;
      seen.add(place);
      list.push({ value: place, label: place });
    });
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, [entries]);

  // Search covers English name, Khmer name, story text in both languages,
  // contributor, and place.
  // Search and the location filter apply together.
  const visible = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filterPlace && (entry.place || "").trim() !== filterPlace) return false;
      if (!term) return true;
      const haystack = [
        entry.title,
        entry.khmerTitle,
        entry.description,
        entry.descriptionKh,
        entry.contributor,
        entry.place,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [entries, searchTerm, filterPlace]);

  const hasFilters = searchTerm.trim() !== "" || filterPlace !== "";
  const resetFilters = () => {
    setSearchTerm("");
    setFilterPlace("");
  };

  // The hero uses the newest real entry photograph; the local archive photo is
  // the fallback only when no published entry has a displayable image.
  const heroImage = useMemo(() => {
    const withPhoto = entries.find((entry) => getImageSrc(entry.image));
    return withPhoto ? getImageSrc(withPhoto.image) : "/images/Num-Banh-Chok-Khmer.jpg";
  }, [entries]);

  const tUI = t[language] || t.en;


  return (
    <div className="page">
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content">
        <HeroSection
          language={language}
          heroImage={heroImage}
          count={entries.length}
          places={locations.length}
        />

        <ArchiveIntroduction language={language} />

        {/* <FeaturedFoods entries={entries} language={language} /> */}

        <section
          id="collection"
          className="section collection-section"
          aria-labelledby="collection-title"
        >
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{tUI.eyebrow}</p>
                <h2 id="collection-title" className="section-title">
                  {tUI.title}
                </h2>
                <p className="section-lead">{tUI.lead}</p>
                <p className="collection-meta-line">
                  <span>
                    {language === "kh"
                      ? tUI.collectionMetaKh(entries.length)
                      : tUI.collectionMeta(entries.length)}
                  </span>
                  <span className="dot" aria-hidden="true">·</span>
                  <span className={language === "kh" ? "khmer" : ""}>
                    {language === "kh" ? "ខ្មែរ · English" : "English · ខ្មែរ"}
                  </span>
                </p>
              </div>
            </Reveal>

            <div className="toolbar">
              <FoodSearch
                language={language}
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
              />
              <FoodFilters
                language={language}
                locations={locations}
                active={filterPlace}
                onChange={setFilterPlace}
              />
            </div>

            <div className="results-line" role="status" aria-live="polite">
              {loading ? (
                <span>{tUI.loading}</span>
              ) : failed ? (
                <span>{tUI.loadError}</span>
              ) : (
                <span>
                  {tUI.showing} <strong>{visible.length}</strong> {tUI.of}{" "}
                  <strong>{entries.length}</strong> {tUI.foods}
                </span>
              )}
              {hasFilters && !loading && (
                <button type="button" className="btn btn--quiet btn--sm" onClick={resetFilters}>
                  {tUI.reset}
                </button>
              )}
            </div>

            {loading ? (
              <LoadingCollection />
            ) : failed ? (
              <CollectionEmpty
                title={tUI.loadError}
                text={tUI.noResultsHint}
                action={tUI.retry}
                onAction={() => setReloadKey((key) => key + 1)}
              />
            ) : entries.length === 0 ? (
              <CollectionEmpty
                title={tUI.empty}
                text={tUI.emptyHint}
                secondary={tUI.contribute}
                secondaryHref="/contribute"
              />
            ) : visible.length === 0 ? (
              <CollectionEmpty
                title={tUI.noResults}
                text={tUI.noResultsHint}
                action={tUI.reset}
                onAction={resetFilters}
              />
            ) : (
              <FoodGrid entries={entries} visible={visible} language={language} />
            )}
          </div>
        </section>

        <ArchiveStory language={language} />

        <ContributeCta language={language} />

        <section id="about" className="section about-section" aria-labelledby="about-title">
          <div className="container about-grid">
            <CuratorSection language={language} curator={collectionText(collection.curator, language)} />
            <ArchiveStatement language={language} source={collectionText(collection.source, language)} />
          </div>
        </section>
      </main>

      <Footer
        language={language}
        copyright={`© ${new Date().getFullYear()} Khmer Living Archive`}
      />
    </div>
  );
}

