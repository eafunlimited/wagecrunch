import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import ChartsDisplay from './components/ChartsDisplay';
import CostOfLivingComparison from './components/CostOfLivingComparison';
import SavedCalculations from './components/SavedCalculations';
import AIOptimization from './components/AIOptimization';
import PremiumModal from './components/PremiumModal';
import FAQModal from './components/FAQModal';
import Footer from './components/Footer';
import { calculateTotalTax, type FilingStatus, type TaxCalculationResult } from './utils/taxCalculations';
import type { CostOfLivingComparison as COLComparisonType } from './utils/costOfLivingCalculations';
import { exportToCSV, exportToPDF, exportToJSON, generateShareableURL, type ExportData } from './utils/exportUtils';
import stateTaxRates from './data/stateTaxRates.json';
import './App.css';

interface CalculationData {
  hourlyRate?: number;
  annualSalary?: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  state: string;
  filingStatus: FilingStatus;
}

function App() {
  const [calculationResults, setCalculationResults] = useState<TaxCalculationResult | null>(null);
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const [colComparison, setColComparison] = useState<COLComparisonType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // In real app, this would come from auth/subscription state
  const [activeTab, setActiveTab] = useState<'calculator' | 'saved' | 'optimize'>('calculator');

  // Setup FAQ modal event listener
  useEffect(() => {
    const handleOpenFAQ = () => {
      setIsFAQModalOpen(true);
    };

    window.addEventListener('openFAQ', handleOpenFAQ);
    return () => window.removeEventListener('openFAQ', handleOpenFAQ);
  }, []);

  // Load URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const hourlyParam = urlParams.get('hourly');
    const salaryParam = urlParams.get('salary');
    const hoursParam = urlParams.get('hours');
    const weeksParam = urlParams.get('weeks');
    const stateParam = urlParams.get('state');
    const filingParam = urlParams.get('filing');

    // Only proceed if we have the minimum required parameters
    if ((hourlyParam || salaryParam) && stateParam) {
      const params: CalculationData = {
        hourlyRate: hourlyParam ? Number.parseFloat(hourlyParam) : undefined,
        annualSalary: salaryParam ? Number.parseFloat(salaryParam) : undefined,
        hoursPerWeek: hoursParam ? Number.parseFloat(hoursParam) : 40,
        weeksPerYear: weeksParam ? Number.parseFloat(weeksParam) : 52,
        state: stateParam,
        filingStatus: (filingParam as FilingStatus) || 'single'
      };

      handleCalculate(params);
    }
  }, []);

  const handleCalculate = async (data: CalculationData) => {
    setIsCalculating(true);

    try {
      // Determine annual salary
      const annualSalary = data.annualSalary || ((data.hourlyRate || 0) * data.hoursPerWeek * data.weeksPerYear);

      // Calculate taxes
      const results = calculateTotalTax(annualSalary, data.state, data.filingStatus);

      setCalculationResults(results);
      setCalculationData(data);
      setActiveTab('calculator');

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      console.error('Error calculating taxes:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLoadCalculation = (data: Record<string, any>) => {
    // Convert saved data back to form format
    const formData: CalculationData = {
      hourlyRate: data.hourlyRate,
      annualSalary: data.annualSalary || data.grossIncome,
      hoursPerWeek: data.hoursPerWeek || 40,
      weeksPerYear: data.weeksPerYear || 52,
      state: data.state || 'CA',
      filingStatus: data.filingStatus || 'single'
    };

    // Recalculate with loaded data
    handleCalculate(formData);
  };



  const handleCOLComparison = (comparison: COLComparisonType) => {
    setColComparison(comparison);

    // Scroll to charts
    setTimeout(() => {
      document.getElementById('charts')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleExportCSV = () => {
    if (!calculationResults || !calculationData) return;

    const exportData: ExportData = {
      calculationDate: new Date().toISOString(),
      hourlyRate: calculationData.hourlyRate,
      annualSalary: calculationData.annualSalary,
      hoursPerWeek: calculationData.hoursPerWeek,
      weeksPerYear: calculationData.weeksPerYear,
      state: stateTaxRates.states[calculationData.state as keyof typeof stateTaxRates.states].name,
      filingStatus: calculationData.filingStatus,
      taxResults: calculationResults,
      costOfLivingComparison: colComparison || undefined
    };

    exportToCSV(exportData);
  };

  const handleExportPDF = async () => {
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }

    try {
      await exportToPDF('results-display', 'wagecrunch-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleShare = () => {
    if (!calculationData) return;

    const shareUrl = generateShareableURL(calculationData);

    if (navigator.share) {
      navigator.share({
        title: 'WageCrunch - My Salary Calculation',
        text: 'Check out my salary and tax calculation',
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    // In a real app, this would integrate with Stripe
    console.log('Upgrading to plan:', plan);

    // For demo purposes, simulate upgrade
    setIsPremium(true);
    setIsPremiumModalOpen(false);

    // In real implementation:
    // const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);
    // const response = await fetch('/api/stripe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ plan })
    // });
    // const session = await response.json();
    // stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Calculator Section */}
      <section id="calculator" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculate Your Real Take-Home Pay
            </h2>
            <p className="text-lg text-gray-600">
              Get accurate salary and tax calculations with real-time data
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mt-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 inline-flex">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'calculator'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calculator
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'saved'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {!isPremium && <span className="text-yellow-400">🔒</span>}
                  Saved
                </button>
                <button
                  onClick={() => setActiveTab('optimize')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'optimize'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {!isPremium && <span className="text-yellow-400">🔒</span>}
                  🤖 AI Optimize
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'calculator' && (
            <CalculatorForm
              onCalculate={handleCalculate}
              isLoading={isCalculating}
            />
          )}

          {activeTab === 'saved' && (
            <SavedCalculations
              currentCalculation={calculationResults && calculationData ? {
                data: {
                  hourlyRate: calculationData.hourlyRate,
                  annualSalary: calculationData.annualSalary,
                  hoursPerWeek: calculationData.hoursPerWeek,
                  weeksPerYear: calculationData.weeksPerYear,
                  state: calculationData.state,
                  filingStatus: calculationData.filingStatus,
                  grossIncome: calculationResults.grossIncome,
                  netIncome: calculationResults.netIncome,
                  totalTax: calculationResults.totalTax,
                  effectiveTaxRate: calculationResults.effectiveTaxRate
                }
              } : undefined}
              isPremium={isPremium}
              onUpgrade={() => setIsPremiumModalOpen(true)}
              onLoadCalculation={handleLoadCalculation}
            />
          )}

          {activeTab === 'optimize' && (
            calculationResults && calculationData ? (
              <AIOptimization
                taxResults={calculationResults}
                stateCode={calculationData.state}
                filingStatus={calculationData.filingStatus}
                hoursPerWeek={calculationData.hoursPerWeek}
                weeksPerYear={calculationData.weeksPerYear}
                isPremium={isPremium}
                onUpgrade={() => setIsPremiumModalOpen(true)}
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete a calculation first</h4>
                <p className="text-gray-600 mb-4">AI optimization requires calculation data to generate recommendations.</p>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Calculator
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* Results Section */}
      {calculationResults && calculationData && (
        <section id="results" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Tax Breakdown
              </h2>
              <p className="text-lg text-gray-600">
                Here's where your money goes in {stateTaxRates.states[calculationData.state as keyof typeof stateTaxRates.states].name}
              </p>
            </motion.div>

            <ResultsDisplay
              results={calculationResults}
              hourlyRate={calculationData.hourlyRate}
              annualSalary={calculationData.annualSalary}
              state={stateTaxRates.states[calculationData.state as keyof typeof stateTaxRates.states].name}
              isPremium={isPremium}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              onShare={handleShare}
              onUpgrade={() => setIsPremiumModalOpen(true)}
            />
          </div>
        </section>
      )}

      {/* Cost of Living Comparison Section */}
      <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CostOfLivingComparison
            onCompare={handleCOLComparison}
            isPremium={isPremium}
            onUpgrade={() => setIsPremiumModalOpen(true)}
          />
        </div>
      </section>

      {/* Charts Section */}
      {calculationResults && (
        <section id="charts" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visual Breakdown
              </h2>
              <p className="text-lg text-gray-600">
                Interactive charts to help you understand your finances
              </p>
            </motion.div>

            <ChartsDisplay
              taxResults={calculationResults}
              costOfLivingComparison={colComparison || undefined}
            />
          </div>
        </section>
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={handleUpgrade}
      />

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
