-- Create collaborator_applications table
CREATE TABLE public.collaborator_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  date_of_birth DATE,
  occupation TEXT,
  experience TEXT,
  motivation TEXT,
  cv_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaborator_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (public form)
CREATE POLICY "Anyone can submit application"
ON public.collaborator_applications
FOR INSERT
WITH CHECK (true);

-- Only admin can view applications
CREATE POLICY "Admins can view all applications"
ON public.collaborator_applications
FOR SELECT
USING (public.is_admin());

-- Only admin can update applications
CREATE POLICY "Admins can update applications"
ON public.collaborator_applications
FOR UPDATE
USING (public.is_admin());

-- Only admin can delete applications
CREATE POLICY "Admins can delete applications"
ON public.collaborator_applications
FOR DELETE
USING (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_collaborator_applications_updated_at
BEFORE UPDATE ON public.collaborator_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('recruitment-files', 'recruitment-files', false);

-- Allow anonymous uploads to recruitment-files bucket
CREATE POLICY "Anyone can upload CV"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'recruitment-files');

-- Only admin can view/download CV files
CREATE POLICY "Admins can view recruitment files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'recruitment-files' AND public.is_admin());