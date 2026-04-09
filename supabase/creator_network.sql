create extension if not exists pgcrypto;

create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  creator_name text not null default '',
  contact_name text not null default '',
  email text not null default '',
  whatsapp text not null default '',
  location text not null default '',
  languages text not null default '',
  primary_platform text not null default '',
  instagram_url text not null default '',
  tiktok_url text not null default '',
  youtube_url text not null default '',
  threads_url text not null default '',
  xiaohongshu_url text not null default '',
  other_links text not null default '',
  content_categories text not null default '',
  content_formats text not null default '',
  audience_regions text not null default '',
  audience_age_groups text not null default '',
  has_brand_collabs text not null default '',
  has_conversion_campaigns text not null default '',
  usual_reel_rate text not null default '',
  usual_post_rate text not null default '',
  usual_story_rate text not null default '',
  available_regions text not null default '',
  turnaround_days text not null default '',
  top_content_links text not null default '',
  analytics_notes text not null default '',
  analytics_drive_links text not null default '',
  selected_plan text not null default 'creator-core',
  plan_payment_status text not null default 'not_required',
  plan_payment_session_id text not null default '',
  stripe_customer_email text not null default '',
  plan_paid_at timestamptz,
  ai_analysis jsonb not null default '{}'::jsonb,
  review_status text not null default 'new',
  internal_notes text not null default '',
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.creator_applications enable row level security;

drop policy if exists "Anyone can insert creator applications" on public.creator_applications;

create policy "Anyone can insert creator applications"
on public.creator_applications
for insert
to anon, authenticated
with check (true);

create table if not exists public.creator_usage_ledger (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.creator_applications(id) on delete cascade,
  tool_slug text not null default '',
  credits_used integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.creator_usage_ledger enable row level security;
