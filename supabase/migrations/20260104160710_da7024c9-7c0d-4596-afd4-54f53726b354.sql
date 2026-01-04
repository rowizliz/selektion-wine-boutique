-- Create inventory profiles table
CREATE TABLE public.inventory_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for inventory_profiles
CREATE POLICY "Admins can select inventory_profiles" 
ON public.inventory_profiles FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can insert inventory_profiles" 
ON public.inventory_profiles FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update inventory_profiles" 
ON public.inventory_profiles FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete inventory_profiles" 
ON public.inventory_profiles FOR DELETE 
USING (is_admin());

-- Add profile_id to inventory table
ALTER TABLE public.inventory ADD COLUMN profile_id UUID REFERENCES public.inventory_profiles(id) ON DELETE SET NULL;

-- Add profile_id to orders table
ALTER TABLE public.orders ADD COLUMN profile_id UUID REFERENCES public.inventory_profiles(id) ON DELETE SET NULL;

-- Create default profile for existing data
INSERT INTO public.inventory_profiles (name, description, is_active)
VALUES ('Quý 1 - 2025', 'Kho hàng Quý 1 năm 2025', true);

-- Update existing inventory to use this profile
UPDATE public.inventory SET profile_id = (SELECT id FROM public.inventory_profiles WHERE is_active = true LIMIT 1);

-- Update existing orders to use this profile
UPDATE public.orders SET profile_id = (SELECT id FROM public.inventory_profiles WHERE is_active = true LIMIT 1);

-- Create trigger for updated_at
CREATE TRIGGER update_inventory_profiles_updated_at
BEFORE UPDATE ON public.inventory_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();