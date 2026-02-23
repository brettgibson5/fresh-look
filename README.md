# Fresh Look

Fresh Look is a Next.js + Supabase app with role-based dashboard access for a packing/growers workforce.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Add `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> `SUPABASE_SERVICE_ROLE_KEY` is required for admin operations (invite, delete, ban users). Get it from Supabase dashboard → Project Settings → API → service_role secret.

3. Apply SQL migrations in order in the Supabase SQL editor:

```
supabase/migrations/20260220_auth_roles.sql
supabase/migrations/20260221_phase2_mvp.sql
supabase/migrations/20260221_settings_profile.sql
supabase/migrations/20260221_progress_tracker_state.sql
supabase/migrations/20260221_progress_tracker_hardening.sql
supabase/migrations/20260222_first_last_name.sql
```

Migration summary:

| File | Description |
|---|---|
| `20260220_auth_roles.sql` | Role enum, `public.profiles` table, auth/role RLS baseline |
| `20260221_phase2_mvp.sql` | `work_items` + `inspections` workflow tables and policies |
| `20260221_settings_profile.sql` | `avatar_url` profile field + avatar storage bucket/policies |
| `20260221_progress_tracker_state.sql` | Public singleton row for `/progress` checklist state persistence |
| `20260221_progress_tracker_hardening.sql` | Constrains progress payload to JSON object shape |
| `20260222_first_last_name.sql` | Splits `full_name` into `first_name` + `last_name` on `profiles` |

4. Start app:

```bash
npm run dev
```

## Auth + routing

- `/login` — email/password sign-in, redirects to role home on success
- `/growers` — growers icon grid
- `/packing-employee` — packing employee icon grid
- `/management` — redirects to `/growers` (management sees growers view by default)
- `/admin` — admin icon grid
- `/admin/users` — user management table
- `/settings` — shared settings page (all roles)
- `/sanitation` — sanitation role home

Proxy (`proxy.ts`) protects all role routes and redirects unauthenticated users to `/login?next=<path>`.

## Roles

| Role | Home | Tab nav |
|---|---|---|
| `growers` | `/growers` | None |
| `packing_employee` | `/packing-employee` | None |
| `management` | `/growers` | Growers, Packing Employee, Settings |
| `sanitation` | `/sanitation` | None |
| `admin` | `/admin` | Growers, Packing Employee, Admin, Settings |

## `public.profiles` schema

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, references `auth.users.id` on delete cascade |
| `role` | `user_role` enum | `growers`, `packing_employee`, `management`, `sanitation`, `admin` |
| `first_name` | `text` | Optional |
| `last_name` | `text` | Optional |
| `email` | `text` | Synced from auth.users |
| `avatar_url` | `text` | Optional profile photo URL |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto |

RLS policies allow users to read/update their own profile; admin role can manage all profiles. Role changes are also enforced by a DB trigger (`prevent_non_admin_role_change`).

## Admin user management (`/admin/users`)

Requires `SUPABASE_SERVICE_ROLE_KEY`. Features:

- Invite user by email (sends Supabase invite email)
- Edit first/last name and email
- Change role (inline dropdown)
- Send password reset email
- Ban / unban (disables login without deleting)
- Delete user (cascades to profile)
- Search by email or name
- Last sign-in date and Active/Banned status badge
