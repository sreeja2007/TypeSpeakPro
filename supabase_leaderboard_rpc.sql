-- Migration: add get_leaderboard RPC function
-- Replaces client-side deduplication in Leaderboard.tsx with a
-- database-level query that returns each user's best WPM score directly.
--
-- Previously: fetched top 100 raw rows then deduplicated in JavaScript —
-- users with many entries could be excluded if their best score fell
-- outside the top 100 window.
--
-- Now: DISTINCT ON (user_id) at DB level guarantees each user's true
-- personal best is returned regardless of total entry count.

CREATE OR REPLACE FUNCTION get_leaderboard(limit_count integer DEFAULT 50)
RETURNS TABLE (
    user_id uuid,
    wpm integer,
    accuracy integer,
    created_at timestamptz,
    name text,
    picture text,
    country text
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        tr.user_id,
        tr.wpm,
        tr.accuracy,
        tr.created_at,
        u.name,
        u.picture,
        u.country
    FROM (
        SELECT DISTINCT ON (user_id)
            user_id, wpm, accuracy, created_at
        FROM public.test_results
        ORDER BY user_id, wpm DESC
    ) tr
    JOIN public.users u ON u.id = tr.user_id
    ORDER BY tr.wpm DESC
    LIMIT limit_count;
$$;