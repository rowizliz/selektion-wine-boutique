-- Create collaborators table
CREATE TABLE public.collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  discount_percent NUMERIC NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage collaborators"
  ON public.collaborators
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Collaborators can view own profile"
  ON public.collaborators
  FOR SELECT
  USING (user_id = auth.uid());

-- Create commission tiers table
CREATE TABLE public.commission_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  commission_percent NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage commission tiers"
  ON public.commission_tiers
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create function to check if user is collaborator
CREATE OR REPLACE FUNCTION public.is_collaborator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.collaborators
    WHERE user_id = auth.uid()
    AND is_active = true
  )
$$;

CREATE POLICY "Collaborators can view commission tiers"
  ON public.commission_tiers
  FOR SELECT
  USING (is_collaborator());

-- Insert default commission tiers
INSERT INTO public.commission_tiers (min_quantity, max_quantity, commission_percent) VALUES
  (1, 3, 5),
  (4, 4, 6),
  (5, 5, 7),
  (6, 7, 7.5),
  (8, 9, 8),
  (10, NULL, 10);

-- Create collaborator orders table
CREATE TABLE public.collaborator_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collaborator_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage collaborator orders"
  ON public.collaborator_orders
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Collaborators can view own orders"
  ON public.collaborator_orders
  FOR SELECT
  USING (collaborator_id IN (SELECT id FROM public.collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Collaborators can create orders"
  ON public.collaborator_orders
  FOR INSERT
  WITH CHECK (collaborator_id IN (SELECT id FROM public.collaborators WHERE user_id = auth.uid()));

-- Create collaborator order items table
CREATE TABLE public.collaborator_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.collaborator_orders(id) ON DELETE CASCADE,
  wine_id UUID REFERENCES public.wines(id),
  wine_name TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  collaborator_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collaborator_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage collaborator order items"
  ON public.collaborator_order_items
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Collaborators can view own order items"
  ON public.collaborator_order_items
  FOR SELECT
  USING (order_id IN (
    SELECT co.id FROM public.collaborator_orders co
    JOIN public.collaborators c ON co.collaborator_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Collaborators can create order items"
  ON public.collaborator_order_items
  FOR INSERT
  WITH CHECK (order_id IN (
    SELECT co.id FROM public.collaborator_orders co
    JOIN public.collaborators c ON co.collaborator_id = c.id
    WHERE c.user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON public.collaborators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_tiers_updated_at
  BEFORE UPDATE ON public.commission_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborator_orders_updated_at
  BEFORE UPDATE ON public.collaborator_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();