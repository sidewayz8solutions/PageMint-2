# PageMint - Premium SaaS Landing Page Templates

Professional SaaS landing page templates for founders who want to launch fast without compromising on quality.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 💳 Payment Integration

This project uses Stripe for secure payment processing.

### Setup Instructions

1. **Get Stripe API Keys**
   - Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
   - Get your test keys from API Keys section
   - For production, switch to live mode

2. **Configure Environment Variables**
   ```bash
   # Copy .env.local and add your Stripe keys
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   VITE_STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```

3. **Create Products in Stripe**
   - Go to Stripe Dashboard > Products
   - Create products for "Starter Pack" ($29) and "Pro Pack" ($59)
   - Copy the Price IDs and update `src/services/stripe.js`

4. **Backend Setup (Required for Production)**
   ```javascript
   // Example backend endpoint: /api/create-checkout-session
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       price: priceId,
       quantity: 1,
     }],
     mode: 'payment',
     success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${domain}/cancel`,
   });
   ```

### Current Status

- ✅ Stripe SDK integrated
- ✅ Checkout flow implemented
- ✅ Payment buttons functional
- ✅ Success/cancel pages ready
- ⏳ Demo mode (simulated payments)

### Going Live

1. Replace test keys with live keys
2. Set up backend API endpoints
3. Update product Price IDs
4. Deploy with HTTPS
5. Test thoroughly

## 🛡️ Security

- All payments processed by Stripe (PCI compliant)
- No card details stored locally
- HTTPS required for production
- Environment variables for sensitive data

## 🎯 Features

- **5 Unique Templates** - Minimalist, Gradient, Dark Tech, Playful, Professional
- **Stripe Integration** - Secure payment processing
- **Mobile-First Design** - Responsive across all devices
- **SEO Optimized** - Meta tags and structured data
- **Performance** - Optimized for speed and Core Web Vitals

## 📁 Project Structure

```
src/
├── components/         # React components
├── services/          # Payment and API services
├── styles/           # CSS and styling
└── assets/          # Images and static files

public/
├── templates/       # HTML template demos
└── assets/         # Public assets
```

## 🔧 Customization

All templates are built with TailwindCSS for easy customization:

- Colors: Update `tailwind.config.js`
- Content: Edit component files
- Images: Replace in `public/assets/`
- Fonts: Update in `src/index.css`

## 📞 Support

- Email: support@pagemint.com
- Documentation: Coming soon
- Issues: GitHub Issues

---

Built with ❤️ by [Biela.dev](https://biela.dev) | Powered by [TeachMeCode® Institute](https://teachmecode.ae)
