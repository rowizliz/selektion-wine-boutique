-- Add admin role for ejuice.le@gmail.com after they sign up
-- This will only work after the user has registered with this email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'ejuice.le@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;