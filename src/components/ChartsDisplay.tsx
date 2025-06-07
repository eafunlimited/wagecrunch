import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import type { TaxCalculationResult } from '../utils/taxCalculations';
import type { CostOfLivingComparison } from '../utils/costOfLivingCalculations';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface ChartsDisplayProps {
  taxResults: TaxCalculationResult;
  costOfLivingComparison?: CostOfLivingComparison;
}

export default function ChartsDisplay({ taxResults, costOfLivingComparison }: ChartsDisplayProps) {
  const chartRef = useRef(null);

  // Tax Breakdown Pie Chart Data
  const taxPieData = {
    labels: ['Federal Tax', 'State Tax', 'Social Security', 'Medicare', 'Take-Home Pay'],
    datasets: [
      {
        data: [
          taxResults.federalTax,
          taxResults.stateTax,
          taxResults.socialSecurity,
          taxResults.medicare,
          taxResults.netIncome
        ],
        backgroundColor: [
          '#EF4444', // Red for Federal Tax
          '#F97316', // Orange for State Tax
          '#EAB308', // Yellow for Social Security
          '#A855F7', // Purple for Medicare
          '#10B981'  // Green for Take-Home
        ],
        borderColor: [
          '#DC2626',
          '#EA580C',
          '#CA8A04',
          '#9333EA',
          '#059669'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const taxPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: number; label: string }) => {
            const value = context.parsed;
            const percentage = ((value / taxResults.grossIncome) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Cost of Living Comparison Bar Chart Data
  const colBarData = costOfLivingComparison ? {
    labels: [costOfLivingComparison.currentState, costOfLivingComparison.targetState],
    datasets: [
      {
        label: 'Cost of Living Index',
        data: [costOfLivingComparison.currentIndex, costOfLivingComparison.targetIndex],
        backgroundColor: ['#3B82F6', '#EF4444'],
        borderColor: ['#2563EB', '#DC2626'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  } : null;

  const colBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            return `Cost Index: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost of Living Index'
        }
      },
      x: {
        title: {
          display: true,
          text: 'States'
        }
      }
    }
  };

  // Salary Comparison Bar Chart Data
  const salaryComparisonData = costOfLivingComparison ? {
    labels: ['Current Salary', 'Equivalent Salary'],
    datasets: [
      {
        label: 'Salary Amount',
        data: [costOfLivingComparison.currentSalary, costOfLivingComparison.equivalentSalary],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  } : null;

  const salaryComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Annual Salary'
        },
        ticks: {
          callback: (value: string | number) => typeof value === 'number' ? formatCurrency(value, 0) : value
        }
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Tax Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Tax Breakdown</h3>
        <div className="h-96">
          <Pie data={taxPieData} options={taxPieOptions} />
        </div>
      </motion.div>

      {/* Cost of Living Comparison Charts */}
      {costOfLivingComparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Cost of Living Index</h3>
            <div className="h-64">
              {colBarData && <Bar data={colBarData} options={colBarOptions} />}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Salary Comparison</h3>
            <div className="h-64">
              {salaryComparisonData && <Bar data={salaryComparisonData} options={salaryComparisonOptions} />}
            </div>

            {/* Purchasing Power Indicator */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Purchasing Power Change:</span>
                <span className={`text-lg font-bold ${
                  costOfLivingComparison.purchasingPowerChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {costOfLivingComparison.purchasingPowerChange >= 0 ? '+' : ''}
                  {costOfLivingComparison.purchasingPowerChange.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {costOfLivingComparison.purchasingPowerChange >= 0
                  ? 'Your money goes further in the target state'
                  : 'Your money has less purchasing power in the target state'
                }
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tax Efficiency Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tax Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Consider Tax-Advantaged Accounts:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 401(k) contributions can reduce taxable income</li>
              <li>• HSA contributions are triple tax-advantaged</li>
              <li>• Traditional IRA may provide tax deductions</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Location Strategies:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Consider states with no income tax</li>
              <li>• Factor in total cost of living, not just taxes</li>
              <li>• Research local tax incentives and credits</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
