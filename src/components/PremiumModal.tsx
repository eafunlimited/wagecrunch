import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Download, BarChart3, Save } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

export default function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  const features = [
    {
      icon: BarChart3,
      title: 'Unlimited COL Comparisons',
      description: 'Compare cost of living between any states without limits'
    },
    {
      icon: Download,
      title: 'PDF & Advanced Exports',
      description: 'Download beautiful PDF reports and detailed CSV/JSON exports'
    },
    {
      icon: Save,
      title: 'Save Calculations',
      description: 'Store up to 10 saved calculations for future reference'
    },
    {
      icon: Star,
      title: 'AI Income Optimization',
      description: 'Get personalized recommendations to maximize your take-home pay'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
                  <p className="text-blue-100">
                    Unlock advanced features and unlimited calculations
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    What you'll get with Premium:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                    Choose Your Plan:
                  </h3>

                  {/* Monthly Plan */}
                  <motion.button
                    onClick={() => onUpgrade('monthly')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Monthly Plan</h4>
                        <p className="text-gray-600">Perfect for occasional use</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$4.99</p>
                        <p className="text-sm text-gray-500">/month</p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Yearly Plan */}
                  <motion.button
                    onClick={() => onUpgrade('yearly')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left relative"
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                        BEST VALUE
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Yearly Plan</h4>
                        <p className="text-gray-600">Save 18% with annual billing</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">2 months free!</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$49.99</p>
                        <p className="text-sm text-gray-500">/year</p>
                        <p className="text-xs text-green-600">~$4.17/month</p>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Free Features */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Free features you'll keep:</h4>
                  <div className="space-y-2">
                    {[
                      'Basic wage ↔ salary converter',
                      'Federal tax calculations',
                      'Single COL comparison per month',
                      'CSV export'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    ✅ Cancel anytime • 💳 Secure payment via Stripe • 🚫 No refunds
                  </p>

                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
