-- Drop the old function first
DROP FUNCTION IF EXISTS public.get_invitation_by_slug_with_pin(text, text);

-- Create updated function with agenda field
CREATE OR REPLACE FUNCTION public.get_invitation_by_slug_with_pin(p_url_slug text, p_pin_code text)
 RETURNS TABLE(id uuid, title text, event_date timestamp with time zone, location text, location_url text, dress_code text, message text, agenda text, cover_image_url text, url_slug text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    ei.agenda,
    ei.cover_image_url,
    ei.url_slug
  FROM public.event_invitations ei
  WHERE ei.url_slug = p_url_slug AND ei.pin_code = p_pin_code;
END;
$function$;