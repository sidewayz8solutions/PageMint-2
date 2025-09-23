import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, checkDatabaseTables, checkProducts } from '../utils/testSupabaseConnection';
import { CheckCircle, XCircle, Loader2, Database, Package } from 'lucide-react';

function DatabaseStatus() {
  const [connectionStatus, setConnectionStatus] = useState({ loading: true });
  const [tableStatus, setTableStatus] = useState({});
  const [productsStatus, setProductsStatus] = useState({ loading: true });

  useEffect(() => {
    async function checkConnection() {
      console.log('�� Starting Supabase connection checks...');
      
      // Test connection
      const connResult = await testSupabaseConnection();
      setConnectionStatus(connResult);
      
      if (connResult.success) {
        // Check tables
        const tables = await checkDatabaseTables();
        setTableStatus(tables);
        
        // Check products
        const products = await checkProducts();
        setProductsStatus(products);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md z-50">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-600" />
        Supabase Connection Status
      </h3>
      
      {/* Connection Status */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {connectionStatus.loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : connectionStatus.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            Database Connection: {connectionStatus.loading ? 'Testing...' : connectionStatus.success ? 'Connected' : 'Failed'}
          </span>
        </div>
        
        {/* Table Status */}
        {Object.keys(tableStatus).length > 0 && (
          <div className="ml-6 space-y-1">
            {Object.entries(tableStatus).map(([table, status]) => (
              <div key={table} className="flex items-center gap-2 text-xs">
                {status === 'Exists' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="capitalize">{table}: {status}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Products Status */}
        <div className="flex items-center gap-2">
          {productsStatus.loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : productsStatus.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm flex items-center gap-1">
            <Package className="h-3 w-3" />
            Products: {productsStatus.loading ? 'Checking...' : productsStatus.success ? `${productsStatus.products?.length || 0} found` : 'None'}
          </span>
        </div>
      </div>
      
      {/* Error Display */}
      {(connectionStatus.error || productsStatus.error) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs">
          <p className="text-red-800 font-semibold">Connection Issues:</p>
          {connectionStatus.error && <p className="text-red-700">• {connectionStatus.error}</p>}
          {productsStatus.error && <p className="text-red-700">• {productsStatus.error}</p>}
        </div>
      )}
      
      {/* Success Info */}
      {connectionStatus.success && productsStatus.success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
          <p className="text-green-800 font-semibold">✅ Database Ready!</p>
          <p className="text-green-700">• Connection established</p>
          <p className="text-green-700">• Tables created</p>
          <p className="text-green-700">• Products loaded</p>
        </div>
      )}
    </div>
  );
}

export default DatabaseStatus;
