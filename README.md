# Stefano & Mhyka — Digital Wedding Invitation

A React, Vite, Tailwind CSS, Framer Motion, and Supabase wedding experience crafted by DreamZ.

## Local development

```powershell
npm install
npm run dev
```

The npm scripts invoke their local Node entry points directly. This keeps them
working on Windows even when a parent folder contains an ampersand (`&`).

## Production checks

```powershell
npm run lint
npm run build
npm run preview
```

## Supabase setup

1. Create a Supabase project.
2. For a new database, run `supabase/migrations/20260806_create_rsvp_dashboard.sql` in the SQL editor. If the RSVP tables already exist, run `supabase/migrations/20260806_add_secure_admin_configuration.sql` instead.
3. In the SQL editor, configure a unique administrator password of at least 12 characters:

```sql
select public.configure_invitation_admin('replace-with-a-long-unique-password'::text);
```

4. Copy `.env.example` to `.env.local` and provide the project URL and publishable key.
5. Never commit `.env.local` or the administrator password.

Guests can only insert RSVP records. The dashboard read operation validates the
administrator password inside a security-definer database function; raw password
values are never stored.

## Wedding content

The canonical wedding data is in `src/data/weddings/stefano-mhyka.ts`. Update the
couple, schedule, locations, dress code, gifts, RSVP deadline, FAQs, and brand
signature there rather than duplicating content in components.
