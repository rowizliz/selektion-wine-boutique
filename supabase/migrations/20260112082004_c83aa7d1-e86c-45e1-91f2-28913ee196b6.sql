-- Drop the existing SELECT policy for collaborators
DROP POLICY IF EXISTS "Collaborators can view own profile" ON public.collaborators;

-- Create a new SELECT policy that allows admins to view all OR collaborators to view own profile
CREATE POLICY "Admins can view all collaborators users can view own" 
ON public.collaborators 
FOR SELECT 
TO authenticated
USING (is_admin() OR user_id = auth.uid());