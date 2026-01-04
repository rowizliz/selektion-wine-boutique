-- Fix remaining admin policies to use authenticated role

-- birthday_gift_requests: Admin policies should be authenticated only
DROP POLICY IF EXISTS "Admins can delete requests" ON public.birthday_gift_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.birthday_gift_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.birthday_gift_requests;

CREATE POLICY "Admins can view all requests" ON public.birthday_gift_requests
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update requests" ON public.birthday_gift_requests
FOR UPDATE TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete requests" ON public.birthday_gift_requests
FOR DELETE TO authenticated
USING (is_admin());

-- personalized_wine_requests: Admin policies should be authenticated only
DROP POLICY IF EXISTS "Admins can delete personalized wine requests" ON public.personalized_wine_requests;
DROP POLICY IF EXISTS "Admins can update personalized wine requests" ON public.personalized_wine_requests;
DROP POLICY IF EXISTS "Admins can view personalized wine requests" ON public.personalized_wine_requests;

CREATE POLICY "Admins can view personalized wine requests" ON public.personalized_wine_requests
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update personalized wine requests" ON public.personalized_wine_requests
FOR UPDATE TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete personalized wine requests" ON public.personalized_wine_requests
FOR DELETE TO authenticated
USING (is_admin());

-- wines: Admin policies should be authenticated only
DROP POLICY IF EXISTS "Admins can delete wines" ON public.wines;
DROP POLICY IF EXISTS "Admins can update wines" ON public.wines;
DROP POLICY IF EXISTS "Admins can insert wines" ON public.wines;

CREATE POLICY "Admins can insert wines" ON public.wines
FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update wines" ON public.wines
FOR UPDATE TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete wines" ON public.wines
FOR DELETE TO authenticated
USING (is_admin());

-- inventory: Admin policy should be authenticated only
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;

CREATE POLICY "Admins can manage inventory" ON public.inventory
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- event_invitations: Admin policy should be authenticated only
DROP POLICY IF EXISTS "Admin can manage invitations" ON public.event_invitations;

CREATE POLICY "Admin can manage invitations" ON public.event_invitations
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- invitation_rsvps: Admin policy should be authenticated only
DROP POLICY IF EXISTS "Admin can manage RSVPs" ON public.invitation_rsvps;

CREATE POLICY "Admin can manage RSVPs" ON public.invitation_rsvps
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- user_roles: Admin policies should be authenticated only
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (is_admin());

CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- wine_recommendations: Admin policies should be authenticated only
DROP POLICY IF EXISTS "Admins can delete recommendations" ON public.wine_recommendations;
DROP POLICY IF EXISTS "Admins can update recommendations" ON public.wine_recommendations;
DROP POLICY IF EXISTS "Admins can insert recommendations" ON public.wine_recommendations;

CREATE POLICY "Admins can insert recommendations" ON public.wine_recommendations
FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update recommendations" ON public.wine_recommendations
FOR UPDATE TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete recommendations" ON public.wine_recommendations
FOR DELETE TO authenticated
USING (is_admin());