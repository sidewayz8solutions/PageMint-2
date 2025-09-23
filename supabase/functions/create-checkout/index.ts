import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckoutRequest {
  priceId: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe with secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { priceId, customerEmail, successUrl, cancelUrl }: CheckoutRequest = await req.json()

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Price ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get product details from Supabase
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('stripe_price_id', priceId)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create or get customer
    let customerId = null
    if (customerEmail) {
      const { data: existingCustomer } = await supabaseClient
        .from('customers')
        .select('stripe_customer_id')
        .eq('email', customerEmail)
        .single()

      if (existingCustomer?.stripe_customer_id) {
        customerId = existingCustomer.stripe_customer_id
      } else {
        // Create new Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            source: 'pagemint_website'
          }
        })

        customerId = stripeCustomer.id

        // Save customer to database
        await supabaseClient
          .from('customers')
          .upsert({
            email: customerEmail,
            stripe_customer_id: customerId
          })
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${Deno.env.get('SITE_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${Deno.env.get('SITE_URL')}/cancel`,
      metadata: {
        product_id: product.id,
        customer_email: customerEmail || '',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI'],
      },
    })

    // Create pending order in database
    if (session.id) {
      const { data: customer } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('email', customerEmail || '')
        .single()

      await supabaseClient
        .from('orders')
        .insert({
          customer_id: customer?.id,
          stripe_session_id: session.id,
          status: 'pending',
          total_amount_cents: product.price_cents,
          currency: 'usd',
          metadata: {
            product_name: product.name,
            stripe_price_id: priceId
          }
        })

      // Log checkout creation
      console.log(`Checkout session created: ${session.id} for product: ${product.name}`)
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
        productName: product.name,
        amount: product.price_cents
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Checkout creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
