-- Create 'practice_results' table to store Voice and Vocal (Verbal/Listening) practice scores
create table if not exists public.practice_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  practice_type text not null, -- 'listening', 'verbal', 'voice', etc.
  score integer not null default 0,
  accuracy integer, -- Optional, percentage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.practice_results enable row level security;

-- Policies
create policy "Allow public read-write access to practice_results"
on public.practice_results
for all
using (true)
with check (true);
