create table if not exists public.progress_tracker_state (
  id text primary key check (id = 'default'),
  checked jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.progress_tracker_state enable row level security;

grant select, insert, update on public.progress_tracker_state to anon, authenticated;

drop trigger if exists set_progress_tracker_state_updated_at on public.progress_tracker_state;

create trigger set_progress_tracker_state_updated_at
before update on public.progress_tracker_state
for each row
execute function public.set_updated_at();

drop policy if exists "progress_tracker_select_public" on public.progress_tracker_state;
create policy "progress_tracker_select_public"
on public.progress_tracker_state
for select
to anon, authenticated
using (id = 'default');

drop policy if exists "progress_tracker_insert_public" on public.progress_tracker_state;
create policy "progress_tracker_insert_public"
on public.progress_tracker_state
for insert
to anon, authenticated
with check (id = 'default');

drop policy if exists "progress_tracker_update_public" on public.progress_tracker_state;
create policy "progress_tracker_update_public"
on public.progress_tracker_state
for update
to anon, authenticated
using (id = 'default')
with check (id = 'default');

insert into public.progress_tracker_state (id)
values ('default')
on conflict (id) do nothing;
