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
    priceId: 'price_REPLACE_WITH_YOUR_STARTER_PACK_PRICE_ID', // Get from Stripe Dashboard
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
    priceId: 'price_REPLACE_WITH_YOUR_PRO_PACK_PRICE_ID', // Get from Stripe Dashboard
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

    // Call Supabase Edge Function for checkout session creation
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        priceId: product.priceId,
        customerEmail,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`
      })
    });
    
    const mockSession = {
      id: 'cs_test_mock123',
      url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}#fidkdWxOYHwnPyd1blpxYHZxWjA0S2xWZU5sanRGdGhWSVVuQU9WaUhqSEhKNUt%2FajdxNG9pNFR8azdWMGRJVEx0TjZ2MjdsaVV1a2pucGtGUnFOUUhxUTxkcm5Kc1JJdWx2`
    };

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    // In production, you would do:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     priceId: product.priceId,
    //     customerEmail,
    //     successUrl: window.location.origin + '/success',
    //     cancelUrl: window.location.origin + '/cancel'
    //   })
    // });
    // const session = await response.json();

    const session = await response.json();
    return {
      id: session.sessionId,
      url: session.url
    };
    return mockSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (productId, customerEmail = null) => {
  try {
    const session = await createCheckoutSession(productId, customerEmail);
    // For demo purposes, show a modal instead of redirecting
    const product = PRODUCTS[productId];
    
    const proceedToStripe = confirm(
      `Ready to purchase ${product.name} for $${product.price}?\n\n` +
      `This will redirect you to Stripe Checkout (secure payment processing).\n\n` +
      `Note: This is currently in TEST MODE for demonstration.`
    );
    
    if (proceedToStripe) {
      // In production, redirect to Stripe Checkout:
      // window.location.href = session.url;
      
      // For demo, show success simulation
      alert(
        `🎉 Demo Mode: Checkout simulation successful!\n\n` +
        `In production, you would be redirected to Stripe Checkout:\n` +
        `${session.url}\n\n` +
        `Product: ${product.name}\n` +
        `Price: $${product.price}\n\n` +
        `To enable real payments:\n` +
        `1. Add your Stripe API keys to .env.local\n` +
        `2. Create products in Stripe Dashboard\n` +
        `3. Set up backend API endpoint\n` +
        `4. Deploy with HTTPS`
      );
    }
    
    return session;
  } catch (error) {
    alert(`Payment Error: ${error.message}\n\nPlease try again or contact support.`);
    throw error;
  }
};

// Verify payment success (call this on success page)
export const verifyPayment = async (sessionId) => {
  try {
    // In production, verify with your backend
    // const response = await fetch(`/api/verify-payment/${sessionId}`);
    // return await response.json();
    // For demo, simulate successful payment verification
    const mockPayment = {
      success: true,
      sessionId,
      customerEmail: 'customer@example.com',
      productId: 'pro-pack'
    };
    return mockPayment;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
};

    // Redirect to Stripe Checkout
    // window.location.href = session.url;
    // console.error('Checkout error:', error);
    // alert(`Payment Error: ${error.message}\n\nPlease check your internet connection and try again.`);
    // Call Supabase to get order details
    // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    // const response = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    //   },
    //   body: JSON.stringify({ sessionId })
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return { success: false, error: errorData.error || 'Payment verification failed' };
    // }

    // return await response.json();
export default stripePromise;