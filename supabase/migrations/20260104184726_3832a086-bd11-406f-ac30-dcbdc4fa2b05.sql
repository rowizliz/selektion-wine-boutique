-- Allow collaborators to update their own bank info (and other self fields)
CREATE POLICY "Collaborators can update own profile"
ON public.collaborators
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Track whether commission was already added to wallet to avoid double counting
ALTER TABLE public.collaborator_orders
ADD COLUMN IF NOT EXISTS commission_added boolean NOT NULL DEFAULT false;

-- Function: add commission to wallet on approval
CREATE OR REPLACE FUNCTION public.add_commission_to_wallet_on_order_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act when order becomes approved and commission hasn't been applied yet
  IF (NEW.status = 'approved') AND (COALESCE(NEW.commission_amount, 0) > 0) AND (NEW.commission_added = false) THEN
    UPDATE public.collaborators
    SET wallet_balance = COALESCE(wallet_balance, 0) + COALESCE(NEW.commission_amount, 0)
    WHERE id = NEW.collaborator_id;

    NEW.commission_added := true;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: before update so we can mutate NEW.commission_added
DROP TRIGGER IF EXISTS trg_add_commission_to_wallet ON public.collaborator_orders;
CREATE TRIGGER trg_add_commission_to_wallet
BEFORE UPDATE OF status, commission_amount ON public.collaborator_orders
FOR EACH ROW
EXECUTE FUNCTION public.add_commission_to_wallet_on_order_approved();
