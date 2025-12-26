-- Add url_slug column to personalized_wine_requests
ALTER TABLE public.personalized_wine_requests
ADD COLUMN url_slug TEXT UNIQUE;

-- Create index for faster lookups by slug
CREATE INDEX idx_personalized_wine_requests_url_slug ON public.personalized_wine_requests(url_slug);

-- Create a function to get recommendation by slug (public access)
CREATE OR REPLACE FUNCTION public.get_wine_recommendation_by_slug(p_url_slug text)
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
  WHERE pwr.url_slug = p_url_slug
  AND pwr.recommendation_published_at IS NOT NULL;
$$;