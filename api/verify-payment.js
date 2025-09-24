import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment not completed' 
      });
    }

    // Get customer details
    const customer = session.customer_details || {};
    
    return res.status(200).json({
      success: true,
      sessionId: session.id,
      customerEmail: customer.email,
      customerName: customer.name,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to verify payment',
      details: error.message 
    });
  }
}
