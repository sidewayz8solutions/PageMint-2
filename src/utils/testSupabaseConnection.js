import { supabase } from '../lib/supabase.js';

export async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    return { success: true, message: 'Connected successfully' };
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { success: false, error: error.message };
  }
}

export async function checkDatabaseTables() {
  try {
    console.log('📋 Checking database tables...');
    
    // Check if tables exist by querying them
    const tables = ['customers', 'products', 'orders', 'order_items', 'digital_deliveries'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results[table] = error ? 'Missing' : 'Exists';
      } catch (err) {
        results[table] = 'Missing';
      }
    }
    
    console.log('📊 Table status:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Table check failed:', error);
    return {};
  }
}

export async function checkProducts() {
  try {
    console.log('🛍️ Checking products...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ Products check failed:', error);
      return { success: false, error: error.message };
    }
    
    // Handle case where products is null/undefined
    const productList = products || [];
    console.log(`✅ Found ${productList.length} active products:`, productList);
    return { success: true, products: productList };
    
  } catch (error) {
    console.error('❌ Products check failed:', error);
    return { success: false, error: error.message };
  }
}
