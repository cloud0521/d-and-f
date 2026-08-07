# Paola & Ryan — Digital Wedding Invitation

A reusable React, Vite, Tailwind CSS, Framer Motion, and Supabase wedding experience crafted by DreamZ.

## Local development

```powershell
npm install
npm run dev
```

The npm scripts invoke their local Node entry points directly so they continue
working on Windows when a parent folder contains an ampersand (`&`).

## Production checks

```powershell
npm run lint
npm run build
npm run preview
```

## One Supabase project for every wedding

All client weddings share one Supabase project. Tenant isolation is enforced by
`wedding_id`, tenant-scoped database functions, and Row Level Security. Each deployment uses the
same project URL and publishable key; only `VITE_WEDDING_SLUG` changes.

### One-time project setup

1. Open the Supabase SQL editor for the shared project.
2. Run `supabase/migrations/20260807_multi_tenant_weddings.sql` in full.
3. Run `supabase/migrations/20260808_username_dashboard.sql` in full. This
   creates Paola and Ryan's initial tenant-scoped dashboard credentials:

```text
Invitation ID: p-and-r
Password: p-and-r-Password
```

Use the temporary password only during setup and replace it before sharing the
dashboard credentials with a client.

### Deployment environment

Copy `.env.example` to `.env.local` and configure:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
VITE_WEDDING_SLUG=paola-and-ryan
```

The publishable key is allowed in the frontend. Never place a Supabase secret or
service-role key in a `VITE_` variable, source file, deployment bundle, or client
website.

### Adding another client wedding

Create one tenant row:

```sql
insert into public.weddings (
  slug,
  couple_names,
  wedding_date,
  template_id,
  status
) values (
  'client-one-and-client-two',
  'Client One & Client Two',
  '2028-01-15T15:00:00+08:00',
  'elegant-floral',
  'active'
);
```

Configure that wedding's dashboard ID and password:

```sql
select public.configure_wedding_owner(
  'client-one-and-client-two',
  'client-one-and-client-two',
  'replace-with-a-strong-temporary-password'
);
```

Then deploy the template with that client's slug:

```env
VITE_WEDDING_SLUG=client-one-and-client-two
```

The dashboard function verifies the password hash and returns RSVPs only for the
wedding attached to that invitation ID. Public guests cannot insert directly
into the RSVP table; they can only call the validated `submit_wedding_rsvp`
function for an active wedding slug.

### Changing an owner password

Run the configuration function again. It replaces the stored bcrypt hash without
exposing the existing password:

```sql
select public.configure_wedding_owner(
  'paola-and-ryan',
  'p-and-r',
  'the-new-password-requested-by-the-owner'
);
```

### Existing single-wedding RSVP rows

The multi-tenant migration preserves old rows but leaves their `wedding_id`
empty because it cannot safely guess ownership. If all legacy rows belong to
Paola and Ryan, backfill them once:

```sql
update public.rsvp_submissions submission
set wedding_id = wedding.id
from public.weddings wedding
where wedding.slug = 'paola-and-ryan'
  and submission.wedding_id is null;
```

## Wedding content

The canonical content is in `src/data/weddings/paola-ryan.ts`. Update the couple,
schedule, locations, dress code, gifts, RSVP deadline, FAQs, and brand signature
there. The deployment slug must match the corresponding `public.weddings.slug`.
"# p-and-r" 
