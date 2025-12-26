-- Add agenda field for event content/program
ALTER TABLE public.event_invitations 
ADD COLUMN agenda TEXT NULL;