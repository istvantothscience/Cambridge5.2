-- Supabase Database Schema for Cambridge Primary Science Point Tracker
-- Run this SQL in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Table for synchronized lesson sessions (slides & locks)
CREATE TABLE IF NOT EXISTS public.lesson_sessions (
  session_id TEXT PRIMARY KEY,
  current_slide_index INTEGER DEFAULT 0 NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE NOT NULL,
  total_slides INTEGER DEFAULT 10 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for student scores & answers
CREATE TABLE IF NOT EXISTS public.student_scores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🌱',
  points INTEGER DEFAULT 0 NOT NULL,
  lesson_points INTEGER DEFAULT 0 NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) and allow public read/write for class sessions
ALTER TABLE public.lesson_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write access to lesson_sessions"
ON public.lesson_sessions
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read/write access to student_scores"
ON public.student_scores
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Enable Supabase Realtime publication for instant synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_scores;

-- 5. Seed initial default session
INSERT INTO public.lesson_sessions (session_id, current_slide_index, is_locked, total_slides)
VALUES ('cambridge-sci-stage5-l2', 0, false, 10)
ON CONFLICT (session_id) DO NOTHING;
