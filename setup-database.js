#!/usr/bin/env node

/**
 * Database Setup Script for PageMint
 * This script creates the required tables and inserts sample data
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
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up PageMint database...');
  
  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📋 Products table does not exist, creating...');
      
      // Create products table with sample data
      const { error: createError } = await supabase.rpc('create_products_table');
      
      if (createError) {
        console.log('⚠️  Could not create table via RPC, table might already exist or need manual setup');
        console.log('Please run the SQL commands from supabase-setup.sql in your Supabase dashboard');
      }
    }
    
    // Try to insert sample products
    console.log('📦 Inserting sample products...');
    const { data: insertData, error: insertError } = await supabase
      .from('products')
      .upsert([
        {
          id: 1,
          name: 'Starter Pack',
          description: 'Perfect for personal projects and learning',
          price: 29.00,
          price_id: 'price_REPLACE_WITH_YOUR_STARTER_PACK_PRICE_ID',
          is_active: true,
          features: ['1 Premium Template', 'Source Code', 'Documentation', 'Personal License']
        },
        {
          id: 2,
          name: 'Pro Pack',
          description: 'Everything you need for professional projects',
          price: 59.00,
          price_id: 'price_REPLACE_WITH_YOUR_PRO_PACK_PRICE_ID',
          is_active: true,
          features: ['5 Premium Templates', 'Source Code', 'Documentation', 'Commercial License', 'Priority Support', 'Future Updates']
        }
      ], { onConflict: 'id' });
    
    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      console.log('📋 Please manually create the products table using supabase-setup.sql');
    } else {
      console.log('✅ Sample products inserted successfully');
    }
    
    // Verify setup
    console.log('🔍 Verifying database setup...');
    const { data: products, error: verifyError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError);
      return false;
    }
    
    console.log(`✅ Database setup complete! Found ${products.length} active products:`);
    products.forEach(product => {
      console.log(`  - ${product.name}: $${product.price}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// Run setup
setupDatabase().then(success => {
  if (success) {
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } else {
    console.log('💡 Manual setup required - please run the SQL from supabase-setup.sql');
    process.exit(1);
  }
});
