-- Create table for pending profile update requests
CREATE TABLE public.collaborator_profile_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  requested_name TEXT,
  requested_avatar_url TEXT,
  requested_bank_name TEXT,
  requested_bank_account_number TEXT,
  requested_bank_account_holder TEXT,
  requested_qr_code_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID
);

-- Enable RLS
ALTER TABLE public.collaborator_profile_updates ENABLE ROW LEVEL SECURITY;

-- Collaborators can view their own update requests
CREATE POLICY "Collaborators can view own update requests"
ON public.collaborator_profile_updates
FOR SELECT
USING (
  collaborator_id IN (
    SELECT id FROM public.collaborators WHERE user_id = auth.uid()
  )
);

-- Collaborators can create update requests for themselves
CREATE POLICY "Collaborators can create own update requests"
ON public.collaborator_profile_updates
FOR INSERT
WITH CHECK (
  collaborator_id IN (
    SELECT id FROM public.collaborators WHERE user_id = auth.uid()
  )
);

-- Admins can view all update requests
CREATE POLICY "Admins can view all update requests"
ON public.collaborator_profile_updates
FOR SELECT
USING (public.is_admin());

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update requests"
ON public.collaborator_profile_updates
FOR UPDATE
USING (public.is_admin());

-- Add avatar_url column to collaborators table
ALTER TABLE public.collaborators ADD COLUMN IF NOT EXISTS avatar_url TEXT;