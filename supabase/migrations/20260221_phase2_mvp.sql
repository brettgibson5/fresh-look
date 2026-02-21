alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and public.current_role() <> 'admin' then
    raise exception 'Only admin can change roles';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_role_change on public.profiles;

create trigger prevent_non_admin_role_change
before update on public.profiles
for each row
execute function public.prevent_non_admin_role_change();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create type public.work_item_status as enum (
  'pending',
  'passed',
  'failed'
);

create type public.inspection_result as enum (
  'pass',
  'fail'
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  grower_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  lot_code text not null,
  notes text,
  status public.work_item_status not null default 'pending',
  qc_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null unique references public.work_items(id) on delete cascade,
  qc_user_id uuid not null references auth.users(id) on delete cascade,
  result public.inspection_result not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.work_items enable row level security;
alter table public.inspections enable row level security;

drop trigger if exists set_work_items_updated_at on public.work_items;

create trigger set_work_items_updated_at
before update on public.work_items
for each row
execute function public.set_updated_at();

drop policy if exists "work_items_select_by_role" on public.work_items;
create policy "work_items_select_by_role"
on public.work_items
for select
to authenticated
using (
  grower_id = auth.uid()
  or public.current_role() in ('quality_control', 'management', 'admin')
);

drop policy if exists "work_items_insert_by_role" on public.work_items;
create policy "work_items_insert_by_role"
on public.work_items
for insert
to authenticated
with check (
  (public.current_role() = 'growers' and grower_id = auth.uid())
  or public.current_role() = 'admin'
);

drop policy if exists "work_items_update_by_role" on public.work_items;
create policy "work_items_update_by_role"
on public.work_items
for update
to authenticated
using (
  (public.current_role() = 'growers' and grower_id = auth.uid())
  or public.current_role() in ('quality_control', 'admin')
)
with check (
  (public.current_role() = 'growers' and grower_id = auth.uid())
  or public.current_role() in ('quality_control', 'admin')
);

drop policy if exists "inspections_select_by_role" on public.inspections;
create policy "inspections_select_by_role"
on public.inspections
for select
to authenticated
using (
  public.current_role() in ('quality_control', 'management', 'admin')
  or exists (
    select 1
    from public.work_items wi
    where wi.id = inspections.work_item_id
      and wi.grower_id = auth.uid()
  )
);

drop policy if exists "inspections_insert_by_role" on public.inspections;
create policy "inspections_insert_by_role"
on public.inspections
for insert
to authenticated
with check (
  public.current_role() in ('quality_control', 'admin')
  and (qc_user_id = auth.uid() or public.current_role() = 'admin')
);
