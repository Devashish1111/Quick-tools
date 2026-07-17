-- Run this in your Supabase SQL Editor

CREATE TABLE public.short_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  short_code text NOT NULL UNIQUE,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read short links (for redirection)
CREATE POLICY "Allow public read access to short links"
  ON public.short_links FOR SELECT
  USING (true);

-- Allow anyone to insert (so anonymous users can use the tool)
CREATE POLICY "Allow public insert to short links"
  ON public.short_links FOR INSERT
  WITH CHECK (true);

-- Users can only update their own links
CREATE POLICY "Users can update their own links"
  ON public.short_links FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own links
CREATE POLICY "Users can delete their own links"
  ON public.short_links FOR DELETE
  USING (auth.uid() = user_id);
