-- ═══════════════════════════════════════════════════════════
-- Do, Doing, Done — Waltham
-- Database Schema for Supabase
-- Run this in your Supabase SQL Editor (supabase.com → SQL)
-- ═══════════════════════════════════════════════════════════

-- Tickets table: every resident report becomes a row here
create table if not exists tickets (
  id            text primary key,              -- DDW-260407-3821 format
  category_id   text not null,                 -- pothole, streetlight, water, etc.
  head_id       text not null,                 -- chiasson, kelly, bower, hebert
  division      text not null,                 -- Street Division, Wires, etc.
  status        text not null default 'new',   -- new → assigned → on_site → resolved
  urgent        boolean default false,

  -- Location
  address       text not null,
  latitude      double precision,
  longitude     double precision,

  -- Details
  description   text,
  photo_urls    text[] default '{}',           -- array of storage URLs
  resolve_photo text,                          -- completion photo URL

  -- Reporter (anonymous by default — no login required)
  reporter_email text,
  reporter_phone text,

  -- Timestamps
  created_at    timestamptz default now(),
  assigned_at   timestamptz,
  resolved_at   timestamptz,
  archived_at   timestamptz,

  -- Staff
  assigned_to   text                           -- future: junior staff name
);

-- Index for fast dashboard queries
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_tickets_head on tickets(head_id);
create index if not exists idx_tickets_created on tickets(created_at desc);

-- Enable Row Level Security
alter table tickets enable row level security;

-- Public can insert (submit reports) and read their own tickets
create policy "Anyone can submit a report"
  on tickets for insert
  with check (true);

create policy "Anyone can view tickets"
  on tickets for select
  using (true);

-- Staff can update ticket status (we'll tighten this with auth later)
create policy "Staff can update tickets"
  on tickets for update
  using (true);

-- ─── Auto-Archive Function ─────────────────────────────────
-- Marks resolved tickets as archived after 48 hours
-- Run via Supabase CRON or Edge Function on a schedule

create or replace function archive_old_tickets()
returns void as $$
begin
  update tickets
  set archived_at = now(), status = 'archived'
  where status = 'resolved'
    and resolved_at < now() - interval '48 hours'
    and archived_at is null;
end;
$$ language plpgsql;

-- ─── Storage Bucket ────────────────────────────────────────
-- Create a 'ticket-photos' bucket in Supabase Storage (do this in the UI)
-- Set it to public so photos can be displayed without auth
