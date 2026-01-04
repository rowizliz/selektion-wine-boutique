-- Add bank info columns to collaborators table
ALTER TABLE public.collaborators
ADD COLUMN bank_name text,
ADD COLUMN bank_account_number text,
ADD COLUMN bank_account_holder text,
ADD COLUMN qr_code_url text,
ADD COLUMN wallet_balance numeric NOT NULL DEFAULT 0;

-- Create withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id uuid NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transfer_proof_url text,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone,
  processed_by uuid
);

-- Enable RLS
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for withdrawal_requests
CREATE POLICY "Collaborators can view own withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
USING (collaborator_id IN (
  SELECT id FROM public.collaborators WHERE user_id = auth.uid()
));

CREATE POLICY "Collaborators can create withdrawal requests"
ON public.withdrawal_requests
FOR INSERT
WITH CHECK (collaborator_id IN (
  SELECT id FROM public.collaborators WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage withdrawal requests"
ON public.withdrawal_requests
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for faster queries
CREATE INDEX idx_withdrawal_requests_collaborator ON public.withdrawal_requests(collaborator_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);