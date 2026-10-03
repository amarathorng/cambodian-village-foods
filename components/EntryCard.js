// Google Drive links can't be used directly as an <img> "src". This converts a
// Drive *file* link into a directly-displayable thumbnail URL so the photo shows
// immediately. Drive *folder* links hold many files and can't be shown as one
// image, so those return null and fall back to a "view" link in the card.
function getImageSrc(image) {
  if (!image) return null;

  // Already a direct image URL (e.g. .../photo.jpg).
  if (/\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(image)) return image;

  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileMatch = image.match(/\/file\/d\/([^/]+)/);
  if (fileMatch && fileMatch[1]) {
    // lh3.googleusercontent.com is the most reliable host for embedding a
    // publicly-shared Google Drive image directly in an <img>.
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1000`;
  }

  // https://drive.google.com/uc?export=view&id=FILE_ID  (or thumbnail links)
  const idMatch = image.match(/[?&]id=([^&/]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1000`;
  }

  // Folder links and anything unrecognized cannot render as a single image.
  return null;
}

// Card UI labels for each language. Descriptions and titles come from the
// database; these are the interface labels only.
const t = {
  en: {
    contributor: "Contributor:",
    place: "Place:",
    viewPhoto: "View photo on Google Drive",
  },
  kh: {
    contributor: "អ្នកចូលរួម៖",
    place: "ទីកន្លែង៖",
    viewPhoto: "មើលរូបថតនៅលើ Google Drive",
  },
};

const EntryCard = ({ entry, language = "en" }) => {
  const tUI = t[language] || t.en;
  const cardStyle = {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  };

  const labelStyle = {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  };

  const valueStyle = {
    fontSize: 16,
    margin: "6px 0 0",
  };

  const imageStyle = {
    width: "100%",
    height: "70%",
    backgroundColor: "#2E3644",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  };

  const imgSrc = getImageSrc(entry.image);
  const hasDriveLink = !!entry.image && !imgSrc;

  // Primary title follows the selected language; the other language stays as a
  // subtitle so the existing two-line card layout is preserved.
  const primaryTitle = language === "kh" ? (entry.khmerTitle || entry.title) : entry.title;
  const secondaryTitle = language === "kh" ? entry.title : (entry.khmerTitle || "");

  return (
    <div style={cardStyle}>
      {imgSrc ? (
        <div style={imageStyle}>
          <img src={imgSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={primaryTitle} />
        </div>
      ) : hasDriveLink ? (
        <div style={{ ...imageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <a
            href={entry.image}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2EE6A8", textDecoration: "none", fontSize: 14, fontWeight: 600 }}
          >
            {tUI.viewPhoto}
          </a>
        </div>
      ) : null}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px" }}>
        {primaryTitle}
      </h3>
      <h4 style={{ fontSize: 16, fontWeight: 500, color: "#D0D8E8", margin: "0 0 8px" }}>
        {secondaryTitle}
      </h4>
      <p style={{ fontSize: 16, color: "#97A1B3", lineHeight: 1.6, margin: 0 }}>
        {entry.description}
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: 12, alignItems: "center" }}>
        <p style={labelStyle}>{tUI.contributor}</p>
        <span style={valueStyle}>{entry.contributor}</span>
        <p style={{...labelStyle, margin: "0 4px"}}>|</p>
        <p style={labelStyle}>{tUI.place}</p>
        <span style={valueStyle}>{entry.place}</span>
      </div>
    </div>
  );
};

export default EntryCard;