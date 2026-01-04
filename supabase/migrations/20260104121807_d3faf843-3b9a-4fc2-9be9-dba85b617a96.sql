-- Create new has_role function with only role parameter (checks current user only)
-- This prevents role enumeration attacks
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Update is_admin to use new signature
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role('admin')
$$;

-- Drop the old has_role function with two parameters after creating new one
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);