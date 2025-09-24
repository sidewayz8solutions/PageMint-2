import React from 'react';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <XCircle className="h-24 w-24 text-orange-600 mx-auto" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-orange-700 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Information Box */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What happened?</h2>
            <div className="text-left space-y-4">
              <p className="text-gray-600">
                • You cancelled the payment process before completion
              </p>
              <p className="text-gray-600">
                • Your payment method was not charged
              </p>
              <p className="text-gray-600">
                • You can try again anytime with the same or different payment method
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              Try Again
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-white text-primary-600 border border-primary-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Having trouble with payment? We're here to help!
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                Email us at{' '}
                <a href="mailto:support@pagemint.com" className="text-primary-600 hover:underline">
                  support@pagemint.com
                </a>
              </p>
              <p className="text-gray-600">
                Or check our{' '}
                <a href="/#faq" className="text-primary-600 hover:underline">
                  FAQ section
                </a>{' '}
                for common questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cancel;
