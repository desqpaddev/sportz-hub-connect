ALTER TABLE public.events ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_phone text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_email text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE OR REPLACE FUNCTION public.enforce_event_approval()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.approval_status := 'pending';
      NEW.created_by := auth.uid();
      NEW.featured := false;
    ELSE
      NEW.approval_status := 'pending';
      NEW.created_by := OLD.created_by;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS events_enforce_approval ON public.events;
CREATE TRIGGER events_enforce_approval BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.enforce_event_approval();

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Approved events are viewable by everyone" ON public.events FOR SELECT
USING (approval_status = 'approved' OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Organisers can submit events" ON public.events FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Organisers can update own pending events" ON public.events FOR UPDATE TO authenticated
USING (auth.uid() = created_by AND approval_status <> 'approved');