/**
 * Mock data for testing
 */

export const mockProducts = [
  {
    id: 1,
    name: 'Starter Pack',
    description: 'Perfect for personal projects and learning',
    price: 29.00,
    price_id: 'price_REPLACE_WITH_YOUR_STARTER_PACK_PRICE_ID',
    is_active: true,
    features: ['1 Premium Template', 'Source Code', 'Documentation', 'Personal License'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Pro Pack',
    description: 'Everything you need for professional projects',
    price: 59.00,
    price_id: 'price_REPLACE_WITH_YOUR_PRO_PACK_PRICE_ID',
    is_active: true,
    features: ['5 Premium Templates', 'Source Code', 'Documentation', 'Commercial License', 'Priority Support', 'Future Updates'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockCustomers = [
  {
    id: 1,
    email: 'test@example.com',
    stripe_customer_id: 'cus_test123',
    name: 'Test User',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockOrders = [
  {
    id: 1,
    customer_id: 1,
    stripe_session_id: 'cs_test_123',
    status: 'completed',
    total_amount: 59.00,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockOrderItems = [
  {
    id: 1,
    order_id: 1,
    product_id: 2,
    quantity: 1,
    price: 59.00,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockDigitalDeliveries = [
  {
    id: 1,
    order_id: 1,
    download_url: 'https://example.com/download/pro-pack',
    download_count: 0,
    max_downloads: 5,
    expires_at: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z'
  }
];
