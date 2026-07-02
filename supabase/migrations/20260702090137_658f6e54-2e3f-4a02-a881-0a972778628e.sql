
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
  ADD COLUMN IF NOT EXISTS emergency_contact_relation text,
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS medical_conditions text,
  ADD COLUMN IF NOT EXISTS tshirt_size text,
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS profile_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS id_document_type text,
  ADD COLUMN IF NOT EXISTS id_document_number text,
  ADD COLUMN IF NOT EXISTS id_document_url text,
  ADD COLUMN IF NOT EXISTS selfie_url text,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_provider text,
  ADD COLUMN IF NOT EXISTS verification_transaction_id text,
  ADD COLUMN IF NOT EXISTS verification_result jsonb,
  ADD COLUMN IF NOT EXISTS verification_notes text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

DROP POLICY IF EXISTS "Users can upload their KYC docs" ON storage.objects;
CREATE POLICY "Users can upload their KYC docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read their KYC docs" ON storage.objects;
CREATE POLICY "Users can read their KYC docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'kyc-documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role)));

DROP POLICY IF EXISTS "Users can update their KYC docs" ON storage.objects;
CREATE POLICY "Users can update their KYC docs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
