-- Tighten access to commission tiers: no anonymous reads

ALTER TABLE public.commission_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Collaborators can view commission tiers" ON public.commission_tiers;
DROP POLICY IF EXISTS "Admins can manage commission tiers" ON public.commission_tiers;

-- Admins: full management
CREATE POLICY "Admins can manage commission tiers"
ON public.commission_tiers
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Collaborators: read-only
CREATE POLICY "Collaborators can view commission tiers"
ON public.commission_tiers
FOR SELECT
TO authenticated
USING (is_collaborator());