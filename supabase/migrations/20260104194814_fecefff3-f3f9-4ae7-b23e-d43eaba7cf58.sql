-- First, drop all existing SELECT policies on birthday_gift_requests
DROP POLICY IF EXISTS "Admins can view all requests" ON public.birthday_gift_requests;
DROP POLICY IF EXISTS "Anyone can view birthday gift requests" ON public.birthday_gift_requests;
DROP POLICY IF EXISTS "Public can view birthday gift requests" ON public.birthday_gift_requests;

-- Recreate the admin-only SELECT policy with proper restriction
CREATE POLICY "Admins can view all requests"
ON public.birthday_gift_requests
FOR SELECT
TO authenticated
USING (public.is_admin());