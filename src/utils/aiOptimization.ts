import type { TaxCalculationResult, FilingStatus } from './taxCalculations';
import stateTaxRates from '../data/stateTaxRates.json';
import { getCostOfLivingIndex } from './costOfLivingCalculations';

export interface OptimizationRecommendation {
  id: string;
  category: 'tax_strategy' | 'location' | 'income' | 'deductions' | 'timing';
  title: string;
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
  icon: string;
}

export interface OptimizationReport {
  totalPotentialSavings: number;
  recommendations: OptimizationRecommendation[];
  summary: string;
  generatedAt: string;
}

export function generateOptimizationReport(
  results: TaxCalculationResult,
  stateCode: string,
  filingStatus: FilingStatus,
  hoursPerWeek: number,
  weeksPerYear: number
): OptimizationReport {
  const recommendations: OptimizationRecommendation[] = [];

  // Tax Strategy Recommendations
  recommendations.push(...generateTaxStrategyRecommendations(results, filingStatus));

  // Location Optimization
  recommendations.push(...generateLocationRecommendations(results, stateCode));

  // Income Optimization
  recommendations.push(...generateIncomeRecommendations(results, hoursPerWeek, weeksPerYear));

  // Deduction Optimization
  recommendations.push(...generateDeductionRecommendations(results, filingStatus));

  // Timing Optimization
  recommendations.push(...generateTimingRecommendations(results));

  // Sort by priority and potential savings
  recommendations.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.potentialSavings - a.potentialSavings;
  });

  const totalPotentialSavings = recommendations.reduce(
    (sum, rec) => sum + rec.potentialSavings,
    0
  );

  const summary = generateSummary(results, totalPotentialSavings, recommendations);

  return {
    totalPotentialSavings,
    recommendations: recommendations.slice(0, 8), // Top 8 recommendations
    summary,
    generatedAt: new Date().toISOString()
  };
}

function generateTaxStrategyRecommendations(
  results: TaxCalculationResult,
  filingStatus: FilingStatus
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // 401(k) contribution recommendation
  const maxContribution = 23000; // 2024 limit
  const currentContribution = 0; // Assume no current contribution
  const potential401kSavings = Math.min(results.grossIncome * 0.15, maxContribution) * 0.22; // Assume 22% tax bracket

  if (potential401kSavings > 1000) {
    recommendations.push({
      id: '401k-optimization',
      category: 'tax_strategy',
      title: 'Maximize 401(k) Contributions',
      description: 'Increase your 401(k) contributions to reduce taxable income and build retirement wealth.',
      potentialSavings: potential401kSavings,
      effort: 'low',
      priority: 'high',
      actionItems: [
        'Contact HR to increase 401(k) contribution percentage',
        'Aim for at least 10-15% of gross income',
        'Consider employer matching opportunities',
        'Review investment options within your 401(k)'
      ],
      icon: '💰'
    });
  }

  // HSA recommendation
  if (results.grossIncome > 40000) {
    const hsaSavings = 4300 * 0.22; // Max HSA contribution * tax rate
    recommendations.push({
      id: 'hsa-optimization',
      category: 'tax_strategy',
      title: 'Open a Health Savings Account (HSA)',
      description: 'HSAs offer triple tax advantages: deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.',
      potentialSavings: hsaSavings,
      effort: 'medium',
      priority: 'high',
      actionItems: [
        'Switch to a high-deductible health plan if available',
        'Open an HSA account with a reputable provider',
        'Contribute the maximum annual limit ($4,300 for 2024)',
        'Invest HSA funds for long-term growth'
      ],
      icon: '🏥'
    });
  }

  return recommendations;
}

function generateLocationRecommendations(
  results: TaxCalculationResult,
  stateCode: string
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];
  const currentState = stateTaxRates.states[stateCode as keyof typeof stateTaxRates.states];

  // No-tax state recommendation
  if (!currentState.hasNoTax && results.stateTax > 3000) {
    const noTaxStates = ['FL', 'TX', 'WA', 'NV', 'TN', 'NH', 'SD', 'AK', 'WY'];
    const potentialSavings = results.stateTax * 0.8; // Assume 80% savings accounting for COL differences

    recommendations.push({
      id: 'no-tax-state',
      category: 'location',
      title: 'Consider Moving to a No-Tax State',
      description: 'Relocating to a state with no income tax could significantly increase your take-home pay.',
      potentialSavings,
      effort: 'high',
      priority: results.stateTax > 8000 ? 'high' : 'medium',
      actionItems: [
        'Research job opportunities in tax-free states',
        'Compare cost of living differences',
        'Consider remote work opportunities',
        'Factor in property taxes and sales taxes'
      ],
      icon: '🏠'
    });
  }

  return recommendations;
}

