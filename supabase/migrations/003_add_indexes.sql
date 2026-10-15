-- Add indexes for better query performance

-- Index on repairs.customer_id for faster customer lookups
CREATE INDEX IF NOT EXISTS idx_repairs_customer_id ON repairs(customer_id);

-- Index on repairs.status for filtering by status
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);

-- Index on repairs.received_at for ordering by date
CREATE INDEX IF NOT EXISTS idx_repairs_received_at ON repairs(received_at DESC);

-- Index on repairs.delivered_at for filtering delivered repairs
CREATE INDEX IF NOT EXISTS idx_repairs_delivered_at ON repairs(delivered_at);

-- Index on customers.phone for customer search
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Index on customers.created_at for ordering
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

-- Index on payments.created_at for filtering by date
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Index on payments.repair_id for repair payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_repair_id ON payments(repair_id);

-- Index on repair_photos.repair_id for photo lookups
CREATE INDEX IF NOT EXISTS idx_repair_photos_repair_id ON repair_photos(repair_id);

-- Index on repair_status_history.repair_id for history lookups
CREATE INDEX IF NOT EXISTS idx_repair_status_history_repair_id ON repair_status_history(repair_id);

-- Composite index for repairs by customer and date
CREATE INDEX IF NOT EXISTS idx_repairs_customer_date ON repairs(customer_id, received_at DESC);
