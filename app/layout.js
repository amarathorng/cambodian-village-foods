import collection from "../collection.config.js";
import "./archive.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Khmer&display=swap"
      rel="stylesheet"
    />
  </>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{fontLinks}</head>
      <body
        style={{
          margin: 0,
          backgroundColor: "#111513",
          color: "#F2EADB",
          fontFamily:
            "'Inter', 'Noto Sans Khmer', ui-sans-serif, system-ui, 'Segoe UI', sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