function generateIncomeRecommendations(
  results: TaxCalculationResult,
  hoursPerWeek: number,
  weeksPerYear: number
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];
  const hourlyRate = results.grossIncome / (hoursPerWeek * weeksPerYear);

  // Side income recommendation
  if (hoursPerWeek < 50 && results.grossIncome < 100000) {
    const sideIncomePotential = (50 - hoursPerWeek) * hourlyRate * 52 * 0.5; // 50% efficiency

    recommendations.push({
      id: 'side-income',
      category: 'income',
      title: 'Develop Additional Income Streams',
      description: 'Diversify your income with freelancing, consulting, or passive income opportunities.',
      potentialSavings: sideIncomePotential * 0.7, // After taxes
      effort: 'medium',
      priority: 'medium',
      actionItems: [
        'Identify marketable skills for freelancing',
        'Set up profiles on freelancing platforms',
        'Consider creating digital products or courses',
        'Explore rental income opportunities'
      ],
      icon: '💼'
    });
  }

  // Salary negotiation
  if (results.grossIncome < 150000) {
    const negotiationIncrease = results.grossIncome * 0.1; // 10% increase

    recommendations.push({
      id: 'salary-negotiation',
      category: 'income',
      title: 'Negotiate Your Salary',
      description: 'Research market rates and prepare a case for a salary increase.',
      potentialSavings: negotiationIncrease * 0.7, // After taxes
      effort: 'medium',
      priority: 'high',
      actionItems: [
        'Research industry salary benchmarks',
        'Document your achievements and contributions',
        'Schedule a meeting with your manager',
        'Practice your negotiation points'
      ],
      icon: '📈'
    });
  }

  return recommendations;
}

function generateDeductionRecommendations(
  results: TaxCalculationResult,
  filingStatus: FilingStatus
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // Home office deduction for remote workers
  if (results.grossIncome > 30000) {
    const homeOfficeDeduction = 1500; // Estimated annual home office expenses
    const savings = homeOfficeDeduction * 0.22; // Tax savings

    recommendations.push({
      id: 'home-office-deduction',
      category: 'deductions',
      title: 'Claim Home Office Deduction',
      description: 'If you work from home, you may be eligible for home office tax deductions.',
      potentialSavings: savings,
      effort: 'low',
      priority: 'medium',
      actionItems: [
        'Measure your dedicated home office space',
        'Keep records of home office expenses',
        'Use the simplified method or actual expense method',
        'Consult with a tax professional'
      ],
      icon: '🏡'
    });
  }

  return recommendations;
}

function generateTimingRecommendations(
  results: TaxCalculationResult
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // Year-end tax planning
  recommendations.push({
    id: 'year-end-planning',
    category: 'timing',
    title: 'Optimize Year-End Tax Planning',
    description: 'Strategic timing of income and deductions can reduce your tax burden.',
    potentialSavings: results.totalTax * 0.05, // 5% potential savings
    effort: 'medium',
    priority: 'medium',
    actionItems: [
      'Defer income to next year if beneficial',
      'Accelerate deductions into current year',
      'Harvest investment losses',
      'Make charitable contributions before year-end'
    ],
    icon: '📅'
  });

  return recommendations;
}

function generateSummary(
  results: TaxCalculationResult,
  totalPotentialSavings: number,
  recommendations: OptimizationRecommendation[]
): string {
  const savingsPercentage = (totalPotentialSavings / results.grossIncome) * 100;
  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;

  return `Based on your ${results.grossIncome.toLocaleString()} annual income, we've identified ${recommendations.length} optimization opportunities that could potentially save you $${totalPotentialSavings.toLocaleString()} annually (${savingsPercentage.toFixed(1)}% increase in take-home pay). Focus on the ${highPriorityCount} high-priority recommendations first for maximum impact.`;
}
