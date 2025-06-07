import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const affiliateLinks = [
    {
      name: 'TurboTax',
      description: 'Maximize your tax refund',
      url: 'https://sovrn.co/e2mnr96',
      highlighted: true
    },
    {
      name: 'H&R Block',
      description: 'Professional tax preparation',
      url: 'https://sovrn.co/13sowbx',
      highlighted: false
    },
    {
      name: 'Credit Karma Tax',
      description: 'Free tax filing & expert help',
      url: 'https://sovrn.co/6h9aeb3',
      highlighted: false
    },
    {
      name: 'FreeTaxUSA',
      description: 'Affordable federal & state filing',
      url: 'https://sovrn.co/2qdtdcy',
      highlighted: false
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">WageCrunch</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Know your real worth with accurate wage calculations, tax estimates,
              and cost-of-living comparisons across all 50 states.
            </p>


          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#calculator"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Calculator
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  COL Comparison
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to calculator and trigger premium modal
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      // Find and click a premium feature to show modal
                      const premiumButton = document.querySelector('[data-premium-trigger]') as HTMLElement;
                      if (premiumButton) premiumButton.click();
                    }, 500);
                  }}
                >
                  Premium Features
                </a>
              </li>
              <li>
                <button
                  className="text-gray-300 hover:text-white transition-colors text-left"
                  onClick={() => {
                    // Trigger FAQ modal
                    const event = new CustomEvent('openFAQ');
                    window.dispatchEvent(event);
                  }}
                >
                  FAQ
                </button>
              </li>

            </ul>
          </div>


        </div>

        {/* Affiliate Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-semibold mb-4">Recommended Tax Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {affiliateLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-4 rounded-lg border transition-all ${
                  link.highlighted
                    ? 'border-blue-500 bg-blue-50 bg-opacity-10 hover:bg-opacity-20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-white">{link.name}</h5>
                    <p className="text-gray-300 text-sm">{link.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * These are affiliate links. We may receive a commission if you make a purchase,
            at no additional cost to you.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-4 mb-6">
            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important Disclaimer</h4>
            <p className="text-yellow-100 text-sm">
              WageCrunch provides estimates for educational purposes only. Actual tax calculations
              may vary based on individual circumstances, deductions, credits, and changing tax laws.
              Always consult with a qualified tax professional for personalized advice.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {currentYear} WageCrunch. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for workers everywhere
          </p>
        </div>

        {/* Data Sources */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Tax data sourced from IRS and Tax Foundation. Cost of living data from MIT Living Wage Calculator.
            Data updated quarterly.
          </p>
        </div>
      </div>
    </footer>
  );
}
