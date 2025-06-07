# Create Yearly Stripe Plan Guide

## 🎯 Current Status
✅ **Monthly Plan**: Configured with price ID `price_1RWgQFRDTOOH8GN28PCqXWTB` ($4.99/month)
⏳ **Yearly Plan**: Not created yet (will be $49.99/year)

## 📋 Create Your Yearly Plan

### Option 1: Using Stripe Dashboard (Recommended)
1. Go to your [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Click "Create product"
3. Fill in the details:
   - **Name**: `WageCrunch Premium Yearly`
   - **Description**: `Yearly subscription to WageCrunch Premium features - Save 2 months!`
4. Click "Create product"
5. In the pricing section:
   - **Price**: `$49.99`
   - **Billing period**: `Yearly`
   - **Currency**: `USD`
6. Click "Add price"
7. **Copy the price ID** (starts with `price_1...`)

### Option 2: Using Stripe CLI
```bash
# Make sure you're logged into Stripe CLI
stripe login

# Create the yearly product
stripe products create \
  --name="WageCrunch Premium Yearly" \
  --description="Yearly subscription to WageCrunch Premium features - Save 2 months!"

# Create the yearly price (replace prod_xxx with the product ID from above)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=4999 \
  --currency=usd \
  --recurring-interval=year \
  --nickname="Yearly Plan"
```

## 🔧 Update Your Code

Once you have the yearly price ID, update these files:

### 1. Update `src/api/stripe.js`
```javascript
const STRIPE_PLANS = {
  monthly: 'price_1RWgQFRDTOOH8GN28PCqXWTB', // $4.99/month plan
  yearly: 'price_1YourYearlyPriceIDHere'      // $49.99/year plan
};
```

### 2. Re-enable Yearly Button in `src/components/PremiumModal.tsx`
Change this:
```javascript
<motion.button
  disabled={true}
  className="w-full p-6 border-2 border-gray-300 bg-gray-50 rounded-lg text-left relative opacity-60 cursor-not-allowed"
>
```

To this:
```javascript
<motion.button
  onClick={() => onUpgrade('yearly')}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full p-6 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left relative"
>
```

And change the badge from "COMING SOON" back to "BEST VALUE":
```javascript
<span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
  BEST VALUE
</span>
```

## 🧪 Test Your Plans

### Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`

### Test Both Plans:
1. Test monthly subscription ($4.99/month)
2. Test yearly subscription ($49.99/year)
3. Verify webhook events (if configured)

## 💡 Pro Tips

### Pricing Psychology:
- **Monthly**: $4.99/month = $59.88/year
- **Yearly**: $49.99/year (saves $9.89 = ~17% discount)
- Market this as "Save 2 months" or "17% off"

### Conversion Optimization:
- Highlight the yearly savings prominently
- Consider offering a 7-day free trial
- Show "Most Popular" badge on the plan you want to promote

---

🎉 **Once you create the yearly plan, WageCrunch will have full subscription options ready!**
