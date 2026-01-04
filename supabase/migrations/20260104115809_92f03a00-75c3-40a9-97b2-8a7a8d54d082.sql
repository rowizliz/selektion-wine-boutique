-- Remove public access to inventory table - only admins should see purchase prices
DROP POLICY IF EXISTS "Anyone can view inventory" ON public.inventory;