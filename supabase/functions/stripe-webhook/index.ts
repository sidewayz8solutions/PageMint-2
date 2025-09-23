import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )

    console.log(`Received webhook: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleSuccessfulPayment(session)
        break
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log(`Processing successful payment for session: ${session.id}`)

    // Update order status
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent as string
      })
      .eq('stripe_session_id', session.id)
      .select('*, customers(*)')
      .single()

    if (orderError) {
      console.error('Error updating order:', orderError)
      throw new Error(`Order update failed: ${orderError.message}`)
    }

    // Get product details
    const { data: product } = await supabaseClient
      .from('products')
      .select('*')
      .eq('stripe_price_id', session.metadata?.stripe_price_id || '')
      .single()

    if (!product) {
      throw new Error('Product not found for delivery')
    }

    // Create digital delivery record
    const deliveryToken = generateSecureToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry

    const { data: delivery, error: deliveryError } = await supabaseClient
      .from('digital_deliveries')
      .insert({
        order_id: order.id,
        customer_email: order.customers?.email || session.customer_details?.email || '',
        download_token: deliveryToken,
        files_metadata: product.metadata?.download_files || [],
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (deliveryError) {
      console.error('Error creating delivery:', deliveryError)
      throw new Error(`Delivery creation failed: ${deliveryError.message}`)
    }

    // Send delivery email
    await sendDeliveryEmail({
      customerEmail: order.customers?.email || session.customer_details?.email || '',
      productName: product.name,
      downloadToken: deliveryToken,
      filesMetadata: product.metadata?.download_files || [],
      expiresAt: expiresAt
    })

    console.log(`Digital product delivered successfully for order: ${order.id}`)

  } catch (error) {
    console.error('Error in handleSuccessfulPayment:', error)
    
    // Log the error for customer service
    await supabaseClient
      .from('email_logs')
      .insert({
        order_id: null,
        email_type: 'delivery_error',
        recipient_email: session.customer_details?.email || 'unknown',
        subject: 'Delivery Error',
        status: 'failed',
        error_message: error.message
      })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment Intent succeeded: ${paymentIntent.id}`)
  
  // Update order with payment intent
  await supabaseClient
    .from('orders')
    .update({
      stripe_payment_intent_id: paymentIntent.id,
      status: 'paid'
    })
    .eq('stripe_session_id', paymentIntent.metadata?.session_id || '')
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment Intent failed: ${paymentIntent.id}`)
  
  // Update order status
  await supabaseClient
    .from('orders')
    .update({
      status: 'failed',
      stripe_payment_intent_id: paymentIntent.id
    })
    .eq('stripe_session_id', paymentIntent.metadata?.session_id || '')
}

async function sendDeliveryEmail(params: {
  customerEmail: string;
  productName: string;
  downloadToken: string;
  filesMetadata: any[];
  expiresAt: Date;
}) {
  try {
    const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-delivery-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify(params)
    })

    if (!emailResponse.ok) {
      throw new Error(`Email service error: ${emailResponse.statusText}`)
    }

    console.log(`Delivery email sent to: ${params.customerEmail}`)

  } catch (error) {
    console.error('Error sending delivery email:', error)
    
    // Log email error
    await supabaseClient
      .from('email_logs')
      .insert({
        email_type: 'delivery',
        recipient_email: params.customerEmail,
        subject: `Your ${params.productName} Templates Are Ready!`,
        status: 'failed',
        error_message: error.message
      })
  }
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result + '_' + Date.now()
}
