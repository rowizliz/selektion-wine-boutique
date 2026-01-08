-- Ensure commission edits keep collaborator wallet_balance in sync

CREATE OR REPLACE FUNCTION public.add_commission_to_wallet_on_order_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  old_commission numeric;
  new_commission numeric;
  diff numeric;
  old_applied boolean;
BEGIN
  old_commission := COALESCE(OLD.commission_amount, 0);
  new_commission := COALESCE(NEW.commission_amount, 0);

  -- INSERT: apply commission immediately if created as approved
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'approved' AND COALESCE(NEW.commission_added, false) = false AND new_commission <> 0 THEN
      UPDATE public.collaborators
      SET wallet_balance = COALESCE(wallet_balance, 0) + new_commission
      WHERE id = NEW.collaborator_id;

      NEW.commission_added := true;
    END IF;

    RETURN NEW;
  END IF;

  -- UPDATE
  old_applied := (OLD.status = 'approved') AND COALESCE(OLD.commission_added, false) = true;

  -- If order was approved+applied, but is no longer approved -> remove previously applied commission
  IF old_applied AND NEW.status <> 'approved' THEN
    IF old_commission <> 0 THEN
      UPDATE public.collaborators
      SET wallet_balance = COALESCE(wallet_balance, 0) - old_commission
      WHERE id = NEW.collaborator_id;
    END IF;

    NEW.commission_added := false;
    RETURN NEW;
  END IF;

  -- If order becomes approved and commission hasn't been applied yet -> apply
  IF (NOT old_applied) AND NEW.status = 'approved' AND COALESCE(NEW.commission_added, false) = false THEN
    IF new_commission <> 0 THEN
      UPDATE public.collaborators
      SET wallet_balance = COALESCE(wallet_balance, 0) + new_commission
      WHERE id = NEW.collaborator_id;
    END IF;

    NEW.commission_added := true;
    RETURN NEW;
  END IF;

  -- If already approved+applied and commission value changed -> apply delta
  IF old_applied AND NEW.status = 'approved' THEN
    diff := new_commission - old_commission;

    IF diff <> 0 THEN
      UPDATE public.collaborators
      SET wallet_balance = COALESCE(wallet_balance, 0) + diff
      WHERE id = NEW.collaborator_id;
    END IF;

    NEW.commission_added := true;
    RETURN NEW;
  END IF;

  -- Default: keep as-is
  RETURN NEW;
END;
$$;

-- Attach trigger to actually run the function (was missing)
DROP TRIGGER IF EXISTS add_commission_to_wallet_on_order_approved_trigger ON public.collaborator_orders;

CREATE TRIGGER add_commission_to_wallet_on_order_approved_trigger
BEFORE INSERT OR UPDATE OF status, commission_amount, commission_added
ON public.collaborator_orders
FOR EACH ROW
EXECUTE FUNCTION public.add_commission_to_wallet_on_order_approved();
