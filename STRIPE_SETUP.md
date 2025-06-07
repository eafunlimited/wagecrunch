# Stripe Payment Setup Guide

## 🔐 Security Notice
Your Stripe secret key has been configured in the `.env` file. **Never commit this file to version control** as it contains sensitive credentials.

## 📋 Next Steps to Complete Stripe Integration

### 1. Get Your Stripe Public Key
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Update the `STRIPE_PUBLIC_KEY` in your `.env` file

### 2. Create Stripe Products and Prices
Run these commands in your terminal to create the subscription plans:

```bash
# Install Stripe CLI if you haven't already
# Visit: https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Create Monthly Plan Product
stripe products create \
  --name="WageCrunch Premium Monthly" \
  --description="Monthly subscription to WageCrunch Premium features"

# Create Monthly Price (replace prod_xxx with the product ID from above)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=499 \
  --currency=usd \
  --recurring-interval=month \
  --nickname="Monthly Plan"

# Create Yearly Plan Product
stripe products create \
  --name="WageCrunch Premium Yearly" \
  --description="Yearly subscription to WageCrunch Premium features (save 2 months!)"

# Create Yearly Price (replace prod_xxx with the product ID from above)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=4999 \
  --currency=usd \
  --recurring-interval=year \
  --nickname="Yearly Plan"
```

### 3. Update Price IDs
After creating the prices, update the `STRIPE_PLANS` object in `src/api/stripe.js`:

```javascript
const STRIPE_PLANS = {
  monthly: 'price_1QXxxxxxxxxxxxx', // Your actual monthly price ID
  yearly: 'price_1QXxxxxxxxxxxxx'   // Your actual yearly price ID
};
```

### 4. Test the Integration

#### Test Cards for Development:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires SCA**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

### 5. Webhook Setup (Optional for Demo)
For production, you'll need to handle webhooks for subscription events:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

### 6. Environment Variables Summary
Your `.env` file should contain:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_public_key_here

# Application Settings
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
```

## 🚀 Production Deployment

### Before Going Live:
1. **Switch to Live Mode**: Replace test keys with live keys (`sk_live_` and `pk_live_`)
2. **Create Live Products**: Repeat the product/price creation for live mode
3. **Enable Webhooks**: Set up webhook endpoints for your production domain
4. **Test Thoroughly**: Use real payment methods in test mode first

### Security Checklist:
- ✅ Secret keys in environment variables only
- ✅ `.env` file in `.gitignore`
- ✅ Use HTTPS in production
- ✅ Validate webhook signatures
- ✅ Implement proper error handling

## 💡 Tips for Success

### Optimize Conversion:
- **Clear Pricing**: $4.99/month, $49.99/year clearly displayed
- **Value Proposition**: Highlight premium features prominently
- **Social Proof**: Consider adding testimonials or usage stats
- **Free Trial**: Consider offering a 7-day free trial

### Monitor Performance:
- Track conversion rates from free to premium
- Monitor failed payments and subscription cancellations
- Use Stripe's analytics dashboard for insights

## 🆘 Troubleshooting

### Common Issues:
1. **"No such price"**: Make sure price IDs are correct in `STRIPE_PLANS`
2. **"Invalid API key"**: Check that your secret key is properly set in `.env`
3. **CORS errors**: Ensure your domain is properly configured in Stripe settings

### Testing Checklist:
- [ ] Monthly subscription signup works
- [ ] Yearly subscription signup works
- [ ] Payment failure handling works
- [ ] Subscription cancellation works (if implemented)
- [ ] Webhook events are received (if implemented)

---

🎉 **Your WageCrunch app is now ready for premium subscriptions!**

With proper Stripe integration, you can start generating recurring revenue from your beautiful wage calculator application.
