import React from 'react';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-red-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-red-500 mb-6">
            <XCircle className="h-20 w-20 mx-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            No worries! Your payment was cancelled and no charges were made to your account.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Why choose PageMint?</h3>
            <ul className="text-left space-y-2 max-w-md mx-auto text-neutral-700">
              <li>• Live demos and previews before you buy</li>
              <li>• Instant download with secure delivery system</li>
              <li>• Lifetime updates and new template releases</li>
              <li>• Professional, conversion-optimized designs</li>
              <li>• Comprehensive setup guides and video tutorials</li>
              <li>• Premium email support from our team</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/#pricing'}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              Try Again
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>
          </div>

          <div className="mt-8 text-sm text-neutral-500">
            <p>Questions? We're here to help at support@pagemint.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
