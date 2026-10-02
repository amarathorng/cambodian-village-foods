// scripts/seed-photos.mjs
//
// ONE-TIME SEEDING SCRIPT
// ------------------------
// Uploads the local images in ./assets to a PUBLIC Supabase Storage bucket and
// points each `entries.photo` at the resulting public URL, so photos render
// inline on the home page (no Google Drive sharing required).
//
// HOW TO RUN (from the project root):
//
//   PowerShell:
//     $env:SERVICE_ROLE = "<your service-role key>"   # NOT committed anywhere
//     node scripts/seed-photos.mjs
//
//   bash:
//     SERVICE_ROLE="<your service-role key>" node scripts/seed-photos.mjs
//
//   DRY RUN (inspect without writing; no service-role key needed):
//     node scripts/seed-photos.mjs --dry-run
//
// The Supabase project URL is read from .env.local; the service-role key comes
// from the SERVICE_ROLE environment variable at runtime. Nothing in this file
// (or any file) contains a secret. The script only ever WRITES here:
//   - creates a public Storage bucket "photos" if missing,
//   - uploads each image (upsert, so it is safe to re-run),
//   - updates entries.photo for the matched rows.
// It never deletes anything.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const BUCKET = "photos"; // public Storage bucket
// Dry run: preview planned URLs without writing anything to Supabase.
const DRY_RUN = process.argv.includes("--dry-run") || process.argv.includes("--dryrun");

// ---- Read config -----------------------------------------------------------
// Supabase URL: from process env, else from .env.local (same as the app).
function loadEnvLocal() {
  const p = path.join(ROOT, ".env.local");
  if (!existsSync(p)) return {};
  return Object.fromEntries(
    readFileSync(p, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

const localEnv = loadEnvLocal();
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL;
// Service-role key is provided at runtime ONLY (never stored / printed here).
const SERVICE_ROLE = process.env.SERVICE_ROLE;

// ---- Title -> asset mapping -----------------------------------------------
// Maps each entry (matched by title_english) to the local image in ./assets.
// "Egg Cake" <-> nom-pong-tea.jpeg is by its Khmer name (នំពងទា = egg cake).
const MAPPING = [
  { title: "Prahok Ang",           asset: "prahok-ang.jpeg" },
  { title: "Nom Krouk",            asset: "Nom-Krouk.jpeg" },
  { title: "Egg Cake",             asset: "nom-pong-tea.jpeg" },
  { title: "Num Banh Chok",        asset: "nom-banh-chok.jpeg" },
  { title: "Banh Chhev Khmer",     asset: "banh-chhev-khmer.jpeg" },
  { title: "Samlor Machu Kreung",  asset: "somlor-mju-kroeung.jpeg" },
  { title: "Samlor Kor ko",        asset: "somlor-korko.jpeg" },
  { title: "Somlor Mchu Kon Trey", asset: "somlor-mchu-kon-trey.jpeg" },
];

const CONTENT_TYPE = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

// ---- Guards ----------------------------------------------------------------
if (!SUPABASE_URL) {
  console.error("Missing Supabase URL. Add it to .env.local or set NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}
if (!DRY_RUN && !SERVICE_ROLE) {
  console.error(
    "Missing service-role key. Run with SERVICE_ROLE=<key> set in the shell. Get it\n" +
      "from Supabase Dashboard -> Settings -> API -> service_role. Keep it private.\n" +
      "It is only used in memory and never written to a file.\n" +
      "Alternatively, preview with: node scripts/seed-photos.mjs --dry-run"
  );
  process.exit(1);
}

// In dry-run we never touch the network, so no client is needed.
const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SERVICE_ROLE);

// Standard public URL for an object in a public Supabase Storage bucket.
function publicStorageUrl(objectName) {
  const base = SUPABASE_URL.replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(objectName)}`;
}
// ---- Step 1: ensure the bucket exists & is public ---------------------------
async function ensureBucket() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;
  if (!buckets.some((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`createBucket: ${error.message}`);
    console.log(`Created public bucket "${BUCKET}".`);
  } else {
    console.log(`Bucket "${BUCKET}" already exists.`);
  }
}

// ---- Step 2: upload image + update the row ---------------------------------
async function seedOne(entry) {
  const assetPath = path.join(ASSETS_DIR, entry.asset);
  if (!existsSync(assetPath)) {
    console.warn(`SKIP "${entry.title}": asset missing -> ${entry.asset}`);
    return { title: entry.title, ok: false };
  }

  const ext = path.extname(entry.asset).toLowerCase();
  const contentType = CONTENT_TYPE[ext] || "application/octet-stream";
  const bytes = await readFile(assetPath);

  // Stable object name = asset filename, so re-running (upsert) overwrites the
  // same object instead of leaving duplicates behind.
  const objectName = entry.asset;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(objectName, bytes, { upsert: true, contentType, cacheControl: "3600" });
  if (upErr) {
    console.warn(`FAIL upload "${entry.title}": ${upErr.message}`);
    return { title: entry.title, ok: false };
  }

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectName).data.publicUrl;

  const { error: dbErr } = await supabase
    .from("entries")
    .update({ photo: publicUrl })
    .eq("title_english", entry.title);
  if (dbErr) {
    console.warn(`SKIP update "${entry.title}": ${dbErr.message} (photo was uploaded)`);
    return { title: entry.title, ok: false };
  }

  console.log(`OK "${entry.title}" -> ${publicUrl}`);
  return { title: entry.title, ok: true };
}

// ---- Dry-run preview (no writes, no network) ---------------------------------
async function preview() {
  console.log("DRY RUN - nothing will be written to Supabase.");
  let assetsOk = 0;
  for (const entry of MAPPING) {
    const assetPath = path.join(ASSETS_DIR, entry.asset);
    const exists = existsSync(assetPath);
    const url = publicStorageUrl(entry.asset);
    console.log(`[DRY] "${entry.title}" asset_exists=${exists} -> ${url}`);
    if (exists) assetsOk++;
  }
  console.log(`\nassets present: ${assetsOk}/${MAPPING.length}  (bucket: ${BUCKET})`);
  process.exit(assetsOk === MAPPING.length ? 0 : 1);
}

// ---- Run --------------------------------------------------------------------
async function main() {
  if (DRY_RUN) {
    await preview();
    return;
  }
  await ensureBucket();

  const results = [];
  for (const entry of MAPPING) {
    results.push(await seedOne(entry));
    await new Promise((r) => setTimeout(r, 200));
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDone. ${ok}/${results.length} entries updated. Review any SKIP/FAIL above.`);
  process.exit(ok === results.length ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});