import React, { useState } from 'react';
import { redirectToCheckout } from '../services/stripe';
import { ShoppingCart, CreditCard, Loader2 } from 'lucide-react';

function PaymentButton({ 
  productId, 
  children, 
  className = "", 
  disabled = false,
  variant = "primary"
}) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      await redirectToCheckout(productId);
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = "inline-flex items-center gap-2 font-semibold transition-all duration-200 transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 shadow-lg focus-visible:outline-primary-600",
    secondary: "bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-neutral-50 shadow-lg border border-primary-200 focus-visible:outline-primary-600",
    outline: "border border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 focus-visible:outline-white"
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} mobile-touch-target`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          {children}
        </>
      )}
    </button>
  );
}

export default PaymentButton;
