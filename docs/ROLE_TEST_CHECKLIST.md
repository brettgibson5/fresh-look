# Role Test Checklist

Use this checklist after schema changes, auth changes, or dashboard updates.

## 0) Preconditions

- `.env.local` has valid Supabase values.
- SQL migrations applied in order:
  - `supabase/migrations/20260220_auth_roles.sql`
  - `supabase/migrations/20260221_phase2_mvp.sql`
- Test users exist for each role:
  - `growers`
  - `quality_control`
  - `management`
  - `sanitation`
  - `admin`

## 1) Auth + route guard

- Open `/dashboard` while signed out → redirected to `/login`.
- Sign in as any role → `/dashboard` redirects to that role route.
- While signed in, open `/login` → redirected to `/dashboard`.

## 1.1) Page access matrix

- `admin` can open all pages:
  - `/dashboard/admin`
  - `/dashboard/growers`
  - `/dashboard/quality-control`
  - `/dashboard/management`
  - `/dashboard/sanitation`
- `management` can open all pages except admin:
  - allowed: `/dashboard/growers`, `/dashboard/quality-control`, `/dashboard/management`, `/dashboard/sanitation`
  - denied/redirected: `/dashboard/admin`
- Non-admin/non-management roles only access their own route.

## 2) Admin checks (`/dashboard/admin`)

- Admin can see profile list with email + current role.
- Admin can change another user role and save.
- Re-sign in as changed user and verify landing route matches new role.

## 3) Growers checks (`/dashboard/growers`)

- Can create a work item (title + lot code required).
- Can edit only pending items.
- Once item is inspected (passed/failed), edit controls are disabled.

## 4) Quality Control checks (`/dashboard/quality-control`)

- Pending items are visible in queue.
- Submitting `pass` updates item status to `passed`.
- Submitting `fail` updates item status to `failed`.
- Same item cannot be inspected twice (unique `inspections.work_item_id`).

## 5) Management checks (`/dashboard/management`)

- KPI cards load (total, pending, passed, pass rate).
- Recent items list shows latest statuses.
- QC decisions are reflected after refresh.

## 6) Cross-role authorization

- Growers cannot access `/dashboard/admin` or `/dashboard/quality-control`.
- QC cannot update user roles.
- Management cannot access `/dashboard/admin`.
- Management is read-only on growers/QC pages (no create/update/inspection actions).
- Admin can access every page and perform role/QC/admin actions.

## 7) SQL spot-checks

Run in Supabase SQL editor:

```sql
select role, count(*)
from public.profiles
group by role
order by role;

select status, count(*)
from public.work_items
group by status
order by status;
```

## 8) Done criteria

- All role-route checks pass.
- No unexpected permission leaks.
- Dashboard data stays consistent after role/action changes.
