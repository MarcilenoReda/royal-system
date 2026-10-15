-- Create storage bucket for repair photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'repair-photos',
  'repair-photos',
  true, -- Make public for easier access
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Row Level Security for storage
-- Allow public access for testing (remove auth.role() check)
CREATE POLICY "Users can upload repair photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'repair-photos'
  );

CREATE POLICY "Users can view repair photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'repair-photos'
  );

CREATE POLICY "Users can delete repair photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'repair-photos'
  );
