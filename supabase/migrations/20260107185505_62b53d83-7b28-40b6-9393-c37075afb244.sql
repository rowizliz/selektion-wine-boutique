-- Create gift_sets table
CREATE TABLE public.gift_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  wine TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_sets ENABLE ROW LEVEL SECURITY;

-- Public can view active gift sets
CREATE POLICY "Anyone can view active gift sets"
ON public.gift_sets
FOR SELECT
USING (is_active = true OR is_admin());

-- Only admins can insert
CREATE POLICY "Admins can insert gift sets"
ON public.gift_sets
FOR INSERT
WITH CHECK (is_admin());

-- Only admins can update
CREATE POLICY "Admins can update gift sets"
ON public.gift_sets
FOR UPDATE
USING (is_admin());

-- Only admins can delete
CREATE POLICY "Admins can delete gift sets"
ON public.gift_sets
FOR DELETE
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_gift_sets_updated_at
BEFORE UPDATE ON public.gift_sets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for gift images
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-images', 'gift-images', true);

-- Storage policies for gift images
CREATE POLICY "Gift images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gift-images');

CREATE POLICY "Admins can upload gift images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gift-images' AND is_admin());

CREATE POLICY "Admins can update gift images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'gift-images' AND is_admin());

CREATE POLICY "Admins can delete gift images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'gift-images' AND is_admin());