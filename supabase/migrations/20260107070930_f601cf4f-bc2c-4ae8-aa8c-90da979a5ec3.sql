-- Remove the policy that allows collaborators to view their own update requests
-- This prevents collaborators from viewing pending bank account changes
DROP POLICY IF EXISTS "Collaborators can view own update requests" ON public.collaborator_profile_updates;