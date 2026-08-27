import collection from "../collection.config.js";
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

const entries = [
  {
    title: "Amok Trey (អាម៉ុកត្រី)",
    description:
      "Amok is a traditional Cambodian steamed fish dish made with fish, coconut milk, lemongrass, galangal, turmeric, kaffir lime leaves, and other Khmer spices. A family story from Amok Khmer describes Sotho growing up in a floating village near Siem Reap in the early 1960s. She watched her mother prepare their traditional family Amok and helped collect herbs and spices from their garden. The family recipe was passed down from her mother and continues to be prepared using traditional techniques.",
    contributor: "Sotho, founder of Amok Khmer Cuisine",
    place: "Floating village near Siem Reap, Cambodia",
  },
  {
    title: "Nem Battambang (ណែមបាត់ដំបង)",
    description:
      "Nem is a traditional fermented fish snack associated strongly with Battambang. Fresh fish is mixed with garlic, coriander, honey, and salt, then packed tightly in banana leaves and allowed to ferment for about two days. Battambang people have prepared different forms of Nem for decades. One particularly famous version comes from the Chrei Kaong area of Battambang, where the fermented mixture is shaped, wrapped in banana leaves, and grilled.",
    contributor: "Local Nem makers of Chrei Kaong, Battambang",
    place: "Chrei Kaong area, Battambang Province, Cambodia",
  },
];

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <EntryCard entry={entries[0]} />
      <EntryCard entry={entries[1]} />

      <p style={styles.count}>entries in the archive: 2</p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
