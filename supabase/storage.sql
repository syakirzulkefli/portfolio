-- Notes image storage policies (Supabase Storage)
-- Bucket: notes-media (public)
-- Update bucket_id if you change NOTES_STORAGE_BUCKET.

drop policy if exists "public can read notes images" on storage.objects;
create policy "public can read notes images"
on storage.objects
for select
to public
using (bucket_id = 'notes-media');

drop policy if exists "admins can upload notes images" on storage.objects;
create policy "admins can upload notes images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'notes-media'
  and exists (
    select 1 from public.admins admins where admins.user_id = auth.uid()
  )
);

drop policy if exists "admins can update notes images" on storage.objects;
create policy "admins can update notes images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'notes-media'
  and exists (
    select 1 from public.admins admins where admins.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'notes-media'
  and exists (
    select 1 from public.admins admins where admins.user_id = auth.uid()
  )
);

drop policy if exists "admins can delete notes images" on storage.objects;
create policy "admins can delete notes images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'notes-media'
  and exists (
    select 1 from public.admins admins where admins.user_id = auth.uid()
  )
);
