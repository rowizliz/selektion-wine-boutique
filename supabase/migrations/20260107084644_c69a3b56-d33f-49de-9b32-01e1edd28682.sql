-- Link an existing collaborator row to the currently authenticated user (Google/email login)
-- This avoids relying on client-side UPDATE permissions.

CREATE OR REPLACE FUNCTION public.link_collaborator_for_current_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_email text;
  v_updated int;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF v_email = '' THEN
    RETURN false;
  END IF;

  UPDATE public.collaborators
  SET user_id = auth.uid(),
      updated_at = now()
  WHERE user_id IS NULL
    AND is_active = true
    AND lower(email) = v_email;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.link_collaborator_for_current_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.link_collaborator_for_current_user() TO authenticated;