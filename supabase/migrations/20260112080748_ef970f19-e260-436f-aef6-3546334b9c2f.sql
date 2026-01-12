-- Drop the current SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.user_profiles;

-- Create new policy: Only admins can view all profiles, users can view own profile
CREATE POLICY "Admins can view all profiles users can view own"
  ON public.user_profiles
  FOR SELECT
  USING (is_admin() OR user_id = auth.uid());