-- Fix public RSVP insert failing due to RLS on event_invitations referenced inside WITH CHECK

-- Security definer helper that can check invitation existence while bypassing RLS
create or replace function public.invitation_exists(p_invitation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.event_invitations ei
    where ei.id = p_invitation_id
  );
$$;

-- Replace the policy to use the security definer helper
DROP POLICY IF EXISTS "Public can create RSVP" ON public.invitation_rsvps;

CREATE POLICY "Public can create RSVP"
ON public.invitation_rsvps
FOR INSERT
TO public
WITH CHECK (public.invitation_exists(invitation_id));
