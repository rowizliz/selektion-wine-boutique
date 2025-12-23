-- Add tracking_token column for customer to track their request
ALTER TABLE public.birthday_gift_requests 
ADD COLUMN tracking_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Create index for efficient lookup
CREATE INDEX idx_birthday_gift_requests_tracking_token 
ON public.birthday_gift_requests(tracking_token);

-- Create a SECURITY DEFINER function that allows anyone to lookup request status by token
-- This bypasses RLS but only returns limited, non-sensitive data
CREATE OR REPLACE FUNCTION public.get_birthday_gift_request_status(p_tracking_token UUID)
RETURNS TABLE (
  tracking_token UUID,
  status TEXT,
  created_at TIMESTAMPTZ,
  recipient_name TEXT,
  sender_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bgr.tracking_token,
    bgr.status,
    bgr.created_at,
    bgr.recipient_name,
    bgr.sender_name
  FROM public.birthday_gift_requests bgr
  WHERE bgr.tracking_token = p_tracking_token
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_birthday_gift_request_status(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_birthday_gift_request_status(UUID) TO authenticated;