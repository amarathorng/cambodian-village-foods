"use client";

import { useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard";
import entries from "../data/entries.js";

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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const matchesTitle = entry.title.toLowerCase().includes(term);
    const matchesDesc = entry.description.toLowerCase().includes(term);
    return matchesTitle || matchesDesc;
  });

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={{marginBottom: 32, marginTop: 16}}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search entries..."
          style={{
            padding: "8px 16px",
            fontSize: 14,
            border: "1px solid #2E3644",
            borderRadius: 6,
            backgroundColor: "#1C222C",
            color: "#FFFFFF",
            "&:focus": {outline: "none", borderColor: "#2EE6A8"},
          }}
        />
      </div>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      {filteredEntries.length > 0 ? (
        <>
          {filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
          <p style={styles.count}>entries in the archive: {filteredEntries.length}</p>
        </>
      ) : (
        <p style={{color: "#97A1B3", marginTop: 32, fontSize: 14}}>
          {searchTerm.length > 0 ? "No entries found" : ""}
        </p>
      )}

      {filteredEntries.length === 0 && searchTerm.length > 0 && (
        <p style={{color: "#97A1B3", marginTop: 8, fontSize: 14}}>No entries found</p>
      )}

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
