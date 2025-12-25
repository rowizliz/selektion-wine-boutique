-- Drop existing insert policies
DROP POLICY IF EXISTS "Anyone can insert birthday gift requests" ON public.birthday_gift_requests;
DROP POLICY IF EXISTS "Anyone can insert personalized wine requests" ON public.personalized_wine_requests;

-- Create PERMISSIVE insert policies for both tables
CREATE POLICY "Anyone can insert birthday gift requests" 
ON public.birthday_gift_requests 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert personalized wine requests" 
ON public.personalized_wine_requests 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);