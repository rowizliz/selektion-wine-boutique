-- Add RLS policy allowing collaborators to view their own profile
CREATE POLICY "Collaborators can view own profile"
ON public.collaborators
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update is_collaborator() function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_collaborator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.collaborators
    WHERE user_id = auth.uid()
    AND is_active = true
  )
$$;