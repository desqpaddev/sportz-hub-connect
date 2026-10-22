ALTER TABLE public.events ADD COLUMN IF NOT EXISTS requires_eligibility boolean NOT NULL DEFAULT false;
UPDATE public.events SET requires_eligibility = true WHERE title ILIKE '%swimathon%' OR title ILIKE '%swimmathon%';

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS eligibility_status text NOT NULL DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS eligibility_certificate_url text,
  ADD COLUMN IF NOT EXISTS eligibility_notes text,
  ADD COLUMN IF NOT EXISTS pat_slot_id uuid,
  ADD COLUMN IF NOT EXISTS pat_payment_status text NOT NULL DEFAULT 'unpaid';

CREATE TABLE public.pat_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  venue text NOT NULL DEFAULT '',
  fee integer NOT NULL DEFAULT 0,
  capacity integer NOT NULL DEFAULT 20,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pat_slots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pat_slots TO authenticated;
GRANT ALL ON public.pat_slots TO service_role;
ALTER TABLE public.pat_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "PAT slots viewable by everyone" ON public.pat_slots FOR SELECT USING (true);
CREATE POLICY "Admins manage PAT slots" ON public.pat_slots FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_pat_slot_booked(_slot_id uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::int FROM public.registrations WHERE pat_slot_id = _slot_id AND pat_payment_status = 'paid'
$$;

CREATE OR REPLACE FUNCTION public.submit_eligibility_certificate(_reg_id uuid, _url text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.registrations SET eligibility_certificate_url = _url, eligibility_status = 'certificate_submitted', eligibility_notes = NULL
  WHERE id = _reg_id AND user_id = auth.uid() AND eligibility_status IN ('pending','certificate_submitted','rejected');
  IF NOT FOUND THEN RAISE EXCEPTION 'Registration not found or not editable'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.select_pat_slot(_reg_id uuid, _slot_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.pat_slots;
BEGIN
  SELECT * INTO s FROM public.pat_slots WHERE id = _slot_id AND is_active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Slot not available'; END IF;
  IF public.get_pat_slot_booked(_slot_id) >= s.capacity THEN RAISE EXCEPTION 'Slot is full'; END IF;
  UPDATE public.registrations SET pat_slot_id = _slot_id
  WHERE id = _reg_id AND user_id = auth.uid() AND event_id = s.event_id AND pat_payment_status <> 'paid'
    AND eligibility_status IN ('pending','rejected','certificate_submitted');
  IF NOT FOUND THEN RAISE EXCEPTION 'Registration not found or not editable'; END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.get_pat_slot_booked(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_eligibility_certificate(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.select_pat_slot(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_registration_eligibility()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.events WHERE id = NEW.event_id AND requires_eligibility) THEN
    NEW.eligibility_status := 'pending';
  ELSE
    NEW.eligibility_status := 'not_required';
  END IF;
  NEW.pat_payment_status := 'unpaid';
  RETURN NEW;
END $$;
CREATE TRIGGER registrations_set_eligibility BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_registration_eligibility();

CREATE POLICY "Users upload own eligibility certs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'eligibility-certificates' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own eligibility certs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'eligibility-certificates' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));