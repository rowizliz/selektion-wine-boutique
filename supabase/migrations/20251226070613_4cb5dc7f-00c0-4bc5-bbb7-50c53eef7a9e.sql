-- Create event invitations table
CREATE TABLE public.event_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  location_url TEXT,
  dress_code TEXT,
  message TEXT,
  cover_image_url TEXT,
  pin_code TEXT NOT NULL,
  url_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RSVP responses table
CREATE TABLE public.invitation_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.event_invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  phone TEXT,
  attending BOOLEAN NOT NULL DEFAULT true,
  guest_count INTEGER DEFAULT 1,
  note TEXT,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_rsvps ENABLE ROW LEVEL SECURITY;

-- Public can read invitations (with PIN verification in app)
CREATE POLICY "Anyone can read invitations" 
ON public.event_invitations FOR SELECT 
USING (true);

-- Only admin can create/update/delete invitations
CREATE POLICY "Admin can manage invitations" 
ON public.event_invitations FOR ALL 
USING (public.is_admin());

-- Public can create RSVP (guest submission)
CREATE POLICY "Anyone can create RSVP" 
ON public.invitation_rsvps FOR INSERT 
WITH CHECK (true);

-- Public can read RSVPs for their invitation
CREATE POLICY "Anyone can read RSVPs" 
ON public.invitation_rsvps FOR SELECT 
USING (true);

-- Admin can manage all RSVPs
CREATE POLICY "Admin can manage RSVPs" 
ON public.invitation_rsvps FOR ALL 
USING (public.is_admin());

-- Create function to get invitation by slug and verify PIN
CREATE OR REPLACE FUNCTION public.get_invitation_by_slug_with_pin(
  p_url_slug TEXT,
  p_pin_code TEXT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  location_url TEXT,
  dress_code TEXT,
  message TEXT,
  cover_image_url TEXT,
  url_slug TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ei.id,
    ei.title,
    ei.event_date,
    ei.location,
    ei.location_url,
    ei.dress_code,
    ei.message,
    ei.cover_image_url,
    ei.url_slug
  FROM public.event_invitations ei
  WHERE ei.url_slug = p_url_slug AND ei.pin_code = p_pin_code;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_event_invitations_updated_at
BEFORE UPDATE ON public.event_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();