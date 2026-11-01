-- Admin roles + invoice / quotation / payslip storage.
-- Run this in the Supabase SQL editor (or with `supabase db push`).

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user, carrying the admin role
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('super_admin', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_super_admin());

-- Inserts/updates/deletes happen only through the server (service role),
-- which bypasses RLS, so no write policies are defined here.

-- Every new auth user gets an 'admin' profile automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Documents: invoices, quotations and payslips
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('invoice', 'quotation', 'payslip')),
  number text not null,
  data jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, number)
);

create index if not exists documents_type_created_idx
  on public.documents (type, created_at desc);

alter table public.documents enable row level security;

drop policy if exists "documents_admin_all" on public.documents;
create policy "documents_admin_all" on public.documents
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_touch_updated_at on public.documents;
create trigger documents_touch_updated_at
  before update on public.documents
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Sequential numbering per type and year, e.g. INV-2026-0001
-- ---------------------------------------------------------------------------
create table if not exists public.document_counters (
  type text not null,
  year int not null,
  last_value int not null default 0,
  primary key (type, year)
);

alter table public.document_counters enable row level security;

create or replace function public.next_document_number(doc_type text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_year int := extract(year from now())::int;
  next_value int;
  prefix text;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  prefix := case doc_type
    when 'invoice' then 'INV'
    when 'quotation' then 'QUO'
    when 'payslip' then 'PAY'
    else null
  end;

  if prefix is null then
    raise exception 'unknown document type %', doc_type;
  end if;

  insert into public.document_counters (type, year, last_value)
  values (doc_type, current_year, 1)
  on conflict (type, year)
  do update set last_value = public.document_counters.last_value + 1
  returning last_value into next_value;

  return prefix || '-' || current_year || '-' || lpad(next_value::text, 4, '0');
end;
$$;

grant execute on function public.next_document_number(text) to authenticated;
