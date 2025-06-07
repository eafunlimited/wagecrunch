import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import stateTaxRates from '../data/stateTaxRates.json';
import { calculateCostOfLivingAdjustment, type CostOfLivingComparison } from '../utils/costOfLivingCalculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface COLFormData {
  currentState: string;
  targetState: string;
  currentSalary: number;
}

interface CostOfLivingComparisonProps {
  onCompare: (comparison: CostOfLivingComparison) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export default function CostOfLivingComparisonComponent({
  onCompare,
  isPremium = false,
  onUpgrade
}: CostOfLivingComparisonProps) {
  const [comparison, setComparison] = useState<CostOfLivingComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<COLFormData>({
    defaultValues: {
      currentState: 'CA',
      targetState: 'TX',
      currentSalary: 75000
    }
  });

  const states = Object.entries(stateTaxRates.states).map(([code, data]) => ({
    code,
    name: data.name
  }));

  const handleCompare = async (data: COLFormData) => {
    if (!isPremium) {
      onUpgrade?.();
      return;
    }

    setIsLoading(true);
    try {
      const result = calculateCostOfLivingAdjustment(
        data.currentState,
        data.targetState,
        data.currentSalary
      );
      setComparison(result);
      onCompare(result);
    } catch (error) {
      console.error('Error calculating cost of living adjustment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Cost of Living Comparison</h2>
        <p className="text-lg text-gray-600">
          See how your salary translates across different states
        </p>
      </div>

      {/* Comparison Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <form onSubmit={handleSubmit(handleCompare)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Current State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Current State
              </label>
              <select
                {...register('currentState', { required: 'Current state is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.currentState && (
                <p className="text-red-500 text-sm mt-1">{errors.currentState.message}</p>
              )}
            </div>

            {/* Target State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Target State
              </label>
              <select
                {...register('targetState', { required: 'Target state is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.targetState && (
                <p className="text-red-500 text-sm mt-1">{errors.targetState.message}</p>
              )}
            </div>

            {/* Current Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Annual Salary
              </label>
              <input
                type="number"
                {...register('currentSalary', {
                  required: 'Current salary is required',
                  min: { value: 1, message: 'Salary must be greater than 0' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="75,000"
              />
              {errors.currentSalary && (
                <p className="text-red-500 text-sm mt-1">{errors.currentSalary.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isPremium ? 1.02 : 1 }}
              whileTap={{ scale: isPremium ? 0.98 : 1 }}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 ${
                isPremium
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              {!isPremium && <span className="text-yellow-300">🔒</span>}
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  Compare States
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>

          {!isPremium && (
            <div className="text-center p-4 bg-yellow-50 border-2 border-black rounded-lg">
              <p className="text-black font-medium mb-2">
                🔒 Premium Feature
              </p>
              <p className="text-black text-sm mb-3">
                Unlock unlimited cost of living comparisons with our Premium plan
              </p>
              <button
                type="button"
                onClick={onUpgrade}
                data-premium-trigger
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Comparison Results</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Current Salary</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(comparison.currentSalary)}
                  </p>
                  <p className="text-xs text-blue-600">{comparison.currentState}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Equivalent Salary</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(comparison.equivalentSalary)}
                  </p>
                  <p className="text-xs text-green-600">{comparison.targetState}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${
              comparison.costDifference >= 0
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    comparison.costDifference >= 0 ? 'text-red-700' : 'text-green-700'
                  }`}>
                    Cost Difference
                  </p>
                  <p className={`text-lg font-bold ${
                    comparison.costDifference >= 0 ? 'text-red-900' : 'text-green-900'
                  }`}>
                    {comparison.costDifference >= 0 ? '+' : ''}
                    {formatCurrency(comparison.costDifference)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  comparison.costDifference >= 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {comparison.costDifference >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${
              comparison.purchasingPowerChange >= 0
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    comparison.purchasingPowerChange >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Purchasing Power
                  </p>
                  <p className={`text-lg font-bold ${
                    comparison.purchasingPowerChange >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {comparison.purchasingPowerChange >= 0 ? '+' : ''}
                    {formatPercentage(comparison.purchasingPowerChange)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  comparison.purchasingPowerChange >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {comparison.purchasingPowerChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
            <p className="text-gray-700">
              To maintain the same standard of living in <strong>{comparison.targetState}</strong> as you have in{' '}
              <strong>{comparison.currentState}</strong>, you would need to earn{' '}
              <strong>{formatCurrency(comparison.equivalentSalary)}</strong> annually.
              {comparison.purchasingPowerChange >= 0 ? (
                <span className="text-green-700">
                  {' '}This represents a <strong>{formatPercentage(comparison.purchasingPowerChange)}</strong> improvement in your purchasing power.
                </span>
              ) : (
                <span className="text-red-700">
                  {' '}This represents a <strong>{formatPercentage(Math.abs(comparison.purchasingPowerChange))}</strong> decrease in your purchasing power.
                </span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
