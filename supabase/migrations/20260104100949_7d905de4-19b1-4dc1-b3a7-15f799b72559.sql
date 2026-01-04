-- Create inventory table to track stock and purchase prices
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id uuid REFERENCES public.wines(id) ON DELETE CASCADE NOT NULL UNIQUE,
  quantity_in_stock integer NOT NULL DEFAULT 0,
  purchase_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text,
  order_type text NOT NULL DEFAULT 'sale' CHECK (order_type IN ('sale', 'gift')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  wine_id uuid REFERENCES public.wines(id) ON DELETE SET NULL,
  wine_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  purchase_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for inventory
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (true);

-- RLS policies for orders
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (is_admin());

-- RLS policies for order_items
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();