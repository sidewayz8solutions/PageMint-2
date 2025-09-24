import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log('🚀 Setting up Stripe products...');

    // Create Starter Pack Product
    const starterProduct = await stripe.products.create({
      name: 'PageMint Starter Pack',
      description: 'Perfect for indie hackers - 2 Template Variations with HTML + TailwindCSS',
      images: ['https://your-domain.com/images/starter-pack.jpg'], // Replace with actual image
      metadata: {
        type: 'template_pack',
        templates_count: '2',
        license: 'personal'
      }
    });

    const starterPrice = await stripe.prices.create({
      unit_amount: 2900, // $29.00 in cents
      currency: 'usd',
      product: starterProduct.id,
      metadata: {
        pack_type: 'starter'
      }
    });

    // Create Pro Pack Product
    const proProduct = await stripe.products.create({
      name: 'PageMint Pro Pack',
      description: 'Best value for agencies - All 5 Template Variations with advanced features',
      images: ['https://your-domain.com/images/pro-pack.jpg'], // Replace with actual image
      metadata: {
        type: 'template_pack',
        templates_count: '5',
        license: 'personal'
      }
    });

    const proPrice = await stripe.prices.create({
      unit_amount: 5900, // $59.00 in cents
      currency: 'usd',
      product: proProduct.id,
      metadata: {
        pack_type: 'pro'
      }
    });

    console.log('✅ Products created successfully!');
    console.log('\n📋 Copy these Price IDs to your stripe.js file:');
    console.log(`STARTER_PACK priceId: "${starterPrice.id}"`);
    console.log(`PRO_PACK priceId: "${proPrice.id}"`);
    
    console.log('\n🔗 Product URLs:');
    console.log(`Starter Pack: https://dashboard.stripe.com/products/${starterProduct.id}`);
    console.log(`Pro Pack: https://dashboard.stripe.com/products/${proProduct.id}`);

    return {
      starterPack: {
        productId: starterProduct.id,
        priceId: starterPrice.id
      },
      proPack: {
        productId: proProduct.id,
        priceId: proPrice.id
      }
    };
  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error);
    throw error;
  }
}

// Run the setup if this file is executed directly
setupStripeProducts()
  .then((products) => {
    console.log('\n🎉 Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });

export default setupStripeProducts;
