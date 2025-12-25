-- Create function to get personalized wine request status
CREATE OR REPLACE FUNCTION public.get_personalized_wine_request_status(p_tracking_token uuid)
RETURNS TABLE (
  tracking_token uuid,
  status text,
  created_at timestamptz,
  customer_name text
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    pwr.tracking_token,
    pwr.status,
    pwr.created_at,
    pwr.customer_name
  FROM public.personalized_wine_requests pwr
  WHERE pwr.tracking_token = p_tracking_token;
$$;