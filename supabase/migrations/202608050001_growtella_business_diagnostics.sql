create table if not exists public.business_diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  context jsonb not null check (jsonb_typeof(context) = 'object'),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  scores jsonb not null check (jsonb_typeof(scores) = 'object'),
  financials jsonb not null check (jsonb_typeof(financials) = 'object'),
  action_plan jsonb not null check (jsonb_typeof(action_plan) = 'array'),
  overall_score smallint not null check (overall_score between 0 and 100),
  maturity_title text not null,
  application_version smallint not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_diagnostics_user_created_idx
  on public.business_diagnostics (user_id, created_at desc);

alter table public.business_diagnostics enable row level security;

revoke all on public.business_diagnostics from anon;
grant select, insert, update, delete on public.business_diagnostics to authenticated;

drop policy if exists "Users can read their own business diagnostics" on public.business_diagnostics;
create policy "Users can read their own business diagnostics"
  on public.business_diagnostics
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own business diagnostics" on public.business_diagnostics;
create policy "Users can create their own business diagnostics"
  on public.business_diagnostics
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own business diagnostics" on public.business_diagnostics;
create policy "Users can update their own business diagnostics"
  on public.business_diagnostics
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own business diagnostics" on public.business_diagnostics;
create policy "Users can delete their own business diagnostics"
  on public.business_diagnostics
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_business_diagnostics_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists business_diagnostics_set_updated_at on public.business_diagnostics;
create trigger business_diagnostics_set_updated_at
before update on public.business_diagnostics
for each row execute function public.set_business_diagnostics_updated_at();

comment on table public.business_diagnostics is
  'Diagnósticos estratégicos de Growtella. Cada usuario solo puede administrar sus propios informes mediante RLS.';
