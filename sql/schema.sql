-- sql/schema.sql
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  region_type text not null,
  emoji_flag text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_destinations_name on destinations(name);
create index if not exists idx_destinations_region on destinations(region_type);
create index if not exists idx_destinations_payload_gin on destinations using gin (payload jsonb_path_ops);
create index if not exists idx_destinations_name_trgm on destinations using gin (name gin_trgm_ops);
