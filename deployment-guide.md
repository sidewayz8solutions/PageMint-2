# PageMint Deployment Guide 🚀

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables
# - Deploy!
```

### Option 2: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-key
   VITE_STRIPE_SECRET_KEY=sk_live_your-live-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   VITE_APP_URL=https://your-domain.vercel.app
   VITE_SUCCESS_URL=https://your-domain.vercel.app/success
   VITE_CANCEL_URL=https://your-domain.vercel.app/cancel
   SMTP_HOST=smtp.resend.com
   SMTP_USER=resend
   SMTP_PASS=your-resend-api-key
   FROM_EMAIL=support@your-domain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your live URL: `https://your-project.vercel.app`

## Alternative Platforms

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Manual Hosting
```bash
# Build for production
npm run build

# Upload the 'dist' folder to any static hosting:
# - GitHub Pages
# - AWS S3 + CloudFront
# - DigitalOcean Spaces
# - Traditional web hosting
```

## Pre-Deployment Checklist ✅

### 1. Production Environment Variables
- [ ] Update Stripe keys to LIVE mode (pk_live_, sk_live_)
- [ ] Set correct Supabase production URLs
- [ ] Configure production domain URLs
- [ ] Set up email service (Resend/SendGrid)

### 2. Stripe Configuration
- [ ] Create live products in Stripe Dashboard
- [ ] Update Price IDs in codebase
- [ ] Set up webhook endpoints
- [ ] Test payment flow in live mode

### 3. Supabase Configuration
- [ ] Database migrations applied
- [ ] Row Level Security enabled
- [ ] Production API keys configured
- [ ] Edge Functions deployed

### 4. Domain & SSL
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] HTTPS redirects enabled

## Post-Deployment Testing

### 1. Core Functionality
- [ ] Homepage loads correctly
- [ ] Template previews work
- [ ] Navigation functions
- [ ] Mobile responsiveness

### 2. Payment Flow
- [ ] Stripe checkout opens
- [ ] Payments process successfully
- [ ] Success page displays
- [ ] Email delivery works
- [ ] File downloads function

### 3. Database Operations
- [ ] Order creation
- [ ] Customer records
- [ ] Digital delivery tracking
- [ ] Analytics logging

## Monitoring & Maintenance

### Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track conversion rates
- Monitor error rates

### Backup Strategy
- Supabase automatic backups
- Regular database exports
- Code repository backups
- Environment variable backups

## Custom Domain Setup (Optional)

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS** 
   ```
   CNAME: www -> your-project.vercel.app
   A: @ -> 76.76.19.61 (Vercel IP)
   ```
3. **Add to Vercel**
   - Project Settings > Domains
   - Add your custom domain
   - Verify DNS propagation

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **PageMint Support**: support@pagemint.com

---

## 🎉 Ready to Launch!

Your PageMint application is now production-ready and deployed. Users can:
- Browse templates
- Make secure payments
- Download digital products
- Receive email confirmations

**Live URL**: https://your-project.vercel.app
**Admin Panel**: Access via Supabase Dashboard
**Analytics**: Track via Vercel Analytics

Happy launching! 🚀
