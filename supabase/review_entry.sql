-- supabase/review_entry.sql
-- Run this file in the Supabase dashboard: SQL Editor -> New query -> Run.
--
-- Why this file exists: the reviewer decision lives in the database, in the
-- review_entry function called by app/api/review/[id]/route.js. The previous
-- version accepted the decision "rejected" and then wrote status = 'rejected'
-- into entries. The entries_status_check constraint only allows 'pending',
-- 'published', and 'returned', so every rejection failed with:
--   23514: new row for relation "entries" violates check constraint
--          "entries_status_check"
-- A reviewer could never reject an entry, so nothing ever came back to a
-- contributor for editing.
--
-- The fix: keep the same signature and decision names ('published' and
-- 'rejected'), but store a rejection as 'returned'. The contributor can then
-- open the entry, edit it, and save it; the edit form sets status back to
-- 'pending' and it re-enters the review queue.
--
-- CREATE OR REPLACE keeps the function's existing owner and execute grants, so
-- the client does not need any new permissions.

create or replace function public.review_entry(entry_id uuid, decision text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only reviewers may decide. Returning false (instead of raising) lets the
  -- API report "the database refused this decision" without leaking details.
  if not public.is_reviewer() then
    return false;
  end if;

  if decision not in ('published', 'rejected') then
    raise exception 'decision must be published or rejected'
      using errcode = '22023';
  end if;

  -- A rejection is stored as 'returned': the entry goes back to its owner,
  -- stays out of the public archive, and waits for an edit that resubmits it.
  update public.entries
     set status = case decision
                    when 'published' then 'published'
                    else 'returned'
                  end
   where id = entry_id
     and status = 'pending';

  -- FOUND is false when the row was missing or no longer pending, so the API
  -- can tell the reviewer the decision did not apply.
  return found;
end;
$$;
