#!/usr/bin/env node

/**
 * Test Complete Database Schema
 * This script tests all tables and relationships
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteDatabase() {
  console.log('🧪 Testing complete PageMint database schema...');
  
  const results = {
    products: { status: 'unknown', count: 0, data: [] },
    customers: { status: 'unknown', count: 0, data: [] },
    orders: { status: 'unknown', count: 0, data: [] },
    order_items: { status: 'unknown', count: 0, data: [] },
    digital_deliveries: { status: 'unknown', count: 0, data: [] }
  };

  try {
    // Test products table
    console.log('🛍️  Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      results.products.status = 'error';
      console.error('❌ Products error:', productsError);
    } else {
      results.products.status = 'success';
      results.products.count = products.length;
      results.products.data = products;
      console.log(`✅ Products: ${products.length} found`);
    }

    // Test customers table
    console.log('👥 Testing customers table...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*');
    
    if (customersError) {
      results.customers.status = 'error';
      console.error('❌ Customers error:', customersError);
    } else {
      results.customers.status = 'success';
      results.customers.count = customers.length;
      results.customers.data = customers;
      console.log(`✅ Customers: ${customers.length} found`);
    }

    // Test orders table
    console.log('📋 Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');
    
    if (ordersError) {
      results.orders.status = 'error';
      console.error('❌ Orders error:', ordersError);
    } else {
      results.orders.status = 'success';
      results.orders.count = orders.length;
      results.orders.data = orders;
      console.log(`✅ Orders: ${orders.length} found`);
    }

    // Test order_items table
    console.log('📦 Testing order_items table...');
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*');
    
    if (orderItemsError) {
      results.order_items.status = 'error';
      console.error('❌ Order items error:', orderItemsError);
    } else {
      results.order_items.status = 'success';
      results.order_items.count = orderItems.length;
      results.order_items.data = orderItems;
      console.log(`✅ Order Items: ${orderItems.length} found`);
    }

    // Test digital_deliveries table
    console.log('💾 Testing digital_deliveries table...');
    const { data: deliveries, error: deliveriesError } = await supabase
      .from('digital_deliveries')
      .select('*');
    
    if (deliveriesError) {
      results.digital_deliveries.status = 'error';
      console.error('❌ Digital deliveries error:', deliveriesError);
    } else {
      results.digital_deliveries.status = 'success';
      results.digital_deliveries.count = deliveries.length;
      results.digital_deliveries.data = deliveries;
      console.log(`✅ Digital Deliveries: ${deliveries.length} found`);
    }

    // Test relationships with JOIN query
    console.log('🔗 Testing table relationships...');
    const { data: joinData, error: joinError } = await supabase
      .from('orders')
      .select(`
        *,
        customers(full_name, email),
        order_items(*, products(name, price)),
        order_items(digital_deliveries(*))
      `);
    
    if (joinError) {
      console.error('❌ Relationship test error:', joinError);
    } else {
      console.log(`✅ Relationships: Successfully joined ${joinData.length} orders with related data`);
    }

    // Summary
    console.log('\n📊 Database Schema Summary:');
    console.log('================================');
    
    Object.entries(results).forEach(([table, result]) => {
      const status = result.status === 'success' ? '✅' : 
                    result.status === 'error' ? '❌' : '❓';
      console.log(`${status} ${table}: ${result.count} records`);
    });

    const allTablesWorking = Object.values(results).every(r => r.status === 'success');
    
    if (allTablesWorking) {
      console.log('\n🎉 All database tables are working correctly!');
      
      // Show sample data
      if (results.products.count > 0) {
        console.log('\n🛍️  Available Products:');
        results.products.data.forEach(product => {
          console.log(`  - ${product.name}: $${product.price}`);
        });
      }
      
      if (results.customers.count > 0) {
        console.log('\n👥 Sample Customers:');
        results.customers.data.slice(0, 3).forEach(customer => {
          console.log(`  - ${customer.full_name} (${customer.email})`);
        });
      }
      
      return true;
    } else {
      console.log('\n⚠️  Some tables need to be created. Please run the SQL scripts.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Run test
testCompleteDatabase().then(success => {
  if (success) {
    console.log('\n🚀 Your PageMint database is fully set up and ready!');
    console.log('🧪 You can now run: npm run test:run');
  } else {
    console.log('\n💡 Setup required:');
    console.log('1. Go to https://supabase.com/dashboard/project/pdidbutxkwxmheiwpafy/editor');
    console.log('2. Run supabase-complete-schema.sql');
    console.log('3. Run supabase-sample-data.sql');
  }
});
