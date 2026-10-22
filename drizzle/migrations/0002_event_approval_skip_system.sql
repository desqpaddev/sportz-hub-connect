CREATE OR REPLACE FUNCTION public.enforce_event_approval()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.approval_status := 'pending';
    NEW.created_by := auth.uid();
    NEW.featured := false;
  ELSE
    NEW.approval_status := 'pending';
    NEW.created_by := OLD.created_by;
  END IF;
  RETURN NEW;
END $function$;