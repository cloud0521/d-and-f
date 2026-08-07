-- Open RSVP duplicate-review workflow.
-- Repeated names are never overwritten; they are flagged for private review.

drop index if exists public.rsvp_submissions_wedding_guest_unique_idx;

alter table public.rsvp_submissions
  add column if not exists normalized_full_name text,
  add column if not exists possible_duplicate boolean not null default false;

update public.rsvp_submissions
set normalized_full_name = lower(regexp_replace(btrim(full_name), '\s+', ' ', 'g'))
where normalized_full_name is null;

with duplicate_names as (
  select wedding_id, normalized_full_name
  from public.rsvp_submissions
  where wedding_id is not null
  group by wedding_id, normalized_full_name
  having count(*) > 1
)
update public.rsvp_submissions submission
set possible_duplicate = true
from duplicate_names duplicate
where submission.wedding_id = duplicate.wedding_id
  and submission.normalized_full_name = duplicate.normalized_full_name;

create index if not exists rsvp_submissions_wedding_normalized_name_idx
  on public.rsvp_submissions(wedding_id, normalized_full_name);

drop function if exists public.submit_wedding_rsvp(text, text, text, integer, text);
create function public.submit_wedding_rsvp(
  p_wedding_slug text,
  p_full_name text,
  p_attendance text,
  p_guest_count integer,
  p_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wedding_id uuid;
  v_submission_id uuid;
  v_normalized_full_name text;
  v_is_duplicate boolean;
begin
  if p_wedding_slug is null or char_length(p_wedding_slug) > 120 then raise exception 'Invalid wedding invitation'; end if;
  if p_full_name is null or char_length(btrim(p_full_name)) not between 1 and 160 then raise exception 'A valid guest name is required'; end if;
  if p_attendance not in ('yes', 'no') then raise exception 'Invalid attendance response'; end if;
  if p_guest_count not between 1 and 10 then raise exception 'Invalid guest count'; end if;
  if p_message is not null and char_length(p_message) > 2000 then raise exception 'Message is too long'; end if;

  select id into v_wedding_id from public.weddings
  where slug = lower(btrim(p_wedding_slug)) and status = 'active';
  if v_wedding_id is null then raise exception 'Wedding invitation is unavailable'; end if;

  v_normalized_full_name := lower(regexp_replace(btrim(p_full_name), '\s+', ' ', 'g'));
  select exists (
    select 1 from public.rsvp_submissions
    where wedding_id = v_wedding_id and normalized_full_name = v_normalized_full_name
  ) into v_is_duplicate;

  if v_is_duplicate then
    update public.rsvp_submissions set possible_duplicate = true
    where wedding_id = v_wedding_id and normalized_full_name = v_normalized_full_name;
  end if;

  insert into public.rsvp_submissions (wedding_id, full_name, normalized_full_name, attendance, guest_count, message, possible_duplicate)
  values (v_wedding_id, btrim(p_full_name), v_normalized_full_name, p_attendance, p_guest_count, nullif(btrim(p_message), ''), v_is_duplicate)
  returning id into v_submission_id;
  return jsonb_build_object('id', v_submission_id, 'possible_duplicate', v_is_duplicate);
end;
$$;

revoke all on function public.submit_wedding_rsvp(text, text, text, integer, text) from public;
grant execute on function public.submit_wedding_rsvp(text, text, text, integer, text) to anon, authenticated;

drop function if exists public.get_wedding_rsvp_dashboard(text, text, text);
create function public.get_wedding_rsvp_dashboard(p_wedding_slug text, p_username text, p_password text)
returns table (id uuid, full_name text, attendance text, guest_count integer, message text, created_at timestamptz, possible_duplicate boolean)
language plpgsql security definer set search_path = '' as $$
declare v_wedding_id uuid;
begin
  select wedding.id into v_wedding_id from public.weddings wedding
  join public.wedding_owner_credentials credential on credential.wedding_id = wedding.id
  where wedding.slug = lower(btrim(p_wedding_slug))
    and credential.username = lower(btrim(p_username))
    and credential.password_hash = extensions.crypt(p_password, credential.password_hash)
    and wedding.status in ('active', 'archived');
  if v_wedding_id is null then raise exception 'Invalid dashboard credentials'; end if;
  return query select submission.id, submission.full_name, submission.attendance, submission.guest_count,
    submission.message, submission.created_at, submission.possible_duplicate
  from public.rsvp_submissions submission where submission.wedding_id = v_wedding_id
  order by submission.created_at desc;
end;
$$;
grant execute on function public.get_wedding_rsvp_dashboard(text, text, text) to anon, authenticated;

create or replace function public.manage_duplicate_rsvp(
  p_wedding_slug text, p_username text, p_password text, p_action text, p_submission_id uuid
)
returns void language plpgsql security definer set search_path = '' as $$
declare v_wedding_id uuid; v_normalized_name text;
begin
  select wedding.id into v_wedding_id from public.weddings wedding
  join public.wedding_owner_credentials credential on credential.wedding_id = wedding.id
  where wedding.slug = lower(btrim(p_wedding_slug))
    and credential.username = lower(btrim(p_username))
    and credential.password_hash = extensions.crypt(p_password, credential.password_hash);
  if v_wedding_id is null then raise exception 'Invalid dashboard credentials'; end if;
  select normalized_full_name into v_normalized_name from public.rsvp_submissions
  where id = p_submission_id and wedding_id = v_wedding_id;
  if v_normalized_name is null then raise exception 'Response not found'; end if;

  if p_action = 'keep' then
    delete from public.rsvp_submissions
    where wedding_id = v_wedding_id and normalized_full_name = v_normalized_name and id <> p_submission_id;
    update public.rsvp_submissions set possible_duplicate = false where id = p_submission_id;
  elsif p_action = 'remove' then
    delete from public.rsvp_submissions where id = p_submission_id and wedding_id = v_wedding_id;
    if (select count(*) from public.rsvp_submissions where wedding_id = v_wedding_id and normalized_full_name = v_normalized_name) <= 1 then
      update public.rsvp_submissions set possible_duplicate = false
      where wedding_id = v_wedding_id and normalized_full_name = v_normalized_name;
    end if;
  else
    raise exception 'Invalid duplicate action';
  end if;
end;
$$;
revoke all on function public.manage_duplicate_rsvp(text, text, text, text, uuid) from public;
grant execute on function public.manage_duplicate_rsvp(text, text, text, text, uuid) to anon, authenticated;
