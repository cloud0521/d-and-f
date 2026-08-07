-- Tenant-scoped dashboard credentials without collecting client email addresses.

create extension if not exists pgcrypto;

create table if not exists public.wedding_owner_credentials (
  username text primary key check (username = lower(username) and username ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wedding_owner_credentials_wedding_idx
  on public.wedding_owner_credentials(wedding_id);

alter table public.wedding_owner_credentials enable row level security;
revoke all on table public.wedding_owner_credentials from public, anon, authenticated;

create or replace function public.configure_wedding_owner(
  p_wedding_slug text,
  p_username text,
  p_password text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wedding_id uuid;
  v_username text := lower(btrim(p_username));
begin
  if v_username is null or v_username !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Username must contain only lowercase letters, numbers, and hyphens';
  end if;

  if p_password is null or char_length(p_password) < 12 then
    raise exception 'Password must contain at least 12 characters';
  end if;

  select id into v_wedding_id
  from public.weddings
  where slug = lower(btrim(p_wedding_slug));

  if v_wedding_id is null then
    raise exception 'Wedding not found';
  end if;

  insert into public.wedding_owner_credentials (
    username,
    wedding_id,
    password_hash
  ) values (
    v_username,
    v_wedding_id,
    extensions.crypt(p_password, extensions.gen_salt('bf'))
  )
  on conflict (username) do update
  set wedding_id = excluded.wedding_id,
      password_hash = excluded.password_hash,
      updated_at = now();
end;
$$;

revoke all on function public.configure_wedding_owner(text, text, text) from public, anon, authenticated;

create or replace function public.get_wedding_rsvp_dashboard(
  p_wedding_slug text,
  p_username text,
  p_password text
)
returns table (
  id uuid,
  full_name text,
  attendance text,
  guest_count integer,
  message text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wedding_id uuid;
begin
  select wedding.id into v_wedding_id
  from public.weddings wedding
  join public.wedding_owner_credentials credential
    on credential.wedding_id = wedding.id
  where wedding.slug = lower(btrim(p_wedding_slug))
    and credential.username = lower(btrim(p_username))
    and credential.password_hash = extensions.crypt(p_password, credential.password_hash)
    and wedding.status in ('active', 'archived');

  if v_wedding_id is null then
    raise exception 'Invalid dashboard credentials';
  end if;

  return query
  select
    submission.id,
    submission.full_name,
    submission.attendance,
    submission.guest_count,
    submission.message,
    submission.created_at
  from public.rsvp_submissions submission
  where submission.wedding_id = v_wedding_id
  order by submission.created_at desc;
end;
$$;

revoke all on function public.get_wedding_rsvp_dashboard(text, text, text) from public;
grant execute on function public.get_wedding_rsvp_dashboard(text, text, text) to anon, authenticated;

-- Initial temporary credentials for this wedding. Run this again with a new
-- password whenever the owner requests a password change.
select public.configure_wedding_owner(
  'paola-and-ryan',
  'p-and-r',
  'p-and-r-Password'
);

