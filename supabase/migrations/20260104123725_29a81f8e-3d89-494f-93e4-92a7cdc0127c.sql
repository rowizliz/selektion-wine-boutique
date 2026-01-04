-- Remove public SELECT policy that exposes PIN codes
DROP POLICY IF EXISTS "Anyone can read invitations" ON public.event_invitations;

-- The existing "Admin can manage invitations" policy remains for admin access
-- All public access must go through the secure RPC function get_invitation_by_slug_with_pin
-- which verifies PIN and excludes it from returned fields