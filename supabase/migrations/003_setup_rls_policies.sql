/*
  # Enhanced RLS Policies and Security Setup
  
  1. Purpose: Complete RLS setup with proper security policies
  2. Security: Enhanced policies for all tables
  3. Performance: Additional indexes for optimal query performance
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
DROP POLICY IF EXISTS "Customers can access own deliveries" ON digital_deliveries;

-- Enhanced RLS policies

-- Customers: Can only view and update their own data
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- Products: Public read access for active products, admin can manage
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Orders: Customers can view their own orders, service role can manage
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- Order items: Related to customer orders
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE c.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Service role can manage order items"
  ON order_items FOR ALL
  USING (auth.role() = 'service_role');

-- Digital deliveries: Customers can access their own deliveries
CREATE POLICY "Customers can access own deliveries"
  ON digital_deliveries FOR SELECT
  USING (
    customer_email = auth.jwt() ->> 'email'
    AND expires_at > now()
    AND is_expired = false
  );

CREATE POLICY "Service role can manage deliveries"
  ON digital_deliveries FOR ALL
  USING (auth.role() = 'service_role');

-- Email logs: Service role only
CREATE POLICY "Service role can manage email logs"
  ON email_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Download analytics: Service role only
CREATE POLICY "Service role can manage analytics"
  ON download_analytics FOR ALL
  USING (auth.role() = 'service_role');

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_digital_deliveries_customer_email ON digital_deliveries(customer_email);
CREATE INDEX IF NOT EXISTS idx_digital_deliveries_expires_at ON digital_deliveries(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_download_analytics_timestamp ON download_analytics(download_timestamp);

-- Create a function to get customer orders with products
CREATE OR REPLACE FUNCTION get_customer_orders(customer_email text)
RETURNS TABLE (
  order_id uuid,
  order_status text,
  product_name text,
  total_amount_cents integer,
  created_at timestamptz,
  download_token text,
  expires_at timestamptz
) 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT 
    o.id as order_id,
    o.status as order_status,
    p.name as product_name,
    o.total_amount_cents,
    o.created_at,
    dd.download_token,
    dd.expires_at
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  LEFT JOIN digital_deliveries dd ON o.id = dd.order_id
  WHERE c.email = customer_email
  ORDER BY o.created_at DESC;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_customer_orders TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_orders TO anon;

-- Create a function to validate download tokens
CREATE OR REPLACE FUNCTION validate_download_token(token text)
RETURNS TABLE (
  is_valid boolean,
  customer_email text,
  product_name text,
  files_metadata jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN dd.download_token IS NOT NULL 
        AND dd.expires_at > now() 
        AND dd.is_expired = false 
      THEN true 
      ELSE false 
    END as is_valid,
    dd.customer_email,
    p.name as product_name,
    dd.files_metadata
  FROM digital_deliveries dd
  LEFT JOIN orders o ON dd.order_id = o.id
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  WHERE dd.download_token = token
  LIMIT 1;
$$;

-- Grant permissions for download validation
GRANT EXECUTE ON FUNCTION validate_download_token TO authenticated;
GRANT EXECUTE ON FUNCTION validate_download_token TO anon;
GRANT EXECUTE ON FUNCTION validate_download_token TO service_role;
