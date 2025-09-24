import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Product configurations with Stripe Price IDs
export const PRODUCTS = {
  STARTER_PACK: {
    id: 'starter-pack',
    name: 'Starter Pack',
    description: 'Perfect for indie hackers - 2 Template Variations',
    price: 29,
    priceId: 'price_1SAkfSEem1Sx15X5sFuYkKiq', // Starter Pack Price ID
    features: [
      '2 Template Variations',
      'HTML + TailwindCSS', 
      'Mobile Responsive',
      'Basic SEO Setup',
      'Personal Use License Only'
    ]
  },
  PRO_PACK: {
    id: 'pro-pack', 
    name: 'Pro Pack',
    description: 'Best value for agencies - All 5 Template Variations',
    price: 59,
    priceId: 'price_1SAkfTEem1Sx15X53c4wWPAJ', // Pro Pack Price ID
    features: [
      'All 5 Template Variations',
      'HTML + TailwindCSS',
      'Mobile Responsive', 
      'Advanced SEO Setup',
      'Customization Guide',
      'Personal Use License Only'
    ]
  }
};

// Create Stripe Checkout Session
export const createCheckoutSession = async (productId, customerEmail = null) => {
  try {
    const product = PRODUCTS[productId];
    if (!product) {
      throw new Error('Invalid product ID');
    }

    // Call Vercel API function for checkout session creation
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: product.priceId,
        customerEmail,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cancel`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const session = await response.json();
    return {
      id: session.sessionId,
      url: session.url
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (productId, customerEmail = null) => {
  try {
    const session = await createCheckoutSession(productId, customerEmail);
    const product = PRODUCTS[productId];

    // Redirect to Stripe Checkout
    window.location.href = session.url;

    return session;
  } catch (error) {
    alert(`Payment Error: ${error.message}\n\nPlease try again or contact support.`);
    throw error;
  }
};

// Verify payment success (call this on success page)
export const verifyPayment = async (sessionId) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
};

export default stripePromise;