# WageCrunch 💰

**Know Your Real Worth** - A comprehensive salary and tax calculator with cost-of-living comparisons across all 50 US states.

## 🚀 Live Demo

Visit the live application: [https://wagecrunch.netlify.app](https://wagecrunch.netlify.app)

## ✨ Features

### Core Functionality
- **Salary ↔ Hourly Conversion**: Seamlessly convert between hourly rates and annual salaries
- **Accurate Tax Calculations**: Real-time federal and state tax calculations using current 2024 tax brackets
- **Take-Home Pay Analysis**: See exactly where your money goes with detailed breakdowns
- **Cost of Living Comparisons**: Compare purchasing power across all 50 states
- **Interactive Charts**: Visual breakdowns of tax allocations and COL differences

### Premium Features
- **Unlimited COL Comparisons**: Compare any states without restrictions
- **Advanced Export Options**: Download PDF reports and detailed CSV/JSON exports
- **Saved Calculations**: Store up to 10 calculations for future reference
- **AI-Powered Insights**: Get personalized recommendations to optimize your income

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Full keyboard navigation and screen reader support
- **Fast Performance**: Optimized for speed with code splitting and lazy loading
- **Share Results**: Generate shareable links to your calculations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Chart.js** with React Chart.js 2 for data visualizations
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend & Services
- **Netlify** for hosting and deployment
- **Stripe** for payment processing (Premium subscriptions)
- **SendGrid** for email notifications
- **Serverless Functions** for API endpoints

### Data Sources
- **IRS Tax Brackets** (2024) - Federal tax calculations
- **Tax Foundation** - State tax rates and information
- **MIT Living Wage Calculator** - Cost of living indices
- **Department of Labor** - Minimum wage data

## 🏃‍♂️ Quick Start

### Prerequisites
- **Node.js** 16+ or **Bun** runtime
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wagecrunch.git
   cd wagecrunch
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values:
   ```env
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLIC_KEY=pk_test_your_key_here

   # Email Service (SendGrid)
   SENDGRID_API_KEY=SG_your_api_key_here

   # Google AdSense (Optional - for future use)
   ADSENSE_CLIENT_ID=ca-pub-your_id_here

   # Application Settings
   NODE_ENV=development
   VITE_APP_URL=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
wagecrunch/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CalculatorForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── ChartsDisplay.tsx
│   │   ├── CostOfLivingComparison.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PremiumModal.tsx
│   │   └── Footer.tsx
│   ├── utils/               # Helper functions
│   │   ├── taxCalculations.ts
│   │   ├── costOfLivingCalculations.ts
│   │   ├── exportUtils.ts
│   │   ├── formatters.ts
│   │   └── affiliateLinks.ts
│   ├── data/                # Static data files
│   │   ├── federalTaxBrackets.json
│   │   ├── stateTaxRates.json
│   │   └── costOfLiving.json
│   ├── api/                 # Serverless functions
│   │   ├── stripe.js
│   │   ├── sendEmail.js
│   │   └── fetchDataCron.js
│   └── styles/              # Global styles
│       └── App.css
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
npm run dev

# Building
bun run build        # Build for production
npm run build

# Preview
bun run preview      # Preview production build
npm run preview

# Code Quality
bun run lint         # Run linter
npm run lint

bun run format       # Format code with Prettier
npm run format
```

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement Changes**
   - Add components in `src/components/`
   - Add utilities in `src/utils/`
   - Update data files in `src/data/` if needed

3. **Test Your Changes**
   ```bash
   bun run dev
   # Test in browser
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 💰 Monetization

### Revenue Streams

1. **Premium Subscriptions**
   - Monthly: $5/month
   - Yearly: $49/year (2 months free)
   - Managed via Stripe

2. **Affiliate Marketing**
   - TurboTax partnership
   - H&R Block integration
   - Financial services recommendations

3. **Future: Google AdSense**
   - Display ads for free tier users
   - Requires AdSense approval

### Freemium Model

**Free Tier:**
- Basic wage ↔ salary converter
- Federal tax calculations
- Single COL comparison per month
- CSV export

**Premium Tier:**
- Unlimited COL comparisons
- State tax calculations
- PDF report generation
- Saved calculation history
- AI-powered optimization tips

## 🚀 Deployment

### Automatic Deployment (Recommended)

1. **Connect to Netlify**
   - Fork this repository
   - Connect your GitHub account to Netlify
   - Import the project

2. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.example`

3. **Deploy**
   - Netlify will automatically deploy on every push to main

### Manual Deployment

1. **Build the Project**
   ```bash
   bun run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Environment Variables for Production

```env
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLIC_KEY=pk_live_your_live_key
SENDGRID_API_KEY=SG_your_live_api_key
```

## 📊 Analytics & Monitoring

### Performance Monitoring
- **Core Web Vitals** tracking
- **Lighthouse** performance scores
- **Bundle size** optimization

### User Analytics
- **Plausible Analytics** (privacy-focused)
- **Custom events** for key actions:
  - Calculator usage
  - Premium upgrades
  - Export downloads
  - Affiliate link clicks

## 🔐 Security & Privacy

### Security Measures
- **HTTPS** enforced
- **CORS** properly configured
- **Rate limiting** on API endpoints
- **Input validation** and sanitization

### Privacy Features
- **Minimal data collection**
- **No tracking without consent**
- **Local storage** for user preferences
- **GDPR compliant** data handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Have an idea? We'd love to hear it!
- 🔧 **Code Contributions**: Submit a pull request
- 📖 **Documentation**: Help improve our docs
- 🎨 **Design**: Suggest UI/UX improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IRS** for tax bracket data
- **Tax Foundation** for state tax information
- **MIT** for cost of living research
- **Same.dev** for development platform
- **Netlify** for hosting and deployment

## 📞 Support

- 📧 **Email**: hello@wagecrunch.com
- 🐦 **Twitter**: [@wagecrunch](https://twitter.com/wagecrunch)
- 💼 **LinkedIn**: [WageCrunch](https://linkedin.com/company/wagecrunch)
- 🌐 **Website**: [wagecrunch.com](https://wagecrunch.com)

## ⚠️ Disclaimer

WageCrunch provides estimates for educational purposes only. Actual tax calculations may vary based on individual circumstances, deductions, credits, and changing tax laws. Always consult with a qualified tax professional for personalized advice.

---

**Made with ❤️ for workers everywhere**

*Helping you make informed career decisions, one calculation at a time.*
