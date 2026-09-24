-- PamWill Luxury Massage Marketplace - Supabase PostgreSQL Schema

-- 1. Services Table (All 69 Therapies & Custom Additions)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  contraindications JSONB DEFAULT '[]'::jsonb,
  duration_options_min JSONB DEFAULT '[]'::jsonb,
  base_price_per_duration JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  popular_tag TEXT,
  add_on_compatible BOOLEAN DEFAULT true,
  requires_certification TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Therapists Table (Providers, Credentials, Verification Gate)
CREATE TABLE IF NOT EXISTS public.therapists (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'Under Review',
  gender TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  languages JSONB DEFAULT '[]'::jsonb,
  available_cities JSONB DEFAULT '[]'::jsonb,
  working_hours TEXT,
  is_online BOOLEAN DEFAULT false,
  wallet_balance NUMERIC DEFAULT 0,
  bank_account TEXT,
  upi_id TEXT,
  certifications JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  current_location JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bookings Table (Active, Completed, Cancelled & Real-time GPS/SOS)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  therapist_id TEXT,
  therapist_name TEXT,
  therapist_photo TEXT,
  therapist_rating NUMERIC,
  therapist_phone TEXT,
  service JSONB NOT NULL,
  duration_min INTEGER NOT NULL,
  add_ons JSONB DEFAULT '[]'::jsonb,
  therapist_gender_pref TEXT,
  scheduled_date TEXT,
  scheduled_time TEXT,
  location_type TEXT,
  address TEXT,
  city TEXT,
  special_notes TEXT,
  base_price NUMERIC NOT NULL,
  add_ons_price NUMERIC DEFAULT 0,
  coupon_discount NUMERIC DEFAULT 0,
  membership_discount NUMERIC DEFAULT 0,
  total_paid NUMERIC NOT NULL,
  platform_commission NUMERIC NOT NULL,
  therapist_payout NUMERIC NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  eta_minutes INTEGER,
  sos_triggered BOOLEAN DEFAULT false,
  review JSONB,
  start_otp TEXT,
  end_otp TEXT,
  session_started_at TIMESTAMPTZ,
  session_completed_at TIMESTAMPTZ
);

-- 4. Users Table (Patron Profiles, Memberships & Health Notes)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  gender TEXT,
  age INTEGER,
  address TEXT,
  city TEXT,
  medical_conditions JSONB DEFAULT '[]'::jsonb,
  preferred_therapist_gender TEXT,
  emergency_contact JSONB,
  membership_tier TEXT,
  membership_credits INTEGER DEFAULT 0,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drop existing policies if re-running script to avoid duplicate policy errors
DROP POLICY IF EXISTS "Allow public read services" ON public.services;
DROP POLICY IF EXISTS "Allow all write services" ON public.services;
DROP POLICY IF EXISTS "Allow public read therapists" ON public.therapists;
DROP POLICY IF EXISTS "Allow all write therapists" ON public.therapists;
DROP POLICY IF EXISTS "Allow public read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all write bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
DROP POLICY IF EXISTS "Allow all write users" ON public.users;

-- Enable RLS and create permissive policies for marketplace operations
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow all write services" ON public.services FOR ALL USING (true);

CREATE POLICY "Allow public read therapists" ON public.therapists FOR SELECT USING (true);
CREATE POLICY "Allow all write therapists" ON public.therapists FOR ALL USING (true);

CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow all write bookings" ON public.bookings FOR ALL USING (true);

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow all write users" ON public.users FOR ALL USING (true);

-- 5. Payout Requests Table (Doctor / Therapist UPI Withdrawals)
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id TEXT PRIMARY KEY,
  therapist_id TEXT NOT NULL,
  therapist_name TEXT NOT NULL,
  therapist_photo TEXT,
  therapist_phone TEXT,
  upi_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at TIMESTAMPTZ,
  transaction_ref TEXT,
  notes TEXT
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read payout_requests" ON public.payout_requests;
DROP POLICY IF EXISTS "Allow all write payout_requests" ON public.payout_requests;
CREATE POLICY "Allow public read payout_requests" ON public.payout_requests FOR SELECT USING (true);
CREATE POLICY "Allow all write payout_requests" ON public.payout_requests FOR ALL USING (true);

-- 6. Training & Internship Applications Table
CREATE TABLE IF NOT EXISTS public.training_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  program_type TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  availability TEXT NOT NULL,
  qualification TEXT,
  statement TEXT,
  status TEXT DEFAULT 'Pending' NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  admin_notes TEXT
);

ALTER TABLE public.training_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read training_applications" ON public.training_applications;
DROP POLICY IF EXISTS "Allow all write training_applications" ON public.training_applications;
CREATE POLICY "Allow public read training_applications" ON public.training_applications FOR SELECT USING (true);
CREATE POLICY "Allow all write training_applications" ON public.training_applications FOR ALL USING (true);

-- 7. Connect With Us / Business Inquiries Table
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

ALTER TABLE public.connect_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read connect_inquiries" ON public.connect_inquiries;
DROP POLICY IF EXISTS "Allow all write connect_inquiries" ON public.connect_inquiries;
CREATE POLICY "Allow public read connect_inquiries" ON public.connect_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow all write connect_inquiries" ON public.connect_inquiries FOR ALL USING (true);

-- Enable Realtime Replication safely without deadlocks (only adds tables not already published)
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'services', 
    'therapists', 
    'bookings', 
    'users', 
    'payout_requests', 
    'training_applications', 
    'connect_inquiries'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = tbl
    ) THEN
      BEGIN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', tbl);
      EXCEPTION WHEN OTHERS THEN
        -- Ignore concurrent lock race or permission errors gracefully
        RAISE NOTICE 'Could not add % to supabase_realtime: %', tbl, SQLERRM;
      END;
    END IF;
  END LOOP;
END $$;


