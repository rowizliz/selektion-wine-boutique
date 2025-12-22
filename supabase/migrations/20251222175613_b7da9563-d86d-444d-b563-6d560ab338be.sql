-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create wines table with all fields from the Wine interface
CREATE TABLE public.wines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  grapes TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('red', 'white', 'sparkling')),
  temperature TEXT,
  alcohol TEXT,
  pairing TEXT,
  tasting_notes TEXT,
  flavor_notes TEXT[],
  vintage TEXT,
  region TEXT,
  -- Characteristics as separate columns
  sweetness NUMERIC(3,1) DEFAULT 0,
  body NUMERIC(3,1) DEFAULT 0,
  tannin NUMERIC(3,1) DEFAULT 0,
  acidity NUMERIC(3,1) DEFAULT 0,
  fizzy NUMERIC(3,1),
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wines ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view wines)
CREATE POLICY "Anyone can view wines" 
ON public.wines 
FOR SELECT 
USING (true);

-- Only admins can insert wines
CREATE POLICY "Admins can insert wines" 
ON public.wines 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only admins can update wines
CREATE POLICY "Admins can update wines" 
ON public.wines 
FOR UPDATE 
USING (public.is_admin());

-- Only admins can delete wines
CREATE POLICY "Admins can delete wines" 
ON public.wines 
FOR DELETE 
USING (public.is_admin());

-- Create updated_at trigger
CREATE TRIGGER update_wines_updated_at
BEFORE UPDATE ON public.wines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for wine images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wine-images', 'wine-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for wine images bucket
CREATE POLICY "Wine images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wine-images');

CREATE POLICY "Admins can upload wine images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wine-images' AND public.is_admin());

CREATE POLICY "Admins can update wine images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'wine-images' AND public.is_admin());

CREATE POLICY "Admins can delete wine images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'wine-images' AND public.is_admin());