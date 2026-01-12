-- Drop the current public SELECT policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.user_profiles;

-- Create new policy: Only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Also clean up email addresses from display_name field
UPDATE public.user_profiles
SET display_name = 'User ' || substring(id::text from 1 for 8)
WHERE display_name LIKE '%@%.%'
  AND display_name ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$';