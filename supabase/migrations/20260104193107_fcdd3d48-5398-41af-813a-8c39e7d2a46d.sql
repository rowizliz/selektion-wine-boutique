-- Add policy for collaborators to upload their own files (avatars, QR codes)
CREATE POLICY "Collaborators can upload own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'collaborator-files' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.collaborators WHERE user_id = auth.uid()
  )
);