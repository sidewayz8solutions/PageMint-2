#!/usr/bin/env node

/**
 * Database Setup Script for PageMint (Admin Mode)
 * This script uses the service role key to create tables
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
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Setting up PageMint database with admin privileges...');
  
  try {
    // Create products table using SQL
    console.log('📋 Creating products table...');
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          price_id VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          features JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createError) {
      console.log('⚠️  RPC method not available, trying direct table creation...');
    }

    // Try to insert sample products directly
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
      console.log('📋 Please manually create the products table using the Supabase dashboard');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/pdidbutxkwxmheiwpafy/editor');
      return false;
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
    console.log('🧪 You can now run tests: npm run test:run');
    process.exit(0);
  } else {
    console.log('💡 Manual setup required:');
    console.log('1. Go to https://supabase.com/dashboard/project/pdidbutxkwxmheiwpafy/editor');
    console.log('2. Run the SQL from supabase-setup.sql');
    process.exit(1);
  }
});
