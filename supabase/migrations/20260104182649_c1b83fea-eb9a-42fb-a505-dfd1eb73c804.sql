-- Create storage bucket for withdrawal proofs and QR codes
INSERT INTO storage.buckets (id, name, public) VALUES ('collaborator-files', 'collaborator-files', true);

-- Storage policies for collaborator-files bucket
CREATE POLICY "Collaborators can upload own QR codes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'collaborator-files' 
  AND (storage.foldername(name))[1] = 'qr-codes'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Admins can upload transfer proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'collaborator-files' 
  AND (storage.foldername(name))[1] = 'transfer-proofs'
  AND is_admin()
);

CREATE POLICY "Anyone can view collaborator files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'collaborator-files');

CREATE POLICY "Collaborators can update own QR codes"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'collaborator-files' 
  AND (storage.foldername(name))[1] = 'qr-codes'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Collaborators can delete own QR codes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'collaborator-files' 
  AND (storage.foldername(name))[1] = 'qr-codes'
  AND auth.uid() IS NOT NULL
);