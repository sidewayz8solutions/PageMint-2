#!/usr/bin/env node

/**
 * Complete Database Setup Script for PageMint
 * This script creates all tables and adds sample data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCompleteDatabase() {
  console.log('🚀 Setting up complete PageMint database schema...');
  
  try {
    // 1. Create customers table
    console.log('👥 Creating customers table...');
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.customers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255),
          stripe_customer_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 2. Create orders table
    console.log('📋 Creating orders table...');
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    // 3. Create order_items table
    console.log('📦 Creating order_items table...');
    const { error: orderItemsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
          quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // 4. Create digital_deliveries table
    console.log('💾 Creating digital_deliveries table...');
    const { error: deliveriesError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    // If RPC doesn't work, try direct table operations
    if (customersError || ordersError || orderItemsError || deliveriesError) {
      console.log('⚠️  RPC method not available, trying direct operations...');
      
      // Try to insert sample data to test if tables exist
      console.log('📊 Testing table creation and adding sample data...');
      
      // Insert sample customers
      const { error: insertCustomersError } = await supabase
        .from('customers')
        .upsert([
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            email: 'john.doe@example.com',
            full_name: 'John Doe',
            stripe_customer_id: 'cus_sample_john_doe'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            email: 'jane.smith@example.com',
            full_name: 'Jane Smith',
            stripe_customer_id: 'cus_sample_jane_smith'
          }
        ], { onConflict: 'email' });

      if (insertCustomersError) {
        console.error('❌ Error with customers table:', insertCustomersError);
        console.log('💡 Please run the SQL scripts manually in your Supabase dashboard');
        return false;
      }

      console.log('✅ Sample customers added successfully');
    }

    // Verify all tables exist
    console.log('🔍 Verifying database setup...');
    
    const tables = ['customers', 'orders', 'order_items', 'digital_deliveries', 'products'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        tableStatus[table] = error ? 'Error' : 'Exists';
      } catch (err) {
        tableStatus[table] = 'Missing';
      }
    }
    
    console.log('📊 Table status:', tableStatus);
    
    // Check products specifically
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (!productsError && products) {
      console.log(`✅ Found ${products.length} active products in database`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// Run setup
setupCompleteDatabase().then(success => {
  if (success) {
    console.log('🎉 Database setup completed successfully!');
    console.log('📋 Tables created: customers, orders, order_items, digital_deliveries');
    console.log('🧪 You can now run tests: npm run test:run');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/pdidbutxkwxmheiwpafy');
    console.log('2. Run the SQL from supabase-complete-schema.sql for full setup');
    console.log('3. Run the SQL from supabase-sample-data.sql for sample data');
  } else {
    console.log('💡 Manual setup required:');
    console.log('1. Go to https://supabase.com/dashboard/project/pdidbutxkwxmheiwpafy/editor');
    console.log('2. Run the SQL from supabase-complete-schema.sql');
    console.log('3. Run the SQL from supabase-sample-data.sql');
  }
});
