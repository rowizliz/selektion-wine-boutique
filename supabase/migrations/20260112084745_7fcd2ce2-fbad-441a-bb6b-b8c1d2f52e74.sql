-- Create a secure view that excludes sensitive banking columns for collaborator profile viewing
-- Collaborators can see their basic info, but banking details are only accessible through admin or specific profile settings

-- Create a secure function to get own collaborator profile without sensitive banking data
CREATE OR REPLACE FUNCTION public.get_own_collaborator_safe_profile()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  name text,
  phone text,
  discount_percent numeric,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  wallet_balance numeric,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    c.id,
    c.user_id,
    c.email,
    c.name,
    c.phone,
    c.discount_percent,
    c.is_active,
    c.created_at,
    c.updated_at,
    c.wallet_balance,
    c.avatar_url
  FROM public.collaborators c
  WHERE c.user_id = auth.uid() AND c.is_active = true;
$$;

-- Create a secure function to get own banking details (only for profile settings dialog)
CREATE OR REPLACE FUNCTION public.get_own_banking_details()
RETURNS TABLE (
  id uuid,
  bank_name text,
  bank_account_number text,
  bank_account_holder text,
  qr_code_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    c.id,
    c.bank_name,
    c.bank_account_number,
    c.bank_account_holder,
    c.qr_code_url
  FROM public.collaborators c
  WHERE c.user_id = auth.uid() AND c.is_active = true;
$$;

-- Update the RLS policy to only allow admins to SELECT all columns directly
-- Collaborators should use the secure functions above instead
DROP POLICY IF EXISTS "Admins can view all collaborators users can view own" ON public.collaborators;

-- Only admins can SELECT from the collaborators table directly
CREATE POLICY "Only admins can select collaborators"
ON public.collaborators
FOR SELECT
TO authenticated
USING (is_admin());

-- Keep the existing policies for admin management and collaborator self-update
-- Collaborators can still UPDATE their own profile (for profile settings)
-- Note: "Admins can manage collaborators" policy already exists for ALL operations
-- Note: "Collaborators can update own profile" policy already exists