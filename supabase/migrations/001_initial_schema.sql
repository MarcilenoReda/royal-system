-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on phone for fast lookup
CREATE INDEX idx_customers_phone ON customers(phone);

-- Repairs table
CREATE TABLE repairs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL,
  device_model TEXT NOT NULL,
  customer_problem TEXT NOT NULL,
  inspection_result TEXT,
  repair_notes TEXT,
  repair_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (repair_cost - discount) STORED,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  remaining_amount DECIMAL(10, 2) GENERATED ALWAYS AS (repair_cost - discount - paid_amount) STORED,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'inspection', 'waiting_approval', 'approved', 'in_repair', 'ready', 'delivered', 'rejected', 'cancelled')),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for repairs
CREATE INDEX idx_repairs_customer_id ON repairs(customer_id);
CREATE INDEX idx_repairs_status ON repairs(status);
CREATE INDEX idx_repairs_repair_number ON repairs(repair_number);
CREATE INDEX idx_repairs_received_at ON repairs(received_at);

-- Repair photos table
CREATE TABLE repair_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('reception', 'delivery')),
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for repair photos
CREATE INDEX idx_repair_photos_repair_id ON repair_photos(repair_id);
CREATE INDEX idx_repair_photos_type ON repair_photos(photo_type);

-- Repair status history table
CREATE TABLE repair_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for status history
CREATE INDEX idx_repair_status_history_repair_id ON repair_status_history(repair_id);
CREATE INDEX idx_repair_status_history_created_at ON repair_status_history(created_at);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('نقدي', 'فودافون كاش', 'إنستاباي', 'تحويل بنكي', 'أخرى')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for payments
CREATE INDEX idx_payments_repair_id ON payments(repair_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate repair number
CREATE OR REPLACE FUNCTION generate_repair_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  repair_num TEXT;
BEGIN
  -- Get the highest repair number
  SELECT COALESCE(MAX(CAST(SUBSTRING(repair_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM repairs;
  
  -- Format as REP-000001
  repair_num := 'REP-' || LPAD(next_num::TEXT, 6, '0');
  
  RETURN repair_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate repair number
CREATE OR REPLACE FUNCTION set_repair_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.repair_number IS NULL OR NEW.repair_number = '' THEN
    NEW.repair_number := generate_repair_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_repair_number_trigger BEFORE INSERT ON repairs
  FOR EACH ROW EXECUTE FUNCTION set_repair_number();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO repair_status_history (repair_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_status_change_trigger AFTER UPDATE ON repairs
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- Row Level Security Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write all data
CREATE POLICY "Users can view all customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all repairs" ON repairs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert repairs" ON repairs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update repairs" ON repairs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete repairs" ON repairs
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all repair_photos" ON repair_photos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert repair_photos" ON repair_photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all repair_status_history" ON repair_status_history
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert repair_status_history" ON repair_status_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all payments" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert payments" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
