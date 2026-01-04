-- Add explicit SELECT policy for inventory table (admin only)
-- The existing "Admins can manage inventory" policy uses ALL command
-- which should cover SELECT, but we'll make it explicit for clarity

-- First, check if we need a separate SELECT policy
-- The ALL policy should already cover this, but let's ensure it's explicit
-- by recreating the policies properly

-- Drop existing policy and recreate with proper coverage
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;

-- Create explicit policies for each operation
CREATE POLICY "Admins can select inventory"
ON public.inventory
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert inventory"
ON public.inventory
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update inventory"
ON public.inventory
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete inventory"
ON public.inventory
FOR DELETE
TO authenticated
USING (public.is_admin());