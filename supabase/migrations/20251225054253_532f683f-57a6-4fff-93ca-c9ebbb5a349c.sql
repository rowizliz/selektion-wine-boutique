-- Drop existing insert policy
DROP POLICY IF EXISTS "Anyone can insert birthday gift requests" ON public.birthday_gift_requests;

-- Create new insert policy that explicitly allows anon and authenticated
CREATE POLICY "Anyone can insert birthday gift requests" 
ON public.birthday_gift_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also fix personalized_wine_requests if it has the same issue
DROP POLICY IF EXISTS "Anyone can insert personalized wine requests" ON public.personalized_wine_requests;

CREATE POLICY "Anyone can insert personalized wine requests" 
ON public.personalized_wine_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);