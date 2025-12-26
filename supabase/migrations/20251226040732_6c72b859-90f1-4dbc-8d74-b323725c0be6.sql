-- Create wine_recommendations table
CREATE TABLE public.wine_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.personalized_wine_requests(id) ON DELETE CASCADE,
  wine_id TEXT NOT NULL,
  wine_name TEXT NOT NULL,
  wine_price TEXT NOT NULL,
  wine_image_url TEXT,
  recommendation_reason TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add columns to personalized_wine_requests for recommendation publishing
ALTER TABLE public.personalized_wine_requests
ADD COLUMN recommendation_message TEXT,
ADD COLUMN recommendation_published_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on wine_recommendations
ALTER TABLE public.wine_recommendations ENABLE ROW LEVEL SECURITY;

-- Public can view recommendations via the request's tracking token (we'll check via join)
CREATE POLICY "Anyone can view published recommendations"
ON public.wine_recommendations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.personalized_wine_requests pwr
    WHERE pwr.id = wine_recommendations.request_id
    AND pwr.recommendation_published_at IS NOT NULL
  )
);

-- Admins can manage recommendations
CREATE POLICY "Admins can insert recommendations"
ON public.wine_recommendations
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update recommendations"
ON public.wine_recommendations
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete recommendations"
ON public.wine_recommendations
FOR DELETE
USING (is_admin());

-- Create index for faster lookups
CREATE INDEX idx_wine_recommendations_request_id ON public.wine_recommendations(request_id);

-- Create a function to get recommendation by tracking token (public access)
CREATE OR REPLACE FUNCTION public.get_wine_recommendation_by_token(p_tracking_token uuid)
RETURNS TABLE(
  request_id uuid,
  customer_name text,
  recommendation_message text,
  recommendation_published_at timestamp with time zone,
  wines jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    pwr.id as request_id,
    pwr.customer_name,
    pwr.recommendation_message,
    pwr.recommendation_published_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', wr.id,
            'wine_id', wr.wine_id,
            'wine_name', wr.wine_name,
            'wine_price', wr.wine_price,
            'wine_image_url', wr.wine_image_url,
            'recommendation_reason', wr.recommendation_reason,
            'display_order', wr.display_order
          ) ORDER BY wr.display_order
        )
        FROM public.wine_recommendations wr
        WHERE wr.request_id = pwr.id
      ),
      '[]'::jsonb
    ) as wines
  FROM public.personalized_wine_requests pwr
  WHERE pwr.tracking_token = p_tracking_token
  AND pwr.recommendation_published_at IS NOT NULL;
$$;