-- Create storage bucket for flavor icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('flavor-icons', 'flavor-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can view flavor icons"
ON storage.objects
FOR SELECT
USING (bucket_id = 'flavor-icons');

-- Allow authenticated users to upload (for admin)
CREATE POLICY "Authenticated users can upload flavor icons"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'flavor-icons');

CREATE POLICY "Authenticated users can update flavor icons"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'flavor-icons');

CREATE POLICY "Authenticated users can delete flavor icons"
ON storage.objects
FOR DELETE
USING (bucket_id = 'flavor-icons');