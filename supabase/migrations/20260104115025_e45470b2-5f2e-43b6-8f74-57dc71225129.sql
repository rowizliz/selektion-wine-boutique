-- Fix storage policies for flavor-icons bucket to use authenticated role
DROP POLICY IF EXISTS "Admin can delete flavor icons" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update flavor icons" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload flavor icons" ON storage.objects;

-- Recreate with authenticated role only (public read is fine)
CREATE POLICY "Admin can upload flavor icons" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'flavor-icons' AND is_admin());

CREATE POLICY "Admin can update flavor icons" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'flavor-icons' AND is_admin());

CREATE POLICY "Admin can delete flavor icons" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'flavor-icons' AND is_admin());

-- Fix admin policies on various tables to use authenticated role instead of public
-- This ensures only authenticated users can trigger admin checks

-- order_items: Change from public to authenticated
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- orders: Change from public to authenticated
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());