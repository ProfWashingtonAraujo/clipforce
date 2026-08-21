create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  status text not null default 'Draft' check (status in ('Draft', 'Processing', 'Exported')),
  duration text not null default '00:00',
  ratio text not null default '9:16' check (ratio in ('9:16', '16:9', '1:1', '4:5')),
  thumbnail text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'Viewer' check (role in ('Editor', 'Viewer')),
  status text not null default 'Pending' check (status in ('Active', 'Pending')),
  created_at timestamptz not null default now(),
  unique (owner_id, email)
);

create index projects_user_updated_idx on public.projects(user_id, updated_at desc);
create index team_members_owner_idx on public.team_members(owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;

create policy "Users can view their profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can view their projects"
on public.projects for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their projects"
on public.projects for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their projects"
on public.projects for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their projects"
on public.projects for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Owners can view team members"
on public.team_members for select to authenticated
using ((select auth.uid()) = owner_id);

create policy "Owners can invite team members"
on public.team_members for insert to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Owners can update team members"
on public.team_members for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Owners can remove team members"
on public.team_members for delete to authenticated
using ((select auth.uid()) = owner_id);
