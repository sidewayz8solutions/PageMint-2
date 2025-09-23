import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowRight, Home, Mail, FileText, Clock } from 'lucide-react';
import { verifyPayment, PRODUCTS } from '../services/stripe';
import { deliverDigitalProduct, fileDelivery } from '../services/fileDelivery';
function PaymentSuccess() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  const [deliveryData, setDeliveryData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Store session for tracking
      sessionStorage.setItem('pagemint_session', sessionId);
      
       // Verify payment and deliver digital product
      const initializeDelivery = async () => {
        try {
          console.log('🎉 Payment success! Starting delivery process...');
          const paymentResult = await verifyPayment(sessionId);
          setPaymentData(paymentResult);
          setVerified(paymentResult.success);
          
          if (paymentResult.success) {
            console.log('✅ Payment verified, delivering product...');
            // Automatically deliver the digital product
            const deliveryResult = await deliverDigitalProduct(
              sessionId, 
              paymentResult.customerEmail || 'customer@example.com'
            );
            console.log('📦 Delivery result:', deliveryResult);
            setDeliveryData(deliveryResult);
            setEmailSent(deliveryResult.emailDelivery?.success || false);
          }
        } catch (error) {
          console.error('Delivery initialization error:', error);
          // Show user-friendly error message
          setDeliveryData({
            success: false,
            message: 'We encountered an issue delivering your templates. Please contact support@pagemint.com with your order details.',
            error: error.message
          });
        }
      };
      
      initializeDelivery()
       .catch(error => {
          console.error('Verification error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.warn('⚠️ No session_id found in URL');
      setLoading(false);
    }
  }, []);

  const handleDownload = async (fileUrl, fileName) => {
    setDownloading(true);
    try {
      console.log(`🔽 Downloading: ${fileName} from ${fileUrl}`);
      const result = await fileDelivery.downloadFile(fileUrl, fileName);
      if (result.success) {
        // Success notification is handled by the service
        console.log(`✅ Download started: ${fileName}`);
      } else {
        console.error(`❌ Download failed: ${fileName}`, result);
        alert(`❌ Download failed: ${fileName}\n\nPlease try the direct link or contact support@pagemint.com`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try the email link or contact support.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!deliveryData?.downloadUrls) return;
    
    setDownloading(true);
    try {
      console.log(`�� Starting batch download of ${deliveryData.downloadUrls.length} files...`);
      const batchResult = await fileDelivery.downloadAllFiles(deliveryData.downloadUrls);
      
      console.log('📊 Batch download results:', batchResult);
      
      // The notification is handled by the service, but we can show additional info
      if (batchResult.successCount < batchResult.totalFiles) {
        alert(`Downloaded ${batchResult.successCount}/${batchResult.totalFiles} files.\n\nIf any downloads failed, please try individual downloads or check your email for backup links.`);
      }
    } catch (error) {
      console.error('Batch download error:', error);
      alert('Some downloads may have failed. Check your email for backup links.');
    } finally {
      setDownloading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  const product = paymentData?.productId ? PRODUCTS[paymentData.productId] : PRODUCTS.PRO_PACK;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-green-500 mb-6">
            <CheckCircle className="h-20 w-20 mx-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            Thank you for purchasing {product.name}! Your templates are ready for download.
          </p>

          <div className="bg-primary-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">What you get:</h3>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download Section */}
          {deliveryData?.success && (
            <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Your Templates Are Ready!
              </h3>
              
              {/* Quick Download Instructions */}
              <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">📋 Quick Start:</h4>
                <ol className="text-sm text-green-700 space-y-1">
                  {deliveryData.downloadInstructions?.slice(0, 3).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div className="space-y-3 mb-6">
                {deliveryData.downloadUrls.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {file.type === 'template' && <FileText className="h-5 w-5 text-green-600" />}
                        {file.type === 'guide' && <FileText className="h-5 w-5 text-blue-600" />}
                        {file.type === 'assets' && <div className="h-5 w-5 bg-purple-600 rounded"></div>}
                        {file.type === 'design' && <div className="h-5 w-5 bg-pink-600 rounded"></div>}
                        {!file.type && <FileText className="h-5 w-5 text-green-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{file.description}</div>
                        <div className="text-sm text-neutral-500">{file.size}</div>
                        {file.type && (
                          <div className="text-xs text-neutral-400 capitalize">{file.type} file</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file.secureUrl, file.name)}
                        disabled={downloading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        title="Secure download with token"
                      >
                        {downloading ? 'Downloading...' : 'Download'}
                      </button>
                      {file.directUrl && (
                        <a
                          href={file.directUrl}
                          download={file.name}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                          title="Direct download link (backup)"
                        >
                          Direct
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleDownloadAll}
                disabled={downloading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Downloading All Files...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download All Templates
                  </>
                )}
              </button>
              
              {/* Additional Info */}
              <div className="mt-4 text-center text-sm text-green-700">
                <p className="mb-2">
                  💾 Files expire in 24 hours • 📧 Backup links sent to your email
                </p>
                <details className="text-left">
                  <summary className="cursor-pointer font-medium">Show all setup instructions</summary>
                  <ol className="mt-2 space-y-1 text-xs">
                    {deliveryData.downloadInstructions?.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </details>
              </div>
            </div>
          )}

          {/* Delivery Error State */}
          {deliveryData && !deliveryData.success && (
            <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                ⚠️ Delivery Issue
              </h3>
              <p className="text-red-700 mb-4">{deliveryData.message}</p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">What to do:</h4>
                <ol className="text-sm text-red-700 space-y-1">
                  <li>1. Check your email for delivery confirmation</li>
                  <li>2. Wait a few minutes and refresh this page</li>
                  <li>3. Contact support@pagemint.com with your order details</li>
                  <li>4. Include this session ID: {new URLSearchParams(window.location.search).get('session_id')}</li>
                </ol>
              </div>
            </div>
          )}
          {/* Email Delivery Status */}
          {emailSent && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Sent Successfully!
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                We've sent download links to <strong>{paymentData?.customerEmail}</strong>
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Clock className="h-4 w-4" />
                Links expire in 24 hours
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              <Download className="h-5 w-5" />
              Download Templates
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </button>
            {deliveryData?.success ? (
              <button 
                onClick={handleDownloadAll}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                {downloading ? 'Downloading...' : 'Download All Templates'}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold">
                <Download className="h-5 w-5" />
                Preparing Downloads...
              </div>
            )}
          </div>

          <div className="mt-8 text-sm text-neutral-500">
            <p>A confirmation email has been sent to {paymentData?.customerEmail || 'your email'}.</p>
            <p className="mt-2">
              Download links expire in 24 hours. Need help? Contact us at{' '}
              <a href="mailto:support@pagemint.com" className="text-primary-600 hover:underline">
                support@pagemint.com
              </a>
              {' '}or visit our{' '}
              <a href="mailto:support@pagemint.com?subject=Setup%20Help%20Request" className="text-primary-600 hover:underline">
                setup assistance
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;