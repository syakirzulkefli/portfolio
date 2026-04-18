-- Notes storage (database-backed source for /notes)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins can read own role" on public.admins;
create policy "admins can read own role"
on public.admins
for select
to authenticated
using (user_id = auth.uid());

create table if not exists public.notes (
  id text primary key,
  kind text not null default 'note' check (kind in ('folder', 'note')),
  domain text not null check (domain in ('software', 'trading', 'motivation')),
  section text not null,
  parent_id text references public.notes(id) on delete cascade,
  chapter_id text default '',
  chapter_title text default '',
  title text not null,
  label text not null default '',
  summary text not null default '',
  level text not null check (level in ('intro', 'beginner', 'intermediate', 'advanced')),
  tags text[] not null default '{}',
  pinned boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  content text not null default '',
  deleted_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.notes
  add column if not exists kind text;

update public.notes
set kind = 'note'
where kind is null or btrim(kind) = '';

alter table public.notes
  alter column kind set default 'note';

alter table public.notes
  alter column kind set not null;

alter table public.notes
  drop constraint if exists notes_kind_check;

alter table public.notes
  add constraint notes_kind_check
  check (kind in ('folder', 'note'));

alter table public.notes
  add column if not exists parent_id text;

alter table public.notes
  add column if not exists chapter_id text default '';

alter table public.notes
  add column if not exists chapter_title text default '';

alter table public.notes
  alter column chapter_id drop not null;

alter table public.notes
  alter column chapter_title drop not null;

alter table public.notes
  alter column chapter_id set default '';

alter table public.notes
  alter column chapter_title set default '';

update public.notes
set chapter_id = ''
where chapter_id is null;

update public.notes
set chapter_title = ''
where chapter_title is null;

alter table public.notes
  add column if not exists deleted_at timestamptz;

alter table public.notes
  drop constraint if exists notes_domain_check;

alter table public.notes
  add constraint notes_domain_check
  check (domain in ('software', 'trading', 'motivation'));

alter table public.notes
  drop constraint if exists notes_level_check;

alter table public.notes
  add constraint notes_level_check
  check (level in ('intro', 'beginner', 'intermediate', 'advanced'));

alter table public.notes
  drop constraint if exists notes_parent_id_fkey;

alter table public.notes
  add constraint notes_parent_id_fkey
  foreign key (parent_id) references public.notes(id) on delete cascade;

update public.notes
set content = ''
where kind = 'folder' and content <> '';

with legacy_groups as (
  select
    domain,
    section,
    btrim(chapter_id) as chapter_id,
    lower(
      left(
        'legacy-folder-' ||
          domain ||
          '-' ||
          section ||
          '-' ||
          trim(
            both '-'
            from regexp_replace(
              regexp_replace(btrim(chapter_id), '[^a-zA-Z0-9_-]+', '-', 'g'),
              '-+',
              '-',
              'g'
            )
          ),
        121
      )
    ) as folder_id,
    coalesce(
      nullif(max(nullif(btrim(chapter_title), '')), ''),
      initcap(replace(btrim(chapter_id), '-', ' '))
    ) as folder_title,
    min(sort_order) as sort_order,
    bool_or(is_published) as is_published,
    min(created_at) as created_at,
    max(updated_at) as updated_at
  from public.notes
  where
    kind = 'note'
    and parent_id is null
    and nullif(btrim(chapter_id), '') is not null
  group by domain, section, btrim(chapter_id)
)
insert into public.notes (
  id,
  kind,
  domain,
  section,
  parent_id,
  chapter_id,
  chapter_title,
  title,
  label,
  summary,
  level,
  tags,
  pinned,
  sort_order,
  is_published,
  content,
  deleted_at,
  updated_at,
  created_at
)
select
  legacy_groups.folder_id,
  'folder',
  legacy_groups.domain,
  legacy_groups.section,
  null,
  '',
  '',
  legacy_groups.folder_title,
  legacy_groups.folder_title,
  '',
  'intro',
  '{}'::text[],
  false,
  legacy_groups.sort_order,
  legacy_groups.is_published,
  '',
  null,
  legacy_groups.updated_at,
  legacy_groups.created_at
from legacy_groups
where not exists (
  select 1
  from public.notes existing
  where existing.id = legacy_groups.folder_id
);

with legacy_groups as (
  select
    domain,
    section,
    btrim(chapter_id) as chapter_id,
    lower(
      left(
        'legacy-folder-' ||
          domain ||
          '-' ||
          section ||
          '-' ||
          trim(
            both '-'
            from regexp_replace(
              regexp_replace(btrim(chapter_id), '[^a-zA-Z0-9_-]+', '-', 'g'),
              '-+',
              '-',
              'g'
            )
          ),
        121
      )
    ) as folder_id
  from public.notes
  where
    kind = 'note'
    and parent_id is null
    and nullif(btrim(chapter_id), '') is not null
  group by domain, section, btrim(chapter_id)
)
update public.notes notes
set parent_id = legacy_groups.folder_id
from legacy_groups
where
  notes.kind = 'note'
  and notes.parent_id is null
  and notes.domain = legacy_groups.domain
  and notes.section = legacy_groups.section
  and btrim(notes.chapter_id) = legacy_groups.chapter_id;

create index if not exists notes_domain_idx on public.notes (domain);
create index if not exists notes_chapter_idx on public.notes (chapter_id, sort_order);
create index if not exists notes_parent_idx on public.notes (parent_id);
create index if not exists notes_topic_tree_idx on public.notes (domain, section, parent_id, sort_order);
create index if not exists notes_updated_at_idx on public.notes (updated_at desc);
create index if not exists notes_deleted_at_idx on public.notes (deleted_at);

create or replace function public.set_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row
execute function public.set_notes_updated_at();

alter table public.notes enable row level security;

drop policy if exists "public can read published notes" on public.notes;
drop policy if exists "public can read published software notes" on public.notes;
drop policy if exists "public can read published public notes" on public.notes;

drop policy if exists "admins can read all notes" on public.notes;
create policy "admins can read all notes"
on public.notes
for select
to authenticated
using (
  exists (
    select 1
    from public.admins admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "admins can insert notes" on public.notes;
create policy "admins can insert notes"
on public.notes
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admins admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "admins can update notes" on public.notes;
create policy "admins can update notes"
on public.notes
for update
to authenticated
using (
  exists (
    select 1
    from public.admins admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admins admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "admins can delete notes" on public.notes;
create policy "admins can delete notes"
on public.notes
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins admins
    where admins.user_id = auth.uid()
  )
);
