#!/usr/bin/env node

/**
 * Test Supabase Connection
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

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test products table
    console.log('🛍️ Checking products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (productsError) {
      console.error('❌ Products check failed:', productsError);
      console.log('💡 Please run the SQL setup in your Supabase dashboard');
      return false;
    }
    
    console.log(`✅ Found ${products.length} active products:`);
    products.forEach(product => {
      console.log(`  - ${product.name}: $${product.price}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run test
testConnection().then(success => {
  if (success) {
    console.log('🎉 All tests passed! Your Supabase connection is working.');
    console.log('🧪 You can now run: npm run test:run');
  } else {
    console.log('💡 Setup required - please create the products table in Supabase');
  }
});
