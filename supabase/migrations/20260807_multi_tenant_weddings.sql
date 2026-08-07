-- Shared Supabase project architecture for every DreamZ wedding.
-- Apply this once in the Supabase SQL editor, then create Auth users and
-- wedding_members rows using the examples in README.md.

create extension if not exists pgcrypto;

create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  couple_names text not null check (char_length(trim(couple_names)) between 3 and 160),
  wedding_date timestamptz,
  template_id text not null default 'elegant-floral',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_members (
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'coordinator', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (wedding_id, user_id)
);

create table if not exists public.rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  attendance text not null check (attendance in ('yes', 'no')),
  guest_count integer not null check (guest_count between 1 and 10),
  message text,
  created_at timestamptz not null default now()
);

-- Upgrade the original single-wedding RSVP table without deleting existing data.
alter table public.rsvp_submissions
  add column if not exists wedding_id uuid references public.weddings(id) on delete cascade;

create index if not exists wedding_members_user_id_idx
  on public.wedding_members(user_id);

create index if not exists rsvp_submissions_wedding_created_idx
  on public.rsvp_submissions(wedding_id, created_at desc);

alter table public.weddings enable row level security;
alter table public.wedding_members enable row level security;
alter table public.rsvp_submissions enable row level security;

-- Remove the single-tenant access paths. The legacy invitation_admins table is
-- deliberately retained so this upgrade never destroys data; it is no longer used.
drop policy if exists "anonymous RSVP insert" on public.rsvp_submissions;
drop function if exists public.get_rsvp_dashboard(text, text);
drop function if exists public.configure_invitation_admin(text);

revoke all on table public.weddings from anon, authenticated;
revoke all on table public.wedding_members from anon, authenticated;
revoke all on table public.rsvp_submissions from anon, authenticated;

grant select on table public.weddings to authenticated;
grant select on table public.wedding_members to authenticated;
grant select on table public.rsvp_submissions to authenticated;

drop policy if exists "members can read their weddings" on public.weddings;
create policy "members can read their weddings"
on public.weddings
for select
to authenticated
using (
  exists (
    select 1
    from public.wedding_members membership
    where membership.wedding_id = weddings.id
      and membership.user_id = (select auth.uid())
  )
);

drop policy if exists "members can read their memberships" on public.wedding_members;
create policy "members can read their memberships"
on public.wedding_members
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "members can read wedding rsvps" on public.rsvp_submissions;
create policy "members can read wedding rsvps"
on public.rsvp_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.wedding_members membership
    where membership.wedding_id = rsvp_submissions.wedding_id
      and membership.user_id = (select auth.uid())
  )
);

-- Public guests never receive direct table privileges. This narrowly-scoped
-- function validates the wedding and payload before inserting one RSVP.
create or replace function public.submit_wedding_rsvp(
  p_wedding_slug text,
  p_full_name text,
  p_attendance text,
  p_guest_count integer,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wedding_id uuid;
  v_submission_id uuid;
begin
  if p_wedding_slug is null or char_length(p_wedding_slug) > 120 then
    raise exception 'Invalid wedding invitation';
  end if;

  if p_full_name is null or char_length(btrim(p_full_name)) not between 1 and 160 then
    raise exception 'A valid guest name is required';
  end if;

  if p_attendance not in ('yes', 'no') then
    raise exception 'Invalid attendance response';
  end if;

  if p_guest_count not between 1 and 10 then
    raise exception 'Invalid guest count';
  end if;

  if p_message is not null and char_length(p_message) > 2000 then
    raise exception 'Message is too long';
  end if;

  select id
    into v_wedding_id
  from public.weddings
  where slug = lower(btrim(p_wedding_slug))
    and status = 'active';

  if v_wedding_id is null then
    raise exception 'Wedding invitation is unavailable';
  end if;

  insert into public.rsvp_submissions (
    wedding_id,
    full_name,
    attendance,
    guest_count,
    message
  ) values (
    v_wedding_id,
    btrim(p_full_name),
    p_attendance,
    p_guest_count,
    nullif(btrim(p_message), '')
  )
  returning id into v_submission_id;

  return v_submission_id;
end;
$$;

revoke all on function public.submit_wedding_rsvp(text, text, text, integer, text) from public;
grant execute on function public.submit_wedding_rsvp(text, text, text, integer, text) to anon, authenticated;

-- Seed this deployment's tenant. Re-running the migration is safe.
insert into public.weddings (
  slug,
  couple_names,
  wedding_date,
  template_id,
  status
) values (
  'paola-and-ryan',
  'Paola & Ryan',
  '2027-05-22T15:00:00+08:00'::timestamptz,
  'elegant-floral',
  'active'
)
on conflict (slug) do update
set couple_names = excluded.couple_names,
    wedding_date = excluded.wedding_date,
    template_id = excluded.template_id,
    status = excluded.status,
    updated_at = now();
