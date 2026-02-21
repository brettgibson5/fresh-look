do $$
declare
  progress_table regclass;
begin
  progress_table := to_regclass('public.progress_tracker_state');

  if progress_table is null then
    return;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'progress_tracker_state_checked_object'
      and conrelid = progress_table
  ) then
    alter table public.progress_tracker_state
      add constraint progress_tracker_state_checked_object
      check (jsonb_typeof(checked) = 'object');
  end if;
end $$;
