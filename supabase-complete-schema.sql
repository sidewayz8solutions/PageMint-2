-- PageMint Complete Database Schema
-- Run this in your Supabase SQL Editor to create all remaining tables

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    stripe_customer_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create digital_deliveries table
CREATE TABLE IF NOT EXISTS public.digital_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
    download_url TEXT,
    download_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON public.customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_deliveries_order_item_id ON public.digital_deliveries(order_item_id);
CREATE INDEX IF NOT EXISTS idx_digital_deliveries_token ON public.digital_deliveries(download_token);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_deliveries ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies

-- Customers can only see their own data
CREATE POLICY "Users can view own customer data" ON public.customers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own customer data" ON public.customers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (
        customer_id IN (
            SELECT id FROM public.customers WHERE auth.uid()::text = id::text
        )
    );

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_id IN (
                SELECT id FROM public.customers WHERE auth.uid()::text = id::text
            )
        )
    );

-- Digital deliveries policies
CREATE POLICY "Users can view own digital deliveries" ON public.digital_deliveries
    FOR SELECT USING (
        order_item_id IN (
            SELECT oi.id FROM public.order_items oi
            JOIN public.orders o ON oi.order_id = o.id
            JOIN public.customers c ON o.customer_id = c.id
            WHERE auth.uid()::text = c.id::text
        )
    );

-- 8. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.customers TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.digital_deliveries TO anon, authenticated;

-- Allow authenticated users to insert/update their own data
GRANT INSERT, UPDATE ON public.customers TO authenticated;
GRANT INSERT, UPDATE ON public.orders TO authenticated;
GRANT INSERT, UPDATE ON public.order_items TO authenticated;
GRANT INSERT, UPDATE ON public.digital_deliveries TO authenticated;
