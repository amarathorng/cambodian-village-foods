-- supabase/add_description_kh.sql
-- Optional Khmer version of an entry's story.
--
-- Run this once in the Supabase SQL editor before deploying code that writes
-- description_kh. The column is nullable on purpose: existing rows keep working
-- unchanged, and the archive falls back to description_english wherever
-- description_kh is empty or null.
alter table public.entries
  add column if not exists description_kh text;
