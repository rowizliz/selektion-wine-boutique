-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (public form)
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Only admin can view messages
CREATE POLICY "Only admin can view contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (public.is_admin());

-- Only admin can update messages
CREATE POLICY "Only admin can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  USING (public.is_admin());

-- Only admin can delete messages
CREATE POLICY "Only admin can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();