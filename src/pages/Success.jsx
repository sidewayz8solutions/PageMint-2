import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, ArrowLeft } from 'lucide-react';
import { verifyPayment } from '../services/stripe';

function Success() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      verifyPayment(sessionId)
        .then((data) => {
          setPaymentData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">Payment Verification Failed</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-green-700 mb-8">
            Thank you for your purchase! Your templates are ready for download.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Details</h2>
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{paymentData?.sessionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold">PageMint Template Pack</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Email:</span>
                <span>{paymentData?.customerEmail || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">✅ Completed</span>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-primary-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Download Your Templates</h3>
            <p className="mb-6">
              Your templates are ready! Click the button below to download your complete package.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <Download className="h-5 w-5" />
              Download Templates
            </button>
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Email Confirmation</h4>
            </div>
            <p className="text-blue-700">
              A confirmation email with download links has been sent to your email address.
              Please check your inbox (and spam folder) for the email.
            </p>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@pagemint.com" className="text-primary-600 hover:underline">
                support@pagemint.com
              </a>
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
