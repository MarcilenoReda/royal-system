-- Fix RLS policies to allow anon access (for public app without auth)
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all customers" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;
DROP POLICY IF EXISTS "Users can update customers" ON customers;

DROP POLICY IF EXISTS "Users can view all repairs" ON repairs;
DROP POLICY IF EXISTS "Users can insert repairs" ON repairs;
DROP POLICY IF EXISTS "Users can update repairs" ON repairs;
DROP POLICY IF EXISTS "Users can delete repairs" ON repairs;

DROP POLICY IF EXISTS "Users can view all repair_photos" ON repair_photos;
DROP POLICY IF EXISTS "Users can insert repair_photos" ON repair_photos;

DROP POLICY IF EXISTS "Users can view all repair_status_history" ON repair_status_history;
DROP POLICY IF EXISTS "Users can insert repair_status_history" ON repair_status_history;

DROP POLICY IF EXISTS "Users can view all payments" ON payments;
DROP POLICY IF EXISTS "Users can insert payments" ON payments;

-- Allow public access (anon + authenticated)
CREATE POLICY "Public can view all customers" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Public can insert customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update customers" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Public can view all repairs" ON repairs
  FOR SELECT USING (true);

CREATE POLICY "Public can insert repairs" ON repairs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update repairs" ON repairs
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete repairs" ON repairs
  FOR DELETE USING (true);

CREATE POLICY "Public can view all repair_photos" ON repair_photos
  FOR SELECT USING (true);

CREATE POLICY "Public can insert repair_photos" ON repair_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view all repair_status_history" ON repair_status_history
  FOR SELECT USING (true);

CREATE POLICY "Public can insert repair_status_history" ON repair_status_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view all payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Public can insert payments" ON payments
  FOR INSERT WITH CHECK (true);
