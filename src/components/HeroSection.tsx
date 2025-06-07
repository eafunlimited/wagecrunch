import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, MapPin } from 'lucide-react';

export default function HeroSection() {

  const features = [
    {
      icon: Calculator,
      title: 'Accurate Calculations',
      description: 'Real-time tax calculations using current federal and state tax brackets'
    },
    {
      icon: MapPin,
      title: 'Cost of Living Comparison',
      description: 'Compare purchasing power across all 50 states with detailed breakdowns'
    },
    {
      icon: TrendingUp,
      title: 'Smart Insights',
      description: 'Get actionable recommendations to optimize your income and taxes'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-blue-600">WageCrunch:</span>
              <br />
              Know Your Real Worth
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Calculate salary, taxes, and cost-of-living differences in one click.
              Make informed career decisions with real-time data.
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">50</p>
              <p className="text-gray-600">States Covered</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Real-Time</p>
              <p className="text-gray-600">Tax Calculations</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Instant</p>
              <p className="text-gray-600">Results & Reports</p>
            </div>
          </motion.div>



          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>


        </div>
      </div>
    </div>
  );
}
