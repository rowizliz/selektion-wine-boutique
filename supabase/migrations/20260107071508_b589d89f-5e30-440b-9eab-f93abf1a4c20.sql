-- Fix collaborators table policies to use authenticated role instead of public

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage collaborators" ON public.collaborators;
DROP POLICY IF EXISTS "Collaborators can update own profile" ON public.collaborators;
DROP POLICY IF EXISTS "Collaborators can view own profile" ON public.collaborators;

-- Recreate policies with authenticated role only

-- Admins can do everything
CREATE POLICY "Admins can manage collaborators" 
ON public.collaborators 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Collaborators can view their own profile
CREATE POLICY "Collaborators can view own profile" 
ON public.collaborators 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Collaborators can update their own profile
CREATE POLICY "Collaborators can update own profile" 
ON public.collaborators 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());