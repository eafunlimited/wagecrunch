import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "How accurate are the tax calculations?",
      answer: "Our calculations use current 2024 federal and state tax brackets, but are estimates for educational purposes only. Actual tax amounts may vary based on deductions, credits, and individual circumstances. Always consult a tax professional for personalized advice."
    },
    {
      question: "Can I cancel my Premium subscription anytime?",
      answer: "Yes, you can cancel your Premium subscription at any time through your account settings or by contacting us. Your subscription will remain active until the end of your current billing period. Please note: We do not offer refunds for partial months or unused time."
    },
    {
      question: "What's the difference between free and Premium?",
      answer: "Free users get basic salary calculations and federal tax estimates. Premium users get unlimited cost-of-living comparisons, state tax calculations, PDF/JSON exports, saved calculations (up to 10), and AI-powered income optimization recommendations."
    },
    {
      question: "How often is the tax and cost-of-living data updated?",
      answer: "Tax brackets are updated annually when the IRS releases new rates (usually in November). Cost-of-living data is updated quarterly. State tax rates are updated as changes are announced by state governments."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes. We use industry-standard encryption and secure payment processing through Stripe. We don't store sensitive financial information, and calculations are performed locally in your browser when possible."
    },
    {
      question: "Do you offer refunds?",
      answer: "No, we do not offer refunds for Premium subscriptions. You can cancel anytime to prevent future charges, but we don't provide refunds for time already paid. Please try our free features first to ensure WageCrunch meets your needs."
    },
    {
      question: "Can I use WageCrunch for business or multiple employees?",
      answer: "WageCrunch is designed for individual use. Each Premium subscription covers one user. The tool is perfect for personal salary planning and individual financial decisions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure Stripe payment processor. We don't currently accept PayPal or other payment methods."
    },

    {
      question: "Can I use WageCrunch for tax filing?",
      answer: "WageCrunch is a planning and estimation tool, not a tax filing service. For actual tax filing, we recommend our partner services like TurboTax, H&R Block, or other professional tax preparers."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

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
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
                  <p className="text-blue-100">
                    Everything you need to know about WageCrunch
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <motion.div
                      key={`faq-${index}-${item.question.slice(0, 20)}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {item.question}
                        </span>
                        {openItem === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {openItem === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                              <p className="text-gray-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Important Notes
                  </h3>
                  <p className="text-blue-700">
                    WageCrunch is designed to be self-service with clear, easy-to-use features. All calculations and features are automated for your convenience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
