-- Run this in your Supabase SQL Editor

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'IN';

-- Verify the column was added
-- SELECT * FROM public.users LIMIT 1;
