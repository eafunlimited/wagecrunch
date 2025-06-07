import federalTaxBrackets from '../data/federalTaxBrackets.json';
import stateTaxRates from '../data/stateTaxRates.json';

export type FilingStatus = 'single' | 'marriedJointly' | 'marriedSeparately' | 'headOfHousehold';

export interface TaxCalculationResult {
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
}

export function calculateFederalTax(income: number, filingStatus: FilingStatus): number {
  const brackets = federalTaxBrackets['2024'][filingStatus];
  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    const min = bracket.min;
    const max = bracket.max || income;

    if (income > min) {
      const taxableInThisBracket = Math.min(income, max) - min;
      tax += taxableInThisBracket * bracket.rate;
      previousMax = max;

      if (bracket.max === null || income <= max) {
        break;
      }
    }
  }

  return tax;
}

export function calculateStateTax(income: number, stateCode: string): number {
  const state = stateTaxRates.states[stateCode as keyof typeof stateTaxRates.states];

  if (!state || state.hasNoTax) {
    return 0;
  }

  // Simplified state tax calculation using average rate
  // In a production app, you'd implement full progressive brackets for each state
  return income * state.rate;
}

export function calculateSocialSecurity(income: number): number {
  const ssData = federalTaxBrackets.socialSecurity;
  const taxableIncome = Math.min(income, ssData.wageBase);
  return taxableIncome * ssData.rate;
}

export function calculateMedicare(income: number, filingStatus: FilingStatus): number {
  const medicareData = federalTaxBrackets.medicare;
  const threshold = medicareData.additionalThreshold[filingStatus];

  let medicare = income * medicareData.rate;

  // Additional Medicare tax for high earners
  if (income > threshold) {
    const additionalTaxableIncome = income - threshold;
    medicare += additionalTaxableIncome * medicareData.additionalRate;
  }

  return medicare;
}

export function calculateTotalTax(
  income: number,
  stateCode: string,
  filingStatus: FilingStatus = 'single'
): TaxCalculationResult {
  const federalTax = calculateFederalTax(income, filingStatus);
  const stateTax = calculateStateTax(income, stateCode);
  const socialSecurity = calculateSocialSecurity(income);
  const medicare = calculateMedicare(income, filingStatus);

  const totalTax = federalTax + stateTax + socialSecurity + medicare;
  const netIncome = income - totalTax;
  const effectiveTaxRate = (totalTax / income) * 100;

  return {
    grossIncome: income,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    totalTax,
    netIncome,
    effectiveTaxRate
  };
}

export function convertHourlyToAnnual(
  hourlyRate: number,
  hoursPerWeek = 40,
  weeksPerYear = 52
): number {
  return hourlyRate * hoursPerWeek * weeksPerYear;
}

export function convertAnnualToHourly(
  annualSalary: number,
  hoursPerWeek = 40,
  weeksPerYear = 52
): number {
  return annualSalary / (hoursPerWeek * weeksPerYear);
}
