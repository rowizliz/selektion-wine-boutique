-- Fix RLS policy for collaborator_applications - use anon, authenticated instead of public
DROP POLICY IF EXISTS "Anyone can submit application" ON public.collaborator_applications;
CREATE POLICY "Anyone can submit application" 
ON public.collaborator_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  status = 'pending'
);

-- Also fix contact_messages policy
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  status = 'unread'
);

-- Also fix invitation_rsvps policy
DROP POLICY IF EXISTS "Anyone can create RSVP" ON public.invitation_rsvps;
CREATE POLICY "Anyone can create RSVP" 
ON public.invitation_rsvps 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.event_invitations 
    WHERE id = invitation_id
  )
);