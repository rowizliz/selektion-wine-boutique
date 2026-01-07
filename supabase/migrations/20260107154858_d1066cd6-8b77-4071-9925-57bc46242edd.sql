-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view user profiles" ON public.user_profiles;

-- Create a more restrictive policy: only authenticated users can view profiles
-- Or profiles that are authors of published articles
CREATE POLICY "Users can view own profile or article authors" 
ON public.user_profiles 
FOR SELECT 
USING (
  -- Users can see their own profile
  user_id = auth.uid()
  OR
  -- Anyone can see profiles of published article authors
  id IN (
    SELECT DISTINCT author_id 
    FROM public.blog_articles 
    WHERE status = 'published'
  )
  OR
  -- Admins can see all profiles
  is_admin()
);