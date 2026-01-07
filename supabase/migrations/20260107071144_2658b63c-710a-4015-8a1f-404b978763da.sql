-- Drop existing SELECT policy and recreate with proper role restriction
DROP POLICY IF EXISTS "Admins can view all update requests" ON public.collaborator_profile_updates;

-- Recreate SELECT policy for authenticated admins only
CREATE POLICY "Admins can view all update requests" 
ON public.collaborator_profile_updates 
FOR SELECT 
TO authenticated
USING (is_admin());

-- Also update UPDATE policy to authenticated only
DROP POLICY IF EXISTS "Admins can update requests" ON public.collaborator_profile_updates;

CREATE POLICY "Admins can update requests" 
ON public.collaborator_profile_updates 
FOR UPDATE 
TO authenticated
USING (is_admin());

-- Also update INSERT policy to authenticated only
DROP POLICY IF EXISTS "Collaborators can create own update requests" ON public.collaborator_profile_updates;

CREATE POLICY "Collaborators can create own update requests" 
ON public.collaborator_profile_updates 
FOR INSERT 
TO authenticated
WITH CHECK (collaborator_id IN (
  SELECT id FROM public.collaborators WHERE user_id = auth.uid()
));