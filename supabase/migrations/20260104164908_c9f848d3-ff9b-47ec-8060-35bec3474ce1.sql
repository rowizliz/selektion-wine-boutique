-- Create function to link collaborator with user on login
CREATE OR REPLACE FUNCTION public.link_collaborator_on_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a user logs in, check if their email matches a collaborator
  -- and link them if not already linked
  UPDATE public.collaborators
  SET user_id = NEW.id
  WHERE email = NEW.email
  AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run on new user creation
CREATE TRIGGER on_auth_user_created_link_collaborator
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.link_collaborator_on_login();