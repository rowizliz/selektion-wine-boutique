-- Add requested_phone column to collaborator_profile_updates table
ALTER TABLE public.collaborator_profile_updates 
ADD COLUMN requested_phone TEXT;