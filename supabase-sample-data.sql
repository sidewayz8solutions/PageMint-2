-- PageMint Sample Data
-- Run this AFTER creating the tables to add sample data

-- 1. Insert sample customers
INSERT INTO public.customers (id, email, full_name, stripe_customer_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'john.doe@example.com',
    'John Doe',
    'cus_sample_john_doe'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'jane.smith@example.com',
    'Jane Smith',
    'cus_sample_jane_smith'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'mike.wilson@example.com',
    'Mike Wilson',
    'cus_sample_mike_wilson'
)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert sample orders
INSERT INTO public.orders (id, customer_id, stripe_payment_intent_id, total_amount, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'pi_sample_order_001',
    29.00,
    'completed'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'pi_sample_order_002',
    59.00,
    'completed'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'pi_sample_order_003',
    88.00,
    'processing'
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    'pi_sample_order_004',
    59.00,
    'completed'
)
ON CONFLICT (stripe_payment_intent_id) DO NOTHING;

-- 3. Insert sample order items
INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, total_price) VALUES
-- John's first order (Starter Pack)
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    1, -- Starter Pack
    1,
    29.00,
    29.00
),
-- Jane's order (Pro Pack)
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    2, -- Pro Pack
    1,
    59.00,
    59.00
),
-- Mike's order (Both packs)
(
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003',
    1, -- Starter Pack
    1,
    29.00,
    29.00
),
(
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440003',
    2, -- Pro Pack
    1,
    59.00,
    59.00
),
-- John's second order (Pro Pack)
(
    '770e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440004',
    2, -- Pro Pack
    1,
    59.00,
    59.00
);

-- 4. Insert sample digital deliveries
INSERT INTO public.digital_deliveries (id, order_item_id, download_url, download_token, expires_at, download_count, is_delivered, delivered_at) VALUES
-- John's Starter Pack delivery
(
    '880e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440001',
    'https://pagemint-downloads.s3.amazonaws.com/starter-pack/john-doe-starter.zip',
    'dl_token_john_starter_001',
    NOW() + INTERVAL '30 days',
    2,
    true,
    NOW() - INTERVAL '2 days'
),
-- Jane's Pro Pack delivery
(
    '880e8400-e29b-41d4-a716-446655440002',
    '770e8400-e29b-41d4-a716-446655440002',
    'https://pagemint-downloads.s3.amazonaws.com/pro-pack/jane-smith-pro.zip',
    'dl_token_jane_pro_001',
    NOW() + INTERVAL '30 days',
    1,
    true,
    NOW() - INTERVAL '1 day'
),
-- Mike's Starter Pack delivery
(
    '880e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440003',
    'https://pagemint-downloads.s3.amazonaws.com/starter-pack/mike-wilson-starter.zip',
    'dl_token_mike_starter_001',
    NOW() + INTERVAL '30 days',
    0,
    false,
    NULL
),
-- Mike's Pro Pack delivery
(
    '880e8400-e29b-41d4-a716-446655440004',
    '770e8400-e29b-41d4-a716-446655440004',
    'https://pagemint-downloads.s3.amazonaws.com/pro-pack/mike-wilson-pro.zip',
    'dl_token_mike_pro_001',
    NOW() + INTERVAL '30 days',
    0,
    false,
    NULL
),
-- John's Pro Pack delivery
(
    '880e8400-e29b-41d4-a716-446655440005',
    '770e8400-e29b-41d4-a716-446655440005',
    'https://pagemint-downloads.s3.amazonaws.com/pro-pack/john-doe-pro.zip',
    'dl_token_john_pro_001',
    NOW() + INTERVAL '30 days',
    3,
    true,
    NOW() - INTERVAL '1 hour'
)
ON CONFLICT (download_token) DO NOTHING;

-- 5. Update order totals to match order items (in case of rounding)
UPDATE public.orders SET total_amount = (
    SELECT SUM(total_price) FROM public.order_items WHERE order_id = orders.id
) WHERE id IN (
    '660e8400-e29b-41d4-a716-446655440003'
);

-- 6. Verify the data with some sample queries
-- Uncomment these to test your data:

-- SELECT 'Customers' as table_name, COUNT(*) as count FROM public.customers
-- UNION ALL
-- SELECT 'Orders', COUNT(*) FROM public.orders
-- UNION ALL  
-- SELECT 'Order Items', COUNT(*) FROM public.order_items
-- UNION ALL
-- SELECT 'Digital Deliveries', COUNT(*) FROM public.digital_deliveries;

-- -- Customer order summary
-- SELECT 
--     c.full_name,
--     c.email,
--     COUNT(o.id) as total_orders,
--     SUM(o.total_amount) as total_spent,
--     COUNT(dd.id) as total_deliveries
-- FROM public.customers c
-- LEFT JOIN public.orders o ON c.id = o.customer_id
-- LEFT JOIN public.order_items oi ON o.id = oi.order_id
-- LEFT JOIN public.digital_deliveries dd ON oi.id = dd.order_item_id
-- GROUP BY c.id, c.full_name, c.email
-- ORDER BY total_spent DESC;
