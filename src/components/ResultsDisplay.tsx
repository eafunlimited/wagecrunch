import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Download, Share2, Lock, ExternalLink } from 'lucide-react';
import type { TaxCalculationResult } from '../utils/taxCalculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { getRelevantAffiliateLinks, formatAffiliateUrl } from '../utils/affiliateLinks';

interface ResultsDisplayProps {
  results: TaxCalculationResult;
  hourlyRate?: number;
  annualSalary?: number;
  state: string;
  isPremium?: boolean;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onShare?: () => void;
  onUpgrade?: () => void;
}

export default function ResultsDisplay({
  results,
  hourlyRate,
  annualSalary,
  state,
  isPremium = false,
  onExportCSV,
  onExportPDF,
  onShare,
  onUpgrade
}: ResultsDisplayProps) {
  const taxBreakdown = [
    { label: 'Federal Tax', amount: results.federalTax, color: 'bg-red-500' },
    { label: 'State Tax', amount: results.stateTax, color: 'bg-orange-500' },
    { label: 'Social Security', amount: results.socialSecurity, color: 'bg-yellow-500' },
    { label: 'Medicare', amount: results.medicare, color: 'bg-purple-500' },
    { label: 'Take-Home', amount: results.netIncome, color: 'bg-green-500' }
  ];

  const taxPercentages = taxBreakdown.map(item => ({
    ...item,
    percentage: (item.amount / results.grossIncome) * 100
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
      id="results-display"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gross Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(results.grossIncome)}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(results.totalTax)}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Take-Home Pay</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(results.netIncome)}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Effective Tax Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(results.effectiveTaxRate)}
              </p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <TrendingDown className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tax Breakdown</h3>

        {/* Visual Tax Breakdown Bar */}
        <div className="mb-6">
          <div className="flex rounded-lg overflow-hidden h-8">
            {taxPercentages.map((item, index) => (
              <div
                key={item.label}
                className={`${item.color} transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.label}: ${formatCurrency(item.amount)} (${formatPercentage(item.percentage)})`}
              />
            ))}
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxBreakdown.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`} />
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                <p className="text-sm text-gray-500">
                  {formatPercentage((item.amount / results.grossIncome) * 100)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Periodic Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Take-Home Pay by Period</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Annual</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(results.netIncome)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Monthly</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(results.netIncome / 12)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Bi-weekly</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(results.netIncome / 26)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Weekly</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(results.netIncome / 52)}</p>
          </div>
        </div>
      </div>

      {/* Tax Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Maximize Your Refund</h3>

        {(() => {
          const relevantLinks = getRelevantAffiliateLinks(results.grossIncome, results.totalTax, state, 'tax-prep');

          if (relevantLinks.length === 0) return null;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {relevantLinks.slice(0, 2).map((link) => (
                <a
                  key={link.name}
                  href={formatAffiliateUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900 group-hover:text-blue-700">
                        {link.name}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">{link.description}</p>
                      {results.totalTax > 5000 && (
                        <p className="text-xs text-green-600 mt-2">
                          ✨ Potential savings based on your tax amount
                        </p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                  </div>
                </a>
              ))}
            </div>
          );
        })()}

        <p className="text-xs text-gray-500">
          * These are affiliate links. We may earn a commission at no cost to you.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Export & Share</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={onExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          {isPremium ? (
            <button
              onClick={onExportPDF}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          ) : (
            <button
              onClick={onUpgrade}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed relative group"
            >
              <Lock className="w-4 h-4" />
              Export PDF
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Premium Feature
              </div>
            </button>
          )}

          {isPremium ? (
            <button
              onClick={() => {
                const exportData = {
                  calculationDate: new Date().toISOString(),
                  hourlyRate,
                  annualSalary,
                  state,
                  taxResults: results
                };
                const jsonContent = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonContent], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'wagecrunch-data.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          ) : (
            <button
              onClick={onUpgrade}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed relative group"
            >
              <Lock className="w-4 h-4" />
              Export JSON
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Premium Feature
              </div>
            </button>
          )}

          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </button>
        </div>
      </div>
    </motion.div>
  );
}
