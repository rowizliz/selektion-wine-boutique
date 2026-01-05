-- Create password change requests table
CREATE TABLE public.password_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID
);

-- Enable RLS
ALTER TABLE public.password_change_requests ENABLE ROW LEVEL SECURITY;

-- Admin can manage all requests
CREATE POLICY "Admins can manage password change requests"
ON public.password_change_requests
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Collaborators can view their own requests
CREATE POLICY "Collaborators can view own password requests"
ON public.password_change_requests
FOR SELECT
USING (collaborator_id IN (
  SELECT id FROM collaborators WHERE user_id = auth.uid()
));

-- Collaborators can create their own requests
CREATE POLICY "Collaborators can create password requests"
ON public.password_change_requests
FOR INSERT
WITH CHECK (collaborator_id IN (
  SELECT id FROM collaborators WHERE user_id = auth.uid()
));