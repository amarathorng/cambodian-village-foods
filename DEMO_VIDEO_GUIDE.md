# Demo Video Guide

Target length: **4:00–4:30**. Record one continuous take in English. The app must remain open throughout the recording.

## 1. Before recording

1. Start the app:

   ```sh
   npm run dev
   ```

2. Open `http://localhost:3000` in a normal browser window.
3. Prepare two signed-in accounts:
   - **Contributor account:** submits and owns the demo entry.
   - **Second contributor account:** briefly demonstrates that it has no controls on the first account's entry.
   - **Reviewer account:** publishes the submitted entry.

   Do not display passwords or other account secrets in the recording.

4. Make a small test entry that is easy to show:
   - English title: `Demo Village Cake`
   - Khmer title: `នំឌីមូ`
   - Place: `Pursat`
   - Story: at least 30 characters describing a real or clearly labeled demo food story.
   - Contributor: use the contributor account's own name or a demo label.
   - Photo: a small JPG or PNG under 5 MB.

5. Preflight in a private/incognito window:
   - the home page loads;
   - search and place filtering work;
   - both accounts can log in;
   - the reviewer account can open `/review`;
   - Supabase is awake and photo upload works.

## 2. Exact recording sequence

### 0:00–0:35 — Visitor: browse and search

1. Show the public home page while signed out.
2. Say: “This is Cambodian Village Foods, a Khmer Living Archive. I am a visitor browsing the published collection.”
3. Scroll through a few cards.
4. Enter `Pursat` or a known food name in search.
5. Show the matching result.
6. Use the place filter, then clear it if needed.

### 0:35–1:30 — Contributor: sign in and add an entry

1. Open `/login` and sign in with the contributor account.
2. Open `/contribute`.
3. Say: “Now I am acting as a contributor. I will submit a new entry, but it will remain pending until a reviewer publishes it.”
4. Fill in the prepared demo fields and choose the prepared photo.
5. Submit the form.
6. Show the resulting entry status as pending and point out that it is not yet public.
7. Open `/my-entries` and show that the entry appears there.

### 1:30–2:15 — Ownership: compare accounts

1. Stay on the demo entry and show Edit/Delete controls while signed in as the owner.
2. Say: “These controls belong to the account that owns this entry.”
3. Sign out or switch to the second contributor account.
4. Open the same entry URL.
5. Show that no Edit/Delete controls appear.
6. Say: “A second contributor cannot edit or delete my entry.”
7. Optionally open `/my-entries` to show only the second account's entries.

### 2:15–3:10 — Reviewer: publish

1. Sign out and sign in with the reviewer account.
2. Open `/review`.
3. Show the pending demo entry.
4. Click the publish action and confirm it.
5. Say: “The reviewer publishes or returns entries. This action is protected by the review route and the database function, not only by a hidden button.”

### 3:10–4:00 — Publish result and four-feature close

1. Sign out or switch back to a visitor view.
2. Return to `/` and search for `Demo Village Cake`.
3. Show that the entry now appears in public browsing and search.
4. Open the entry to show its detail page.
5. Return to the home page and complete the narration:
   - Name a design decision: “A decision the briefs did not make for me was keeping all archive cards at equal size instead of making one oversized featured card.”
   - Name an AI mistake: “One place the AI got it wrong was producing unsupported README claims about deployed Supabase and contributor verification; I reviewed the routes and database details and revised those claims.”
6. End with: “The archive now demonstrates browse, search, contributor submission, owner controls, and reviewer publishing.”

## 3. If a step fails

- **No pending entry:** refresh `/review`; if it is still missing, confirm that submission uses the database default `pending`.
- **No edit controls:** confirm the owner account is signed in and the entry URL belongs to that account.
- **Second account sees controls:** stop the recording and verify owner comparison and RLS before retrying.
- **Publish fails:** confirm the account is marked as a reviewer and `review_entry()` is deployed.
- **Photo upload fails:** use a smaller JPG/PNG and verify the `photos` storage bucket and photo policy.
- **A feature is slow:** wait while the app loads rather than skipping the feature. Supabase may need time to wake up.

Do not include a password, secret key, service-role key, or private browser token in the video.

## 4. Record and upload

### Windows

1. Press **Windows key + G** to open Xbox Game Bar.
2. Open the Capture panel and select the browser window.
3. Turn on the microphone.
4. Click Record, complete the guide above in one take, then press **Windows key + Alt + R** to stop.
5. Find the video in `Videos\Captures`.

### Upload

1. Upload the MP4 to YouTube as **Unlisted** or to Google Drive and set access to **Anyone with the link — Viewer**.
2. Open the link in a private/incognito browser window.
3. Confirm that the video plays for someone who is signed out.
4. Submit the public link in the course website and post the same link in the Show Your Archive discussion.
