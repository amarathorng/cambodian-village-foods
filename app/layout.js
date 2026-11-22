import collection, { collectionText } from "../collection.config.js";
import { colors, fonts } from "../components/theme.js";
import "./archive.css";

export const metadata = {
  title: `${collectionText(collection.name, "en")} — Khmer Living Archive`,
  description: collectionText(collection.description, "en"),
};

// Fraunces carries the editorial English headings; Inter handles interface
// text; Noto Sans Khmer and Noto Serif Khmer make sure Khmer body copy and
// Khmer headings render in a font designed for the script.
const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Inter:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600&family=Noto+Serif+Khmer:wght@500;600&display=swap"
      rel="stylesheet"
    />
  </>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {fontLinks}
        {/* If scripts never run, reveal-animated sections must still be visible. */}
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
      </head>
      <body
        style={{
          margin: 0,
          backgroundColor: colors.bg,
          color: colors.text,
          fontFamily: fonts.stack,
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
