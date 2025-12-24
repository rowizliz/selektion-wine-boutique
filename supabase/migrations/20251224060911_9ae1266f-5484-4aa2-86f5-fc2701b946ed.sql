-- Create personalized_wine_requests table
CREATE TABLE public.personalized_wine_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Contact info
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Wine preferences
  wine_types TEXT[],
  wine_styles TEXT[],
  
  -- Culinary preferences
  cuisine_types TEXT[],
  taste_sweet_level INTEGER,
  taste_spicy_level INTEGER,
  
  -- Lifestyle
  music_genres TEXT[],
  hobbies TEXT[],
  
  -- Budget & Occasion
  budget_range TEXT,
  occasions TEXT[],
  
  -- Notes
  additional_notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL
);

-- Enable RLS
ALTER TABLE public.personalized_wine_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can insert personalized wine requests"
ON public.personalized_wine_requests
FOR INSERT
WITH CHECK (true);

-- Admins can view all requests
CREATE POLICY "Admins can view personalized wine requests"
ON public.personalized_wine_requests
FOR SELECT
USING (public.is_admin());

-- Admins can update requests
CREATE POLICY "Admins can update personalized wine requests"
ON public.personalized_wine_requests
FOR UPDATE
USING (public.is_admin());

-- Admins can delete requests
CREATE POLICY "Admins can delete personalized wine requests"
ON public.personalized_wine_requests
FOR DELETE
USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_personalized_wine_requests_updated_at
BEFORE UPDATE ON public.personalized_wine_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();