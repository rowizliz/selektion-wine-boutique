-- First, check and drop any existing SELECT policies that might be too permissive
-- Then ensure only admins can SELECT from birthday_gift_requests

-- Drop the existing policy if it exists (to recreate properly)
DROP POLICY IF EXISTS "Admins can view all requests" ON public.birthday_gift_requests;

-- Create a proper restrictive SELECT policy for admins only
CREATE POLICY "Admins can view all requests"
ON public.birthday_gift_requests
FOR SELECT
TO authenticated
USING (public.is_admin());