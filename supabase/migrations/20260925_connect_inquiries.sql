-- Migration: Create Connect With Us / Business Inquiries Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.connect_inquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  organization TEXT,
  message TEXT NOT NULL,
  preferred_contact_method TEXT DEFAULT 'WhatsApp' NOT NULL,
  status TEXT DEFAULT 'New' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  admin_notes TEXT
);

-- Enable RLS
ALTER TABLE public.connect_inquiries ENABLE ROW LEVEL SECURITY;

-- Idempotent Policies
DROP POLICY IF EXISTS "Allow public read connect_inquiries" ON public.connect_inquiries;
DROP POLICY IF EXISTS "Allow all write connect_inquiries" ON public.connect_inquiries;

CREATE POLICY "Allow public read connect_inquiries" ON public.connect_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow all write connect_inquiries" ON public.connect_inquiries FOR ALL USING (true);

-- Safely add to Realtime Publication without locking other tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'connect_inquiries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connect_inquiries;
  END IF;
END $$;
