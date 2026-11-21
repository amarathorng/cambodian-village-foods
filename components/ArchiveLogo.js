// components/ArchiveLogo.js
// The archive's emblem, shown wherever the site states its identity. The PNG is
// a background-free version of public/images/logo-cambo.jpg: the JPG's white
// background is transparent and the mark is tinted #3F7355 so it stays legible
// on the dark theme. Decorative by default — the wordmark beside it carries the
// name, so screen readers can skip it.
export default function ArchiveLogo({ size = 32 }) {
  return (
    <img
      src="/images/logo-cambo.png"
      alt=""
      width={size}
      height={size}
      style={{
        display: "block",
        flex: "none",
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
