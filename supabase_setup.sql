-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create the 'users' table (IF NOT EXISTS)
-- (If you already ran the previous script, you can skip this block or it will just error harmlessly)
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  picture text,
  google_sub text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create 'test_results' table
create table if not exists public.test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  wpm integer not null,
  accuracy integer not null,
  error_count integer not null,
  time_duration integer not null, -- Duration of the test in seconds
  mode text, -- 'words', 'sentences', 'time', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.users enable row level security;
alter table public.test_results enable row level security;

-- 4. Policies
-- Allow public access (since we are handling auth manually for now)
create policy "Allow public read-write access to users"
on public.users
for all
using (true)
with check (true);

create policy "Allow public read-write access to test_results"
on public.test_results
for all
using (true)
with check (true);
