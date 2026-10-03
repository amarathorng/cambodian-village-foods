// components/image-src.js
// Google Drive links can't be used directly as an <img> "src". This converts a
// Drive *file* link into a directly-displayable thumbnail URL so the photo shows
// immediately. Drive *folder* links hold many files and can't be shown as one
// image, so those return null and fall back to a designed placeholder.
//
// Direct image URLs (e.g. the public Supabase Storage URLs written by
// scripts/seed-photos.mjs) are returned unchanged.
export function getImageSrc(image) {
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

// True when the record has a drive link but no embeddable image src.
export function hasUnrenderableImage(entry) {
  return !!entry.image && !getImageSrc(entry.image);
}