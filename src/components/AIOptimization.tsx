import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Target, Clock, Zap, Star, Lock, CheckCircle } from 'lucide-react';
import { generateOptimizationReport, type OptimizationReport, type OptimizationRecommendation } from '../utils/aiOptimization';
import type { TaxCalculationResult, FilingStatus } from '../utils/taxCalculations';
import { formatCurrency } from '../utils/formatters';

interface AIOptimizationProps {
  taxResults: TaxCalculationResult;
  stateCode: string;
  filingStatus: FilingStatus;
  hoursPerWeek: number;
  weeksPerYear: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function AIOptimization({
  taxResults,
  stateCode,
  filingStatus,
  hoursPerWeek,
  weeksPerYear,
  isPremium,
  onUpgrade
}: AIOptimizationProps) {
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isPremium) {
      generateReport();
    }
  }, [taxResults, stateCode, filingStatus, hoursPerWeek, weeksPerYear, isPremium]);

  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const optimizationReport = generateOptimizationReport(
      taxResults,
      stateCode,
      filingStatus,
      hoursPerWeek,
      weeksPerYear
    );

    setReport(optimizationReport);
    setIsGenerating(false);
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const toggleActionItem = (recommendationId: string, actionIndex: number) => {
    const actionKey = `${recommendationId}-${actionIndex}`;
    const newCompleted = new Set(completedActions);

    if (newCompleted.has(actionKey)) {
      newCompleted.delete(actionKey);
    } else {
      newCompleted.add(actionKey);
    }

    setCompletedActions(newCompleted);
  };

  if (!isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-lg border border-purple-200 p-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🤖 AI Income Optimization
          </h3>

          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Get personalized, AI-powered recommendations to maximize your income and minimize taxes.
            Our advanced algorithms analyze your financial profile to identify optimization opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/60 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Income Growth</h4>
              <p className="text-sm text-gray-600">Salary negotiation & side income strategies</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Tax Optimization</h4>
              <p className="text-sm text-gray-600">Advanced deductions & strategic planning</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Action Plans</h4>
              <p className="text-sm text-gray-600">Step-by-step implementation guides</p>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-6 mb-6 max-w-md mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Potential Benefits:</h4>
            <ul className="text-left text-gray-700 space-y-1">
              <li>• 5-15% increase in take-home pay</li>
              <li>• Personalized tax-saving strategies</li>
              <li>• Location optimization recommendations</li>
              <li>• Career growth action plans</li>
            </ul>
          </div>

          <motion.button
            onClick={onUpgrade}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
          >
            <Lock className="w-5 h-5" />
            Unlock AI Optimization
            <Star className="w-5 h-5 text-yellow-300" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: isGenerating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isGenerating ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Income Optimization</h3>
                <p className="text-blue-100">Personalized recommendations to maximize your income</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-yellow-100 font-semibold text-sm">Premium AI</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!report && !isGenerating && (
          <div className="p-6 text-center">
            <motion.button
              onClick={generateReport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              🤖 Generate AI Optimization Report
            </motion.button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">AI is analyzing your financial profile...</h4>
            <p className="text-gray-600">This may take a few seconds</p>
          </div>
        )}

        {/* Summary */}
        {report && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900">Optimization Summary</h4>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
                {formatCurrency(report.totalPotentialSavings)} potential savings
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {report && (
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-gray-900">🎯 Personalized Recommendations</h4>

          <AnimatePresence>
            {report.recommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 ${getPriorityColor(recommendation.priority)} ${
                  expandedCard === recommendation.id ? 'shadow-xl' : 'hover:shadow-lg'
                }`}
                onClick={() => setExpandedCard(expandedCard === recommendation.id ? null : recommendation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{recommendation.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="text-lg font-bold text-gray-900">{recommendation.title}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEffortColor(recommendation.effort)}`}>
                          {recommendation.effort} effort
                        </span>
                        <span className="text-green-600 font-bold">
                          +{formatCurrency(recommendation.potentialSavings)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{recommendation.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCard === recommendation.id ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ↓
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedCard === recommendation.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <h6 className="font-semibold text-gray-900 mb-3">📋 Action Steps:</h6>
                      <div className="space-y-2">
                        {recommendation.actionItems.map((action, actionIndex) => (
                          <motion.div
                            key={actionIndex}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionItem(recommendation.id, actionIndex);
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                                completedActions.has(`${recommendation.id}-${actionIndex}`)
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {completedActions.has(`${recommendation.id}-${actionIndex}`) && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </motion.div>
                            <span className={`text-sm ${
                              completedActions.has(`${recommendation.id}-${actionIndex}`)
                                ? 'text-gray-500 line-through'
                                : 'text-gray-700'
                            }`}>
                              {action}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Progress Tracking */}
      {report && completedActions.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4">🏆 Progress Tracking</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((completedActions.size / (report.recommendations.reduce((sum, rec) => sum + rec.actionItems.length, 0))) * 100, 100)}%`
                }}
              />
            </div>
            <span className="font-semibold text-gray-900">
              {completedActions.size} actions completed
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
