-- Drop the existing SELECT policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view own profile or article authors" ON public.user_profiles;

-- Create a simpler SELECT policy that allows anyone to view profiles
CREATE POLICY "Anyone can view profiles"
ON public.user_profiles
FOR SELECT
USING (true);