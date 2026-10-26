-- Migration: Updated Practitioner Roles & Nomenclature
-- Captures the 3 distinct roles:
-- 1. spa_therapist (Spa & Wellness Specialist / Masseuse / Masseur)
-- 2. physiotherapist (Licensed Doctor of Physiotherapy - uses "Dr." prefix)
-- 3. intern (Physiotherapy Intern - uses "(intern)" suffix)

-- 1. Ensure role and profile columns exist on therapists table
ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'spa_therapist',
  ADD COLUMN IF NOT EXISTS inventory_credit NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
  ADD COLUMN IF NOT EXISTS medical_reg_no TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS ifsc_code TEXT,
  ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS bio TEXT;

COMMENT ON COLUMN public.therapists.role IS 'Practitioner role: spa_therapist | physiotherapist | intern (with legacy support for doctor and therapist)';
COMMENT ON COLUMN public.therapists.inventory_credit IS 'Non-withdrawable welcome credit for doctors/interns (eStore use only)';

-- 2. Update existing therapist records to standard roles
UPDATE public.therapists
SET role = 'physiotherapist'
WHERE role = 'doctor';

UPDATE public.therapists
SET role = 'spa_therapist'
WHERE role = 'therapist' OR role IS NULL;
