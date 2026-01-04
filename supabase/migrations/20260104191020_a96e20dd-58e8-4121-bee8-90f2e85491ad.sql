-- Drop the overly permissive policy that allows anyone to read RSVPs
DROP POLICY IF EXISTS "Anyone can read RSVPs" ON public.invitation_rsvps;

-- Create a new policy that only allows admins to read RSVPs
CREATE POLICY "Admins can read RSVPs" 
ON public.invitation_rsvps 
FOR SELECT 
USING (is_admin());