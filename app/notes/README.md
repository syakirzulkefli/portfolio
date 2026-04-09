## Notes runtime

- Runtime reads notes only from Supabase table `public.notes`.
- Legacy hardcoded markdown notes were removed from runtime flow.
- Main runtime loader: `app/notes/store.ts`.

### Setup

1. Run SQL schema in Supabase SQL editor:
   - `supabase/notes.sql`
2. Ensure env is set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Optional env:
   - `NOTES_STORAGE_BUCKET` (default: `notes-media`)

### Ongoing workflow

- Build the notes tree with `domain -> section -> parent_id`.
- Use `kind = 'folder'` for branch nodes and `kind = 'note'` for leaf content.
- Add/update leaf note content directly in `public.notes.content` (Markdown text).
- Manage metadata in table columns (`title`, `summary`, `level`, `tags`, `sort_order`, etc).
- Keep `is_published = true` on items you want visible in the live UI.

### Admin-only CRUD

- Admin UI route: `/notes/admin`.
- Admin API routes: `/api/notes/admin/notes` and `/api/notes/admin/notes/:id`.
- Access control uses `public.admins` + RLS in `supabase/notes.sql`.

### Images (Supabase Storage)

1. Create public bucket `notes-media` in Supabase Storage.
2. Apply storage policies from `supabase/storage.sql`.
3. Optional env override: `NOTES_STORAGE_BUCKET`.
4. Upload images in `/notes/admin` and the Markdown link is inserted automatically.

Bootstrap your admin account:

1. Sign in once so your user exists in Supabase Auth.
2. Copy your user UUID from Supabase Authentication -> Users.
3. Insert in SQL editor:
   - `insert into public.admins (user_id) values ('<your-user-uuid>');`

Public behavior:

- Public note pages/search only read `is_published = true`.
- Draft notes remain invisible publicly and are only visible in admin CRUD.
