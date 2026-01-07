-- Drop and recreate INSERT policies with more specific checks

-- 1. birthday_gift_requests - Allow insert but ensure only safe fields
DROP POLICY IF EXISTS "Anyone can insert birthday gift requests" ON public.birthday_gift_requests;
CREATE POLICY "Anyone can insert birthday gift requests" 
ON public.birthday_gift_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Ensure status defaults to 'pending' (can't set other statuses)
  status = 'pending'
);

-- 2. collaborator_applications - Allow insert but ensure status is pending
DROP POLICY IF EXISTS "Anyone can submit application" ON public.collaborator_applications;
CREATE POLICY "Anyone can submit application" 
ON public.collaborator_applications 
FOR INSERT 
TO public
WITH CHECK (
  -- Ensure status defaults to 'pending'
  status = 'pending'
);

-- 3. contact_messages - Allow insert but ensure status is unread
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message" 
ON public.contact_messages 
FOR INSERT 
TO public
WITH CHECK (
  -- Ensure status defaults to 'unread'
  status = 'unread'
);

-- 4. invitation_rsvps - More restrictive - only allow if invitation exists
DROP POLICY IF EXISTS "Anyone can create RSVP" ON public.invitation_rsvps;
CREATE POLICY "Anyone can create RSVP" 
ON public.invitation_rsvps 
FOR INSERT 
TO public
WITH CHECK (
  -- Ensure invitation_id references a valid invitation
  EXISTS (
    SELECT 1 FROM public.event_invitations 
    WHERE id = invitation_id
  )
);

-- 5. personalized_wine_requests - Allow insert but ensure status is pending
DROP POLICY IF EXISTS "Anyone can insert personalized wine requests" ON public.personalized_wine_requests;
CREATE POLICY "Anyone can insert personalized wine requests" 
ON public.personalized_wine_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Ensure status defaults to 'pending'
  status = 'pending'
);