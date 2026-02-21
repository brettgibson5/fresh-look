# Fresh Look

Fresh Look is a Next.js + Supabase app with role-based dashboard access.

## Phase 1 scope

- Email/password login
- Single role per user
- Role source of truth in database (`public.profiles.role`)
- Protected dashboard routes for:
  - `growers`
  - `quality_control`
  - `management`
  - `sanitation`
  - `admin`

## Phase 2 scope (current)

- Admin role assignment in app
- Growers create and edit work items
- Quality control pass/fail inspections
- Management KPI summary and recent item view
- Sanitation intentionally deferred to Phase 3

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Add `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Apply SQL in Supabase SQL editor (in order):

- `supabase/migrations/20260220_auth_roles.sql`
- `supabase/migrations/20260221_phase2_mvp.sql`
- `supabase/migrations/20260221_settings_profile.sql`
- `supabase/migrations/20260221_progress_tracker_state.sql`
- `supabase/migrations/20260221_progress_tracker_hardening.sql`

Migration quick map:

- `20260220_auth_roles.sql`: role enum, `public.profiles`, auth/role RLS baseline.
- `20260221_phase2_mvp.sql`: `work_items` + `inspections` workflow tables and policies.
- `20260221_settings_profile.sql`: avatar profile field plus avatar storage bucket/policies.
- `20260221_progress_tracker_state.sql`: public singleton row for `/progress` checklist state persistence.
- `20260221_progress_tracker_hardening.sql`: constrains progress payload to JSON object shape.

4. Start app:

```bash
npm run dev
```

## Auth + routing

- `/login`: email/password sign-in
- `/dashboard`: redirects to role route
- `/dashboard/growers`
- `/dashboard/quality-control`
- `/dashboard/management`
- `/dashboard/sanitation`
- `/dashboard/admin`

Middleware protects `/dashboard/*` and redirects anonymous users to `/login`.

## Role model

`public.profiles` links to `auth.users` by user id.

- `id uuid` (PK, references `auth.users.id`)
- `role user_role` (enum)
- `full_name text`
- timestamps

RLS policies allow users to read/update their own profile and allow admin role to manage all profiles.

## Phase 2 tables

- `work_items`: grower submissions and QC status
- `inspections`: QC pass/fail records for submitted items

## QA checklist

- `docs/APP_QA_CHECKLIST.md`
