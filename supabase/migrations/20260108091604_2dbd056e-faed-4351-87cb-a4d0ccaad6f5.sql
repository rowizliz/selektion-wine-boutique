-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can create RSVP" ON public.invitation_rsvps;

-- Create a new policy that allows anyone (including unauthenticated users) to insert RSVPs
CREATE POLICY "Public can create RSVP" 
ON public.invitation_rsvps 
FOR INSERT 
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM event_invitations 
    WHERE event_invitations.id = invitation_rsvps.invitation_id
  )
);