-- Migration: Add Role, Inventory Credit, and Personal & Bank KYC to Therapists
-- Run this in Supabase SQL Editor if separate columns are desired

ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'therapist',
  ADD COLUMN IF NOT EXISTS inventory_credit NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
  ADD COLUMN IF NOT EXISTS medical_reg_no TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS ifsc_code TEXT,
  ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Enforce minimum withdrawal constraint on payout requests (minimum 3000)
ALTER TABLE public.payout_requests
  ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'session_payout';

COMMENT ON COLUMN public.therapists.role IS 'Practitioner role: doctor | therapist | intern';
COMMENT ON COLUMN public.therapists.inventory_credit IS 'Non-withdrawable welcome credit for doctors (eStore use only)';
