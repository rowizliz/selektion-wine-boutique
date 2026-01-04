-- Fix storage policies for wine-images bucket to use authenticated role instead of public
-- This prevents anonymous users from even triggering admin policies

-- Drop existing wine-images admin policies that use public role
DROP POLICY IF EXISTS "Admins can delete wine images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update wine images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload wine images" ON storage.objects;

-- Recreate with authenticated role only
CREATE POLICY "Admins can upload wine images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'wine-images' AND is_admin());

CREATE POLICY "Admins can update wine images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'wine-images' AND is_admin());

CREATE POLICY "Admins can delete wine images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'wine-images' AND is_admin());