// app/entry-mapper.js
// Single shape used by the public archive, owner views, and review queue.
// Database columns are snake_case; the existing UI components use camelCase.
export function toEntry(row) {
  if (!row) return null;

  return {
    id: row.id,
    owner: row.owner,
    title: row.title_english,
    khmerTitle: row.title_khmer,
    description: row.description_english,
    contributor: row.contributor,
    place: row.place,
    image: row.photo,
    created_at: row.created_at,
    status: row.status,
  };
}
