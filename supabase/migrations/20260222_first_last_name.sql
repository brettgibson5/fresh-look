alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text;

update public.profiles
  set first_name = split_part(full_name, ' ', 1),
      last_name  = nullif(trim(substring(full_name from position(' ' in full_name))), '')
  where full_name is not null;

alter table public.profiles drop column if exists full_name;
